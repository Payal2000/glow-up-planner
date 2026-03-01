'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from './ui/SectionHeader'
import FadeInView from './ui/FadeInView'
import PlannerCard from './ui/PlannerCard'
import ProgressBar from './ui/ProgressBar'
import { createClient } from '@/lib/supabase/client'
import { useSelectedDate } from '@/context/DateContext'

const DEFAULT_LABELS = [
  'Weight', 'Left Arm', 'Right Arm', 'Chest',
  'Waist', 'Hips', 'Left Thigh', 'Right Thigh',
]
const DEFAULT_SESSIONS = 5

type BodySession = { date: string; values: Record<string, string> }

interface FitnessState {
  bodyLabels:   string[]
  bodySessions: BodySession[]
  goalTitle:    string
  goalPercent:  number
  notes:        string
}

const defaults = (): FitnessState => ({
  bodyLabels:   DEFAULT_LABELS,
  bodySessions: Array.from({ length: DEFAULT_SESSIONS }, () => ({ date: '', values: {} })),
  goalTitle:    '',
  goalPercent:  0,
  notes:        '',
})

const taClass = 'w-full border border-dashed border-petal-light rounded-lg p-3 font-dm text-[13px] text-ink-mid bg-transparent resize-y outline-none focus:border-petal transition-colors placeholder:text-ink-faint'
const bd      = 'border border-[rgba(200,160,170,0.25)]'

