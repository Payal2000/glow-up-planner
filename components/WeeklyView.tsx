'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from './ui/SectionHeader'
import FadeInView from './ui/FadeInView'
import { createClient } from '@/lib/supabase/client'

type Status = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected' | 'Withdrawn' | ''
type NextAction = 'Prepare Interview' | 'Follow up' | 'Send email' | 'Waiting' | 'Decide'

interface Application {
  id: string
  company: string
  position: string
  status: Status
  date: string
  salary: string
  nextActions: NextAction[]
  website: string
  contact: string
  referenceLink: string
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Applied:      { bg: '#dbeafe', text: '#3b6fa0' },
  Interviewing: { bg: '#fef3c7', text: '#92670a' },
  Offer:        { bg: '#ede9fe', text: '#7c3aed' },
  Rejected:     { bg: '#fce7f3', text: '#be185d' },
  Withdrawn:    { bg: '#f3f4f6', text: '#6b7280' },
}

const ACTION_COLORS: Record<string, { bg: string; text: string }> = {
  'Prepare Interview': { bg: '#dbeafe', text: '#3b6fa0' },
  'Follow up':         { bg: '#d1fae5', text: '#065f46' },
  'Send email':        { bg: '#fce7f3', text: '#be185d' },
  'Waiting':           { bg: '#fef3c7', text: '#92670a' },
  'Decide':            { bg: '#ede9fe', text: '#7c3aed' },
}


function newApp(): Application {
  return { id: Date.now().toString(), company: '', position: '', status: '', date: '', salary: '', nextActions: [], website: '', contact: '', referenceLink: '' }
}

const STORAGE_KEY = 'job-applications-v1'

