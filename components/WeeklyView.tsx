'use client'

import { motion } from 'framer-motion'
import SectionHeader from './ui/SectionHeader'
import FadeInView from './ui/FadeInView'

const days = [
  {
    name: 'Mon',
    tasks: [
      { color: '#c9b8e8', text: 'Arrays & Hashing' },
      { color: '#e8a0b4', text: '5 Outreach' },
      { color: '#e0c88a', text: '5 Applications' },
    ],
  },
  {
    name: 'Tue',
    tasks: [
      { color: '#c9b8e8', text: 'Two Pointers' },
      { color: '#e8a0b4', text: '5 Outreach' },
      { color: '#e0c88a', text: '5 Applications' },
    ],
  },
  {
    name: 'Wed',
    tasks: [
      { color: '#c9b8e8', text: 'Sliding Window' },
      { color: '#e8a0b4', text: '5 Outreach' },
      { color: '#e0c88a', text: '5 Applications' },
    ],
  },
  {
    name: 'Thu',
    tasks: [
      { color: '#c9b8e8', text: 'Trees & Graphs' },
      { color: '#e8a0b4', text: '5 Outreach' },
      { color: '#e0c88a', text: '5 Applications' },
    ],
  },
  {
    name: 'Fri',
    tasks: [
      { color: '#c9b8e8', text: 'Dynamic Programming' },
      { color: '#e8a0b4', text: '3 Outreach' },
      { color: '#e0c88a', text: '3 Applications' },
    ],
  },
  {
    name: 'Sat',
    tasks: [
      { color: '#a8c8e0', text: 'Mock Interview' },
      { color: '#f5c4a1', text: 'Build Project' },
      { color: '#b8c9a3', text: 'Self-Care 💆‍♀️' },
    ],
  },
  {
    name: 'Sun',
    tasks: [
      { color: '#c9b8e8', text: 'Weekly Review' },
      { color: '#e0c88a', text: 'Prep Apps for Mon' },
      { color: '#b8c9a3', text: 'Rest & Recharge' },
    ],
  },
]

export default function WeeklyView() {
  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20" id="weekly">
      <SectionHeader
        icon="📅"
        label="See the Big Picture"
        title="Weekly Planner"
        subtitle="Batch your LeetCode topics and track your week at a glance."
      />

      <FadeInView delay={0.1}>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {days.map((day, i) => (
            <motion.div
              key={day.name}
              className="bg-white rounded-xl py-5 px-4 shadow-soft text-center"
              whileHover={{ y: -4, boxShadow: '0 8px 40px rgba(200,160,170,0.22)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <p className="text-[11px] font-semibold tracking-[2px] uppercase text-ink-soft mb-2">
                {day.name}
              </p>
              <p className="font-playfair text-2xl text-ink-dark mb-4">—</p>
              <ul className="list-none text-left">
                {day.tasks.map((task, j) => (
                  <li
                    key={j}
                    className="flex items-center gap-1.5 text-[11px] text-ink-mid py-1.5 border-b last:border-0"
                    style={{ borderColor: 'rgba(200,160,170,0.08)' }}
                  >
                    <span
                      className="w-[5px] h-[5px] rounded-full flex-shrink-0"
                      style={{ background: task.color }}
                    />
                    {task.text}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </FadeInView>
    </section>
  )
}