export default function FitnessSection() {
  const supabase = createClient()
  const { selectedDate } = useSelectedDate()
  const formattedDate = selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const [fitness, setFitness]   = useState<FitnessState>(defaults)
  const [userId,  setUserId]    = useState<string | null>(null)
  const [loading, setLoading]   = useState(true)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  const saveTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstLoad = useRef(true)

  // ── Load ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    isFirstLoad.current = true

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || cancelled) return
      setUserId(user.id)

      const { data: row } = await supabase
        .from('fitness_data')
        .select('body_labels, body_sessions, goal_title, goal_percent, notes')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!cancelled) {
        if (row) {
          setFitness({
            bodyLabels:   row.body_labels   ?? DEFAULT_LABELS,
            bodySessions: row.body_sessions ?? defaults().bodySessions,
            goalTitle:    row.goal_title    ?? '',
            goalPercent:  row.goal_percent  ?? 0,
            notes:        row.notes         ?? '',
          })
        }
        setLoading(false)
        setTimeout(() => { isFirstLoad.current = false }, 0)
      }
    }

    load()
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-save (debounced 800ms) ──────────────────────────────────────────────
  useEffect(() => {
    if (loading || isFirstLoad.current || !userId) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setSaveStatus('saving')
      const { error } = await supabase
        .from('fitness_data')
        .upsert(
          {
            user_id:       userId,
            body_labels:   fitness.bodyLabels,
            body_sessions: fitness.bodySessions,
            goal_title:    fitness.goalTitle,
            goal_percent:  fitness.goalPercent,
            notes:         fitness.notes,
            updated_at:    new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )
      if (!error) {
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 1500)
      } else {
        setSaveStatus('idle')
      }
    }, 800)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [fitness]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const sessions = fitness.bodySessions
  const labels   = fitness.bodyLabels

  const set = useCallback((patch: Partial<FitnessState>) => {
    setFitness(prev => ({ ...prev, ...patch }))
  }, [])

  // Sessions
  const updateDate    = (ci: number, date: string) =>
    set({ bodySessions: sessions.map((s, i) => i === ci ? { ...s, date } : s) })

  const addSession    = () =>
    set({ bodySessions: [...sessions, { date: '', values: {} }] })

  const removeSession = (ci: number) => {
    if (sessions.length <= 1) return
    set({ bodySessions: sessions.filter((_, i) => i !== ci) })
  }

  // Cells
  const updateValue = (ci: number, label: string, value: string) =>
    set({ bodySessions: sessions.map((s, i) =>
      i === ci ? { ...s, values: { ...s.values, [label]: value } } : s
    )})

  // Labels
  const updateLabel = (ri: number, value: string) => {
    const old = labels[ri]
    set({
      bodyLabels:   labels.map((l, i) => i === ri ? value : l),
      bodySessions: sessions.map(s => {
        const v = { ...s.values }
        if (old in v) { v[value] = v[old]; delete v[old] }
        return { ...s, values: v }
      }),
    })
  }

  const addLabel    = () => set({ bodyLabels: [...labels, ''] })

  const removeLabel = (ri: number) => {
    const label = labels[ri]
    set({
      bodyLabels:   labels.filter((_, i) => i !== ri),
      bodySessions: sessions.map(s => {
        const v = { ...s.values }; delete v[label]
        return { ...s, values: v }
      }),
    })
  }

  const clearAll = () => {
    if (!confirm('Clear all measurement values? Labels and dates will be kept.')) return
    set({ bodySessions: sessions.map(s => ({ ...s, values: {} })) })
  }

  return (
    <section className="max-w-[1300px] mx-auto px-4 sm:px-6 py-8 sm:py-12" id="fitness">
      <SectionHeader iconSrc="/icons/headphones.png" label="Move Your Body" title="Fitness & Glow-Up" subtitle="Track your body measurements and progress over time." />

      <FadeInView delay={0.1}>
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">

          {/* ── Body Measurements Table ── */}
          <div className="flex-1 bg-[#fffcf8] rounded-[20px] shadow-card overflow-hidden">

            {/* Header */}
            <div
              className="px-6 sm:px-8 py-4 border-b flex items-center justify-between flex-wrap gap-3"
              style={{ borderColor: 'rgba(200,160,170,0.12)', background: 'linear-gradient(135deg, #fdf5f7 0%, #fffcf8 100%)' }}
            >
              <h2 className="font-playfair text-2xl font-bold text-petal-deep">Body Measurements</h2>
              <div className="flex items-center gap-2">
                {saveStatus === 'saving' && <span className="text-[11px] text-ink-faint">Saving…</span>}
                {saveStatus === 'saved'  && <span className="text-[11px] font-semibold text-petal-deep">✓ Saved</span>}
                <motion.button
                  onClick={clearAll}
                  className="text-[11px] font-semibold tracking-wide uppercase px-4 py-1.5 rounded-full border border-petal-light text-ink-soft hover:text-red-400 hover:border-red-200 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  Clear All
                </motion.button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ minWidth: 480 }}>
                <thead>
                  <tr style={{ background: '#fdf0f4' }}>
                    <th className={`text-[11px] font-semibold text-petal-deep py-2.5 px-3 text-left w-[130px] ${bd}`}>
                      Measurement
                    </th>
                    {sessions.map((session, ci) => (
                      <th key={ci} className={`text-[11px] font-semibold text-petal-deep py-1.5 px-2 text-center min-w-[90px] ${bd}`}>
                        <div className="flex flex-col items-center gap-0.5">
                          {ci === 0 ? (
                            <span className="text-[11px] font-semibold text-petal-deep">{formattedDate}</span>
                          ) : (
                            <input
                              type="text"
                              value={session.date}
                              onChange={e => updateDate(ci, e.target.value)}
                              placeholder="Date"
                              className="w-full text-center text-[11px] font-semibold text-petal-deep bg-transparent outline-none placeholder:text-petal-deep/40"
                            />
                          )}
                          {sessions.length > 1 && (
                            <button
                              onClick={() => removeSession(ci)}
                              className="text-[9px] text-petal-light hover:text-red-400 transition-colors"
                            >✕ remove</button>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className={`w-10 ${bd} text-center`}>
                      <button
                        onClick={addSession}
                        title="Add session"
                        className="text-petal-deep hover:text-petal transition-colors text-[16px] leading-none"
                      >+</button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {labels.map((label, ri) => (
                      <motion.tr
                        key={ri}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ background: ri % 2 === 0 ? '#fdf8fa' : '#fffcf8' }}
                      >
                        <td className={`py-2 px-2 ${bd}`}>
                          <input
                            type="text"
                            value={label}
                            onChange={e => updateLabel(ri, e.target.value)}
                            placeholder="Measurement"
                            className="w-full text-[12px] font-semibold text-ink-mid bg-transparent outline-none border-b border-transparent focus:border-petal-light transition-colors placeholder:text-ink-faint"
                          />
                        </td>
                        {sessions.map((session, ci) => (
                          <td key={ci} className={`py-2 px-2 ${bd}`}>
                            <input
                              type="text"
                              value={session.values[label] ?? ''}
                              onChange={e => updateValue(ci, label, e.target.value)}
                              placeholder="—"
                              className="w-full text-center text-[13px] bg-transparent outline-none text-gray-700 placeholder:text-gray-300"
                            />
                          </td>
                        ))}
                        <td className={`py-2 px-2 ${bd} text-center w-10`}>
                          <button
                            onClick={() => removeLabel(ri)}
                            className="text-[13px] text-petal-light hover:text-red-400 transition-colors"
                            title="Remove row"
                          >✕</button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-t" style={{ borderColor: 'rgba(200,160,170,0.1)' }}>
              <p className="font-cormorant italic text-[13px] text-ink-soft">Focus on progress, not perfection</p>
              <div className="flex items-center gap-2">
                <motion.button onClick={addLabel} className="text-[11px] font-semibold tracking-wide uppercase px-4 py-1.5 rounded-full border border-petal-light text-petal-deep hover:bg-petal-pale transition-colors" whileTap={{ scale: 0.95 }}>
                  + Add Row
                </motion.button>
                <motion.button onClick={addSession} className="text-[11px] font-semibold tracking-wide uppercase px-4 py-1.5 rounded-full border border-petal-light text-petal-deep hover:bg-petal-pale transition-colors" whileTap={{ scale: 0.95 }}>
                  + Add Session
                </motion.button>
              </div>
            </div>
          </div>

          {/* ── Fitness Goals ── */}
          <div className="lg:w-[280px] flex-shrink-0">
            <PlannerCard color="lavender" title="🎯 Fitness Goals" desc="What are you working toward?" style={{ background: '#ffffff' }}>
              <div className="mb-3">
                <input
                  value={fitness.goalTitle}
                  onChange={e => set({ goalTitle: e.target.value })}
                  placeholder="Goal: ____________________"
                  className="w-full text-[13px] text-ink-mid bg-transparent outline-none border-b border-petal-light focus:border-petal transition-colors mb-2 pb-1"
                />
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] text-ink-soft">Progress:</span>
                  <input
                    type="range" min={0} max={100}
                    value={fitness.goalPercent}
                    onChange={e => set({ goalPercent: Number(e.target.value) })}
                    className="flex-1 accent-petal-deep"
                  />
                  <span className="text-[11px] font-semibold text-petal-deep w-8">{fitness.goalPercent}%</span>
                </div>
                <ProgressBar title="" percent={fitness.goalPercent} label={`${fitness.goalPercent}% there`} />
              </div>
              <textarea
                value={fitness.notes}
                onChange={e => set({ notes: e.target.value })}
                placeholder="Notes: what's working, what to adjust..."
                style={{ minHeight: 120 }}
                className={taClass}
              />
            </PlannerCard>
          </div>

        </div>
      </FadeInView>
    </section>
  )
}