export default function WeeklyView() {
  const supabase = createClient()
  const [apps, setApps] = useState<Application[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const { data: row } = await supabase
          .from('daily_plans')
          .select('data')
          .eq('user_id', user.id)
          .eq('date', 'job-tracker')
          .maybeSingle()
        if (row?.data?.applications) { setApps(row.data.applications); return }
      }
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        setApps(raw ? JSON.parse(raw) : [])
      } catch { setApps([]) }
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const persist = useCallback(async (next: Application[]) => {
    setApps(next)
    if (userId) {
      setSaveStatus('saving')
      await supabase.from('daily_plans').upsert(
        { user_id: userId, date: 'job-tracker', data: { applications: next }, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,date' }
      )
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    }
  }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

  const update = (id: string, field: keyof Application, value: unknown) =>
    persist(apps.map(a => a.id === id ? { ...a, [field]: value } : a))

  const toggleAction = (id: string, action: NextAction) => {
    const app = apps.find(a => a.id === id)
    if (!app) return
    const has = app.nextActions.includes(action)
    update(id, 'nextActions', has ? app.nextActions.filter(a => a !== action) : [...app.nextActions, action])
  }

  const addRow = () => persist([...apps, newApp()])
  const deleteRow = (id: string) => persist(apps.filter(a => a.id !== id))

  const statusLabel = saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? '✓ Saved' : userId ? 'Synced to cloud' : 'Saved locally'
  const offerCount = apps.filter(a => a.status === 'Offer').length

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12" id="weekly">
      <SectionHeader
        icon="💼"
        label="Career"
        title="Job Application Tracker"
        subtitle="Track every application, interview, and offer in one place."
      />

      <FadeInView delay={0.1}>
        <div className="bg-white rounded-[20px] shadow-card overflow-hidden">

          {/* Table header bar */}
          <div
            className="px-5 sm:px-7 py-4 border-b flex items-center justify-between gap-3"
            style={{ borderColor: 'rgba(200,160,170,0.12)', background: 'linear-gradient(135deg, #fdf5f7 0%, #fff 100%)' }}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-[12px] font-semibold tracking-[1.5px] uppercase text-ink-soft">Applications History</span>
              <span className="text-[11px] font-bold text-petal-deep bg-petal-pale rounded-full px-2 py-0.5">{apps.length}</span>
            </div>
            <span className="text-[11px] font-semibold tracking-wide uppercase text-petal-deep">{statusLabel}</span>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(200,160,170,0.12)' }}>
                  {['Company', 'Position', 'Status', 'Application Date', 'Salary', 'Next Action', 'Website', 'Contact', 'Reference Link'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold tracking-[1px] uppercase text-ink-faint py-3 px-4 whitespace-nowrap">{h}</th>
                  ))}
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {apps.map((app, i) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="group border-b hover:bg-[#fdfafc] transition-colors"
                    style={{ borderColor: 'rgba(200,160,170,0.08)' }}
                  >
                    <td className="py-2.5 px-4">
                      <input
                        value={app.company}
                        onChange={e => update(app.id, 'company', e.target.value)}
                        placeholder="Company"
                        className="w-full text-[13px] font-semibold text-gray-700 bg-transparent outline-none border-b border-transparent hover:border-gray-200 focus:border-petal transition-colors pb-0.5 min-w-[100px] placeholder:text-gray-300"
                      />
                    </td>
                    <td className="py-2.5 px-4">
                      <input
                        value={app.position}
                        onChange={e => update(app.id, 'position', e.target.value)}
                        placeholder="Position"
                        className="w-full text-[13px] text-gray-500 bg-transparent outline-none border-b border-transparent hover:border-gray-200 focus:border-petal transition-colors pb-0.5 min-w-[120px] placeholder:text-gray-300"
                      />
                    </td>
                    <td className="py-2.5 px-4">
                      <StatusSelect value={app.status} onChange={v => update(app.id, 'status', v)} />
                    </td>
                    <td className="py-2.5 px-4">
                      <input
                        type="date"
                        value={app.date}
                        onChange={e => update(app.id, 'date', e.target.value)}
                        className="text-[13px] text-gray-500 bg-transparent outline-none border-b border-transparent hover:border-gray-200 focus:border-petal transition-colors pb-0.5"
                      />
                    </td>
                    <td className="py-2.5 px-4">
                      <input
                        value={app.salary}
                        onChange={e => update(app.id, 'salary', e.target.value)}
                        placeholder="e.g. $90k"
                        className="w-full text-[13px] text-gray-500 bg-transparent outline-none border-b border-transparent hover:border-gray-200 focus:border-petal transition-colors pb-0.5 min-w-[70px] placeholder:text-gray-300"
                      />
                    </td>
                    <td className="py-2.5 px-4">
                      <NextActionSelect actions={app.nextActions} onChange={a => toggleAction(app.id, a)} />
                    </td>
                    <td className="py-2.5 px-4">
                      <input
                        value={app.website}
                        onChange={e => update(app.id, 'website', e.target.value)}
                        placeholder="site.com"
                        className="w-full text-[13px] text-gray-500 bg-transparent outline-none border-b border-transparent hover:border-gray-200 focus:border-petal transition-colors pb-0.5 min-w-[80px] placeholder:text-gray-300"
                      />
                    </td>
                    <td className="py-2.5 px-4">
                      <input
                        value={app.contact}
                        onChange={e => update(app.id, 'contact', e.target.value)}
                        placeholder="Name"
                        className="w-full text-[13px] text-gray-500 bg-transparent outline-none border-b border-transparent hover:border-gray-200 focus:border-petal transition-colors pb-0.5 min-w-[80px] placeholder:text-gray-300"
                      />
                    </td>
                    <td className="py-2.5 px-4">
                      <input
                        value={app.referenceLink}
                        onChange={e => update(app.id, 'referenceLink', e.target.value)}
                        placeholder="Link / Note"
                        className="w-full text-[13px] text-gray-500 bg-transparent outline-none border-b border-transparent hover:border-gray-200 focus:border-petal transition-colors pb-0.5 min-w-[90px] placeholder:text-gray-300"
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <button
                        onClick={() => deleteRow(app.id)}
                        className="opacity-0 group-hover:opacity-100 text-ink-faint hover:text-red-400 transition-all text-[13px] w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50"
                      >
                        ✕
                      </button>
                    </td>
                  </motion.tr>
                ))}
                {apps.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-14 text-center text-[13px] text-ink-faint">
                      No applications yet — add one below!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-[rgba(200,160,170,0.1)]">
            {apps.map(app => (
              <div key={app.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <input value={app.company} onChange={e => update(app.id, 'company', e.target.value)} placeholder="Company" className="text-[14px] font-semibold text-gray-700 bg-transparent outline-none w-full placeholder:text-gray-300" />
                    <input value={app.position} onChange={e => update(app.id, 'position', e.target.value)} placeholder="Position" className="text-[12px] text-ink-soft bg-transparent outline-none w-full mt-0.5 placeholder:text-gray-300" />
                  </div>
                  <div className="flex items-center gap-2 shrink-0 pt-0.5">
                    <StatusSelect value={app.status} onChange={v => update(app.id, 'status', v)} />
                    <button onClick={() => deleteRow(app.id)} className="text-ink-faint hover:text-red-400 text-[12px] w-5 h-5 flex items-center justify-center">✕</button>
                  </div>
                </div>
                <NextActionSelect actions={app.nextActions} onChange={a => toggleAction(app.id, a)} />
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[12px] text-ink-soft">
                  <input type="date" value={app.date} onChange={e => update(app.id, 'date', e.target.value)} className="bg-transparent outline-none" />
                  <input value={app.salary} onChange={e => update(app.id, 'salary', e.target.value)} placeholder="Salary" className="bg-transparent outline-none placeholder:text-gray-300" />
                  <input value={app.website} onChange={e => update(app.id, 'website', e.target.value)} placeholder="Website" className="bg-transparent outline-none placeholder:text-gray-300" />
                  <input value={app.contact} onChange={e => update(app.id, 'contact', e.target.value)} placeholder="Contact" className="bg-transparent outline-none placeholder:text-gray-300" />
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 sm:px-7 py-4 border-t flex items-center justify-between gap-3" style={{ borderColor: 'rgba(200,160,170,0.1)' }}>
            <div className="flex items-center gap-4 text-[11px] text-ink-faint">
              <span>COUNT {apps.length}</span>
              {offerCount > 0 && (
                <span className="text-[#7c3aed] font-semibold">🎉 {offerCount} Offer{offerCount > 1 ? 's' : ''}</span>
              )}
              {apps.filter(a => a.status === 'Interviewing').length > 0 && (
                <span className="text-[#92670a] font-semibold">
                  📅 {apps.filter(a => a.status === 'Interviewing').length} Interview{apps.filter(a => a.status === 'Interviewing').length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button
              onClick={addRow}
              className="text-[12px] font-semibold px-4 py-2 rounded-full border border-petal-light text-gray-500 hover:bg-petal-pale hover:border-petal transition-colors"
            >
              + Add Application
            </button>
          </div>
        </div>
      </FadeInView>
    </section>
  )
}

function StatusSelect({ value, onChange }: { value: Status; onChange: (v: Status) => void }) {
  const [open, setOpen] = useState(false)
  const statuses: Status[] = ['Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn']
  const colors = STATUS_COLORS[value as string] ?? { bg: '#f3f4f6', text: '#9c7e7e' }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition-opacity hover:opacity-80"
        style={{ background: colors.bg, color: colors.text }}
      >
        {value || '+ Status'}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.12 }}
              className="absolute top-full left-0 mt-1.5 z-20 bg-white rounded-2xl shadow-lg border border-petal-light p-1.5 min-w-[140px]"
            >
              {statuses.map(s => {
                const c = STATUS_COLORS[s]
                return (
                  <button
                    key={s}
                    onClick={() => { onChange(s); setOpen(false) }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-petal-pale transition-colors flex items-center gap-2"
                  >
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.text }}>{s}</span>
                  </button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function NextActionSelect({ actions, onChange }: { actions: NextAction[]; onChange: (a: NextAction) => void }) {
  const [open, setOpen] = useState(false)
  const allActions: NextAction[] = ['Prepare Interview', 'Follow up', 'Send email', 'Waiting', 'Decide']

  return (
    <div className="relative flex flex-wrap gap-1 items-center">
      {actions.map(a => {
        const c = ACTION_COLORS[a] ?? { bg: '#f3f4f6', text: '#6b7280' }
        return (
          <span
            key={a}
            onClick={() => onChange(a)}
            title="Click to remove"
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full cursor-pointer hover:opacity-70 transition-opacity whitespace-nowrap"
            style={{ background: c.bg, color: c.text }}
          >
            {a}
          </span>
        )
      })}
      <button
        onClick={() => setOpen(o => !o)}
        className="text-[12px] text-ink-faint hover:text-petal-deep w-5 h-5 flex items-center justify-center rounded-full hover:bg-petal-pale transition-colors flex-shrink-0"
        title="Add action"
      >
        +
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.12 }}
              className="absolute top-full left-0 mt-1.5 z-20 bg-white rounded-2xl shadow-lg border border-petal-light p-1.5 min-w-[180px]"
            >
              {allActions.map(a => {
                const c = ACTION_COLORS[a]
                const has = actions.includes(a)
                return (
                  <button
                    key={a}
                    onClick={() => { onChange(a); setOpen(false) }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-petal-pale transition-colors flex items-center gap-2"
                  >
                    <span
                      className="w-4 h-4 rounded flex items-center justify-center text-[10px] flex-shrink-0 border transition-colors"
                      style={{
                        borderColor: has ? c.text : '#e5e7eb',
                        background: has ? c.bg : 'transparent',
                        color: c.text,
                      }}
                    >
                      {has ? '✓' : ''}
                    </span>
                    <span className="text-[12px] font-semibold" style={{ color: c.text }}>{a}</span>
                  </button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
