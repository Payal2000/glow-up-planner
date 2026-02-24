'use client'

import { motion } from 'framer-motion'
import SectionHeader from './ui/SectionHeader'
import FadeInView from './ui/FadeInView'

const schedule = [
  { time: '6:30 – 6:45', activity: 'Wake Up + Water', type: 'break', reason: 'Hydrate to kickstart metabolism' },
  { time: '6:45 – 7:00', activity: 'Morning Workout (15 min, fasted)', type: 'workout', reason: 'Peak fat burning — 90% more fat burned before breakfast' },
  { time: '7:00 – 7:30', activity: 'Breakfast + Get Ready', type: 'meal', reason: 'Fuel your brain for the day ahead' },
  { time: '7:30 – 8:30', activity: 'Cold Outreach', type: 'outreach', reason: 'Inboxes checked 8–10 AM — highest reply rates' },
  { time: '8:30 – 8:45', activity: 'Break', type: 'break', reason: 'Reset before deep work' },
  { time: '8:45 – 10:45', activity: 'LeetCode — 5 New Problems', type: 'leetcode', reason: '9–11 AM = peak analytical focus (Huberman)' },
  { time: '10:45 – 12:00', activity: 'LeetCode — Review Past 5 Days', type: 'leetcode', reason: 'Short-term memory peaks in morning hours' },
  { time: '12:00 – 1:00', activity: 'Lunch Break', type: 'meal', reason: 'Full break — no screens' },
  { time: '1:00 – 4:00', activity: 'Study (3 hrs)', type: 'study', reason: 'Afternoon = best for review, system design & critical thinking' },
  { time: '4:00 – 4:15', activity: 'Break', type: 'break', reason: 'Rest before creative work' },
  { time: '4:15 – 5:15', activity: 'Build (1 hr)', type: 'build', reason: 'Late afternoon suits creative & project work' },
  { time: '5:15 – 5:45', activity: 'Evening Workout (30 min)', type: 'workout', reason: 'Strength & endurance peak in evening; stress relief' },
  { time: '5:45 – 6:15', activity: 'Freshen Up + Snack', type: 'break', reason: 'Recover and refuel' },
  { time: '6:15 – 7:15', activity: 'Job Applications', type: 'apply', reason: 'Prep in evening, schedule submissions for next morning 6–10 AM' },
]

const dotColors: Record<string, string> = {
  workout: '#b8c9a3',
  outreach: '#e8a0b4',
  leetcode: '#c9b8e8',
  study: '#a8c8e0',
  build: '#f5c4a1',
  apply: '#e0c88a',
  break: '#f0e0d4',
  meal: '#d4b89c',
}

const insights = [
  { emoji: '📋', title: 'Applications', text: 'Submitting before 10 AM increases interview odds by 13%. Tuesday is the top day for new postings.', badge: 'Best: 6–10 AM, Tue–Thu' },
  { emoji: '💌', title: 'Cold Outreach', text: 'Highest reply rates at 9–11 AM and 1–3 PM. Keep messages short and personalized.', badge: 'Best: 8–11 AM, Tue–Thu' },
  { emoji: '📖', title: 'Studying', text: 'Peak analytical focus 9 AM–12 PM. Afternoons are best for review and critical thinking.', badge: 'Best: 9 AM–2 PM & 4–6 PM' },
  { emoji: '🏋️‍♀️', title: 'Workout (Fat Loss)', text: 'Fasted morning exercise burns up to 90% more fat over 24 hours. Women see greater belly fat reduction with AM workouts.', badge: 'Best: Before breakfast (fasted)' },
]

const borderColors = ['#f5d5de', '#e3ecd8', '#ede5f7', '#fce8d5']

export default function TimetableSection() {
  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20" id="timetable">
      <SectionHeader
        icon="⏰"
        label="Research-Backed"
        title="Your Optimized Timetable"
        subtitle="Every block is placed at the time science says your brain and body perform best."
      />

      <FadeInView delay={0.1}>
        <div className="bg-white rounded-[20px] shadow-card overflow-hidden mb-10">
          {/* Card header */}
          <div
            className="px-9 py-[30px] border-b"
            style={{
              background: 'linear-gradient(135deg, #fdf0f4 0%, #f9e4eb 100%)',
              borderColor: 'rgba(232,160,180,0.15)',
            }}
          >
            <h3 className="font-playfair text-[22px] text-ink-dark mb-1">
              Daily Schedule — The Glow-Up Routine
            </h3>
            <p className="text-[13px] text-ink-soft">
              Designed around peak cognitive hours, fat-burning windows & recruiter activity
            </p>
          </div>

          {/* Rows */}
          <div className="py-2">
            {schedule.map((row, i) => (
              <motion.div
                key={i}
                className="grid px-9 py-4 border-b last:border-0 items-center"
                style={{
                  gridTemplateColumns: '130px 1fr 1fr',
                  borderColor: 'rgba(200,160,170,0.08)',
                }}
                whileHover={{ backgroundColor: '#fdf0f4' }}
                transition={{ duration: 0.15 }}
              >
                <span className="font-cormorant text-[15px] font-semibold text-ink-dark">
                  {row.time}
                </span>
                <span className="flex items-center gap-2.5 text-[14px] font-medium text-ink-dark">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: dotColors[row.type] }}
                  />
                  {row.activity}
                </span>
                <span className="text-[12px] text-ink-soft italic hidden sm:block">
                  {row.reason}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInView>

      {/* Pro tip */}
      <FadeInView delay={0.2}>
        <div
          className="rounded-xl p-5 mb-8 flex items-start gap-3.5"
          style={{ background: 'linear-gradient(135deg, #ede5f7, #fdf0f4)' }}
        >
          <span className="text-xl flex-shrink-0">💡</span>
          <p className="text-[13px] text-ink-mid leading-[1.7]">
            <strong className="text-ink-dark">Pro Tip:</strong> Prepare applications in the evening
            but use a scheduling tool to submit them the next morning between 6–10 AM.
            Tuesday–Thursday applications get the highest callback rates.
          </p>
        </div>
      </FadeInView>

      {/* Insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        {insights.map((card, i) => (
          <FadeInView key={i} delay={0.1 + i * 0.08}>
            <motion.div
              className="bg-white rounded-xl p-7 shadow-soft border-t-[3px]"
              style={{ borderTopColor: borderColors[i] }}
              whileHover={{ y: -4, boxShadow: '0 8px 40px rgba(200,160,170,0.22)' }}
              transition={{ duration: 0.25 }}
            >
              <span className="text-2xl block mb-3.5">{card.emoji}</span>
              <h4 className="font-playfair text-[16px] text-ink-dark mb-2">{card.title}</h4>
              <p className="text-[13px] text-ink-soft leading-[1.7]">{card.text}</p>
              <span className="mt-3 text-[12px] font-semibold text-petal-deep bg-petal-pale px-3.5 py-1.5 rounded-full inline-block">
                {card.badge}
              </span>
            </motion.div>
          </FadeInView>
        ))}
      </div>
    </section>
  )
}
