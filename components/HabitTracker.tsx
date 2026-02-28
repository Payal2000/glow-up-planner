'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from './ui/SectionHeader'
import FadeInView from './ui/FadeInView'
import { createClient } from '@/lib/supabase/client'
import { useSelectedDate } from '@/context/DateContext'

const DEFAULT_HABITS: string[] = []

const HABITS_KEY = 'user-habits-v2'
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getWeekStart(date: Date): string {
  const day = date.getDay()
  const monday = new Date(date)
  monday.setDate(date.getDate() - ((day + 6) % 7))
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString().split('T')[0]
}

function loadHabitList(): string[] {
  if (typeof window === 'undefined') return DEFAULT_HABITS
  try {
    const raw = window.localStorage.getItem(HABITS_KEY)
    if (!raw) return DEFAULT_HABITS
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : DEFAULT_HABITS
  } catch { return DEFAULT_HABITS }
}

function saveHabitList(list: string[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(HABITS_KEY, JSON.stringify(list))
}

export default function HabitTracker() {
  const supabase = createClient()
  const { selectedDate } = useSelectedDate()
  const weekStart = getWeekStart(selectedDate)

  const [habitList, setHabitList] = useState<string[]>(DEFAULT_HABITS)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [authChecked, setAuthChecked] = useState(false)

  // Editing state
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const weekLabel = useMemo(() =>
    new Date(weekStart + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  [weekStart])

  // Load habit list from DB (fall back to localStorage/defaults)
  useEffect(() => {
    async function loadHabits() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setHabitList(loadHabitList()); return }
      const { data: row } = await supabase
        .from('habit_settings').select('habits').eq('user_id', user.id).maybeSingle()
      if (row?.habits && row.habits.length > 0) {
        setHabitList(row.habits)
      } else {
        setHabitList(loadHabitList())
      }
    }
    loadHabits()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const toRecord = (s: Set<string>) => Object.fromEntries([...s].map(k => [k, true]))
  const fromRecord = (r: Record<string, boolean>) =>
    new Set(Object.entries(r).filter(([, v]) => v).map(([k]) => k))

  const storageKey = `habit-week-${weekStart}`
  const readLocal = (): Set<string> => {
    if (typeof window === 'undefined') return new Set()
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (!raw) return new Set()
      const parsed = JSON.parse(raw)
      return fromRecord(typeof parsed === 'object' && parsed !== null ? parsed : {})
    } catch { return new Set() }
  }
  const writeLocal = (s: Set<string>) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(storageKey, JSON.stringify(toRecord(s)))
  }

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (cancelled) return
      if (!user) {
        setUserId(null); setSelected(readLocal()); setLoading(false); setAuthChecked(true); return
      }
      setUserId(user.id)
      const { data: row } = await supabase
        .from('habit_weeks').select('filled').eq('user_id', user.id).eq('week_start', weekStart).maybeSingle()
      if (!cancelled) {
        setSelected(row?.filled ? fromRecord(row.filled) : new Set())
        setLoading(false); setAuthChecked(true)
      }
    }
    load()
    return () => { cancelled = true }
  }, [weekStart]) // eslint-disable-line react-hooks/exhaustive-deps

  const persist = async (next: Set<string>) => {
    setSelected(next)
    if (!userId) { writeLocal(next); return }
    setStatus('saving')
    const { error } = await supabase.from('habit_weeks').upsert(
      { user_id: userId, week_start: weekStart, filled: toRecord(next), updated_at: new Date().toISOString() },
      { onConflict: 'user_id,week_start' },
    )
    if (error) setStatus('error')
    else { setStatus('saved'); setTimeout(() => setStatus('idle'), 2000) }
  }

  // Use habit name as key (name-day) so indices don't matter
  const habitKey = (name: string, day: string) => `${name}::${day}`

  const toggle = (name: string, day: string) => {
    const k = habitKey(name, day)
    const next = new Set(selected)
    if (next.has(k)) next.delete(k); else next.add(k)
    persist(next)
  }

  // Clear all days for a specific habit
  const clearHabitRow = (name: string) => {
    const next = new Set(selected)
    days.forEach(d => next.delete(habitKey(name, d)))
    persist(next)
  }

  // Clear all completions
  const clearAll = () => persist(new Set())

  // ── Habit list management ─────────────────────────────────────────────────
  const persistHabitList = async (list: string[]) => {
    saveHabitList(list)
    if (!userId) return
    await supabase.from('habit_settings').upsert(
      { user_id: userId, habits: list, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    )
  }

  const addHabit = () => {
    const newList = [...habitList, 'New Habit']
    setHabitList(newList)
    persistHabitList(newList)
    // Start editing the new one
    setEditingIdx(newList.length - 1)
    setEditValue('New Habit')
    setTimeout(() => inputRef.current?.select(), 50)
  }

  const removeHabit = (idx: number) => {
    const name = habitList[idx]
    const newList = habitList.filter((_, i) => i !== idx)
    setHabitList(newList)
    persistHabitList(newList)
    // Clean up completions for removed habit
    const next = new Set(selected)
    days.forEach(d => next.delete(habitKey(name, d)))
    persist(next)
  }

  const startEdit = (idx: number) => {
    setEditingIdx(idx)
    setEditValue(habitList[idx])
    setTimeout(() => inputRef.current?.select(), 50)
  }

  const commitEdit = () => {
    if (editingIdx === null) return
    const oldName = habitList[editingIdx]
    const newName = editValue.trim() || oldName
    if (newName !== oldName) {
      // Migrate completions to new name
      const next = new Set(selected)
      days.forEach(d => {
        const oldKey = habitKey(oldName, d)
        const newKey = habitKey(newName, d)
        if (next.has(oldKey)) { next.delete(oldKey); next.add(newKey) }
      })
      const newList = habitList.map((h, i) => i === editingIdx ? newName : h)
      setHabitList(newList)
      persistHabitList(newList)
      persist(next)
    }
    setEditingIdx(null)
  }

  // ── Habit Analysis ────────────────────────────────────────────────────────
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [analysis, setAnalysis] = useState('')

  const analyseHabits = async () => {
    setAnalysisStatus('loading')
    try {
      const res = await fetch('/api/agent/habit-analysis', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      if (!res.ok) throw new Error()
      const json = await res.json()
      setAnalysis(json.analysis); setAnalysisStatus('done')
    } catch { setAnalysisStatus('error') }
  }

  // ── Weekly Wrap ───────────────────────────────────────────────────────────
  const [wrapStatus, setWrapStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [wrap, setWrap] = useState('')
  const [wrapSavedTo, setWrapSavedTo] = useState('')

  const generateWrap = async () => {
    setWrapStatus('loading')
    try {
      const res = await fetch('/api/agent/weekly-wrap', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ weekStart }) })
      if (!res.ok) throw new Error()
      const json = await res.json()
      setWrap(json.wrap); setWrapSavedTo(json.savedTo ?? ''); setWrapStatus('done')
    } catch { setWrapStatus('error') }
  }

  // ── Bullet component ──────────────────────────────────────────────────────
  const Bullet = ({ name, day, mobile = false }: { name: string; day: string; mobile?: boolean }) => {
    const isFilled = selected.has(habitKey(name, day))
    const size = mobile ? 'w-6 h-6' : 'w-5 h-5 sm:w-[22px] sm:h-[22px]'
    return (
      <motion.button
        onClick={() => toggle(name, day)}
        disabled={loading}
        className={`${size} rounded-full border-2 inline-block cursor-pointer transition-colors`}
        style={{ borderColor: isFilled ? '#b5375a' : '#f5d5de', background: isFilled ? '#c9445e' : 'transparent' }}
        whileTap={loading ? undefined : { scale: 0.75 }}
        whileHover={{ borderColor: '#e8a0b4', backgroundColor: isFilled ? '#c9445e' : '#fdf0f4' }}
        transition={{ duration: 0.15 }}
        aria-label={`Toggle ${name} on ${day}`}
      />
    )
  }

  const completedForHabit = (name: string) => days.filter(d => selected.has(habitKey(name, d))).length

  return (
    <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-12" id="habits">
      <SectionHeader iconSrc="/icons/ribbon.png" label="Stay Consistent" title="Habit Tracker" subtitle="Small daily actions compound into massive results." />

      <FadeInView delay={0.1}>
        <div className="bg-[#fffcf8] rounded-[20px] shadow-card overflow-hidden">

          {/* ── Header ── */}
          <div
            className="px-4 sm:px-9 py-5 sm:py-7 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-wrap"
            style={{ background: 'linear-gradient(135deg, #fdf0f4, #fce8ef)' }}
          >
            <div>
              <h3 className="font-playfair text-2xl text-ink-dark mb-1">This Week&apos;s Habits</h3>
              <p className="font-cormorant text-[15px] text-ink-soft" suppressHydrationWarning>Week starting {weekLabel}</p>
              {!userId && authChecked && (
                <p className="text-[11px] text-ink-faint mt-0.5">Not signed in — progress saved locally only.</p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <AnimatePresence>
                {status === 'saved' && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="text-[11px] text-petal-deep font-semibold bg-white/70 px-3 py-1 rounded-full"
                  >✓ Saved</motion.span>
                )}
              </AnimatePresence>

              {selected.size > 0 && (
                <motion.button onClick={clearAll} className="text-[11px] font-semibold tracking-wider uppercase text-ink-soft bg-white/70 hover:bg-[#fffcf8] px-3.5 py-1.5 rounded-full transition-colors" whileTap={{ scale: 0.95 }}>
                  Clear All
                </motion.button>
              )}

              <motion.button onClick={analyseHabits} disabled={analysisStatus === 'loading' || loading} className="text-[11px] font-semibold tracking-wider uppercase text-petal-deep bg-white/70 hover:bg-[#fffcf8] px-3.5 py-1.5 rounded-full transition-colors disabled:opacity-50" whileTap={{ scale: 0.95 }}>
                {analysisStatus === 'loading' ? 'Analysing…' : '🔍 Analyse'}
              </motion.button>

              <motion.button onClick={generateWrap} disabled={wrapStatus === 'loading'} className="text-[11px] font-semibold tracking-wider uppercase text-petal-deep bg-white/70 hover:bg-[#fffcf8] px-3.5 py-1.5 rounded-full transition-colors disabled:opacity-50" whileTap={{ scale: 0.95 }}>
                {wrapStatus === 'loading' ? 'Writing…' : '📝 Weekly Wrap'}
              </motion.button>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="p-4 sm:p-7 md:p-9">

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse min-w-[520px]">
                <thead>
                  <tr>
                    <th className="text-left text-[11px] font-semibold tracking-[1px] uppercase text-ink-soft py-2.5 px-1.5 w-[240px]">Habit</th>
                    {days.map(d => (
                      <th key={d} className="text-center text-[11px] font-semibold tracking-[1px] uppercase text-ink-soft py-2.5 px-1">{d}</th>
                    ))}
                    <th className="w-16" />
                  </tr>
                </thead>
                <tbody>
                  {habitList.map((habit, hi) => (
                    <motion.tr
                      key={`${hi}-${habit}`}
                      className="border-b group"
                      style={{ borderColor: 'rgba(200,160,170,0.08)' }}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: hi * 0.04 }}
                    >
                      <td className="py-2 px-1.5">
                        {editingIdx === hi ? (
                          <input
                            ref={inputRef}
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onBlur={commitEdit}
                            onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingIdx(null) }}
                            className="w-full text-[13px] text-ink-dark bg-petal-pale rounded-lg px-2 py-1 outline-none border border-petal"
                            autoFocus
                          />
                        ) : (
                          <span
                            onClick={() => startEdit(hi)}
                            title="Click to edit"
                            className="text-[13px] text-ink-mid cursor-text hover:text-ink-dark transition-colors flex items-center gap-1.5 group/name"
                          >
                            {habit}
                            <span className="text-[10px] text-ink-faint opacity-0 group-hover/name:opacity-100 transition-opacity">✏️</span>
                          </span>
                        )}
                      </td>
                      {days.map(day => (
                        <td key={day} className="text-center py-2 px-1">
                          <Bullet name={habit} day={day} />
                        </td>
                      ))}
                      <td className="py-2 px-1">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          {completedForHabit(habit) > 0 && (
                            <motion.button
                              onClick={() => clearHabitRow(habit)}
                              title="Clear row"
                              className="text-[10px] text-ink-faint hover:text-petal-deep w-5 h-5 flex items-center justify-center rounded-full hover:bg-petal-pale transition-colors"
                              whileTap={{ scale: 0.85 }}
                            >↺</motion.button>
                          )}
                          <button
                            onClick={() => removeHabit(hi)}
                            title="Remove habit"
                            className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors opacity-40 hover:opacity-100"
                          ><img src="/icons/dustbin.png" alt="remove" className="w-4 h-4 object-contain" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden space-y-3">
              {habitList.map((habit, hi) => (
                <div key={`${hi}-${habit}`} className="border border-[rgba(200,160,170,0.2)] rounded-2xl p-4 bg-warm-white/80">
                  <div className="flex items-center justify-between mb-3 gap-2">
                    {editingIdx === hi ? (
                      <input
                        ref={inputRef}
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingIdx(null) }}
                        className="flex-1 text-[13px] text-ink-dark bg-petal-pale rounded-lg px-2 py-1 outline-none border border-petal"
                        autoFocus
                      />
                    ) : (
                      <p onClick={() => startEdit(hi)} className="text-[13px] font-medium text-ink-mid cursor-text flex-1">{habit}</p>
                    )}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {completedForHabit(habit) > 0 && (
                        <button onClick={() => clearHabitRow(habit)} className="text-[11px] text-ink-faint hover:text-petal-deep w-6 h-6 flex items-center justify-center rounded-full hover:bg-petal-pale transition-colors">↺</button>
                      )}
                      <button onClick={() => removeHabit(hi)} title="Remove habit" className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors opacity-40 hover:opacity-100"><img src="/icons/dustbin.png" alt="remove" className="w-4 h-4 object-contain" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {days.map(day => (
                      <div key={day} className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-semibold uppercase text-ink-faint">{day}</span>
                        <Bullet name={habit} day={day} mobile />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Habit button */}
            <motion.button
              onClick={addHabit}
              className="mt-4 w-full py-2.5 rounded-2xl border border-dashed border-petal-light text-[12px] font-semibold text-ink-faint hover:text-petal-deep hover:border-petal hover:bg-petal-pale transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              + Add Habit
            </motion.button>

            {/* Habit Analysis Panel */}
            <AnimatePresence>
              {(analysisStatus === 'done' || analysisStatus === 'error') && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="overflow-hidden">
                  <div className="mt-6 rounded-[16px] p-5 border border-petal-light" style={{ background: 'linear-gradient(135deg, #fdf0f4, #fce8ef)' }}>
                    {analysisStatus === 'done' ? (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[10px] font-semibold tracking-[3px] uppercase text-petal">🔍 4-Week Habit Insights</p>
                          <button onClick={() => setAnalysisStatus('idle')} className="text-[11px] text-ink-faint hover:text-ink-soft transition-colors">Dismiss</button>
                        </div>
                        <p className="font-cormorant text-[16px] text-ink-mid leading-relaxed whitespace-pre-wrap">{analysis}</p>
                      </>
                    ) : (
                      <p className="text-[12px] text-red-400">Could not analyse habits — check your OPENAI_API_KEY and try again.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Weekly Wrap Panel */}
            <AnimatePresence>
              {(wrapStatus === 'done' || wrapStatus === 'error') && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="overflow-hidden">
                  <div className="mt-4 rounded-[16px] p-5 border border-petal-light" style={{ background: 'linear-gradient(135deg, #fdf0f4, #fce8ef)' }}>
                    {wrapStatus === 'done' ? (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-[10px] font-semibold tracking-[3px] uppercase text-petal">📝 Weekly Wrap-Up</p>
                            {wrapSavedTo && (
                              <p className="text-[10px] text-ink-faint mt-0.5">Auto-saved to {new Date(wrapSavedTo + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} notes</p>
                            )}
                          </div>
                          <button onClick={() => setWrapStatus('idle')} className="text-[11px] text-ink-faint hover:text-ink-soft transition-colors">Dismiss</button>
                        </div>
                        <p className="font-cormorant text-[16px] text-ink-mid leading-relaxed whitespace-pre-wrap">{wrap}</p>
                      </>
                    ) : (
                      <p className="text-[12px] text-red-400">Could not generate wrap-up — check your OPENAI_API_KEY and try again.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </FadeInView>
    </section>
  )
}
