'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from './ui/SectionHeader'
import FadeInView from './ui/FadeInView'
import { createClient } from '@/lib/supabase/client'

const habits = [
  '🏋️ Morning Workout (fasted)',
  '💌 3+ Cold Outreach',
  '💻 5 LeetCode Problems',
  '📚 3 hrs Study',
  '🔨 1 hr Build',
  '📋 5+ Applications',
  '💧 8 Glasses Water',
  '🌙 Skincare Routine',
  '😴 Sleep by 10:30 PM',
  '🧘 Evening Workout (30 min)',
]

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Monday of the current week as YYYY-MM-DD
function getWeekStart(): string {
  const now = new Date()
  const day = now.getDay() // 0 = Sun
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((day + 6) % 7))
  return monday.toISOString().split('T')[0]
}

export default function HabitTracker() {
  const supabase  = createClient()
  const weekStart = getWeekStart()
  const [filled, setFilled] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || cancelled) return

      const { data: row } = await supabase
        .from('habit_weeks')
        .select('filled')
        .eq('user_id', user.id)
        .eq('week_start', weekStart)
        .maybeSingle()

      if (!cancelled) setFilled(row?.filled ?? {})
    }
    load()
    return () => { cancelled = true }
  }, [weekStart]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = async (key: string) => {
    const next = { ...filled, [key]: !filled[key] }
    setFilled(next) // optimistic update

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('habit_weeks').upsert(
      { user_id: user.id, week_start: weekStart, filled: next, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,week_start' },
    )
  }

  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20" id="habits">
      <SectionHeader
        icon="✅"
        label="Stay Consistent"
        title="Habit Tracker"
        subtitle="Small daily actions compound into massive results."
      />

      <FadeInView delay={0.1}>
        <div className="bg-white rounded-[20px] shadow-card p-9 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-[11px] font-semibold tracking-[1px] uppercase text-ink-soft py-2.5 px-1.5 w-[200px]">
                  Habit
                </th>
                {days.map((d) => (
                  <th
                    key={d}
                    className="text-center text-[11px] font-semibold tracking-[1px] uppercase text-ink-soft py-2.5 px-1.5"
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habits.map((habit, hi) => (
                <motion.tr
                  key={habit}
                  className="border-b"
                  style={{ borderColor: 'rgba(200,160,170,0.08)' }}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: hi * 0.04 }}
                >
                  <td className="text-left text-[14px] text-ink-mid py-2 px-1.5">{habit}</td>
                  {days.map((day) => {
                    const key = `${hi}-${day}`
                    const isFilled = !!filled[key]
                    return (
                      <td key={day} className="text-center py-2 px-1.5">
                        <motion.button
                          onClick={() => toggle(key)}
                          className="w-[22px] h-[22px] rounded-full border-2 inline-block cursor-pointer transition-colors"
                          style={{
                            borderColor: isFilled ? '#c77d94' : '#f5d5de',
                            background: isFilled ? '#e8a0b4' : 'transparent',
                          }}
                          whileTap={{ scale: 0.75 }}
                          whileHover={{ borderColor: '#e8a0b4', backgroundColor: isFilled ? '#e8a0b4' : '#fdf0f4' }}
                          transition={{ duration: 0.15 }}
                          aria-label={`Toggle ${habit} on ${day}`}
                        />
                      </td>
                    )
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeInView>
    </section>
  )
}
