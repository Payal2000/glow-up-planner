'use client'

import SectionHeader from './ui/SectionHeader'
import FadeInView from './ui/FadeInView'
import PlannerCard from './ui/PlannerCard'
import ProgressBar from './ui/ProgressBar'
import { useDailySection } from '@/hooks/useDailySection'

const lifeAreaNames = [
  'Career & Professional Growth',
  'Health & Fitness',
  'Financial Wellness',
  'Relationships & Social',
  'Personal Development',
  'Fun & Recreation',
  'Mental & Emotional Health',
  'Spirituality & Mindfulness',
]

interface GoalItem { title: string; percent: number }
interface GoalsData extends Record<string, unknown> {
  vision: string
  goals: GoalItem[]
  lifeRatings: Record<string, string>
}

const defaultGoals = (): GoalsData => ({
  vision: '',
  goals: [
    { title: '', percent: 30 },
    { title: '', percent: 10 },
    { title: '', percent: 0 },
  ],
  lifeRatings: {},
})

const taClass = 'w-full border border-dashed border-petal-light rounded-lg p-3 font-dm text-[13px] text-ink-mid bg-warm-white resize-y outline-none focus:border-petal transition-colors placeholder:text-ink-faint'

export default function GoalsSection() {
  const { data, update, saved } = useDailySection<GoalsData>('goals', defaultGoals)

  const updateGoal = (i: number, field: keyof GoalItem, value: string | number) => {
    const goals = data.goals.map((g, idx) => idx === i ? { ...g, [field]: value } : g)
    update('goals', goals)
  }

  return (
    <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-12" id="goals">
      <SectionHeader icon="🎯" label="Dream Big, Plan Smart" title="Goals & Life Design" subtitle="Track your glow-up across every area of life." />
      {saved && <p className="text-[11px] text-petal-deep font-semibold mb-4 text-right">✓ Saved</p>}

      <FadeInView delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

          <PlannerCard color="rose" title="Dream Life Vision" desc="Where do you see yourself in 1 year?">
            <textarea
              value={data.vision}
              onChange={e => update('vision', e.target.value)}
              placeholder="Write your dream life vision..."
              style={{ minHeight: 120 }}
              className={taClass}
            />
          </PlannerCard>

          <PlannerCard color="lavender" title="Goal Tracking System" desc="Break big dreams into monthly goals.">
            {data.goals.map((goal, i) => (
              <div key={i} className="mb-4">
                <input
                  value={goal.title}
                  onChange={e => updateGoal(i, 'title', e.target.value)}
                  placeholder={`🎯 Goal ${i + 1}…`}
                  className="w-full text-[13px] text-ink-mid bg-transparent outline-none border-b border-petal-light focus:border-petal transition-colors mb-1.5 pb-1 placeholder:text-ink-faint"
                />
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="range" min={0} max={100}
                    value={goal.percent}
                    onChange={e => updateGoal(i, 'percent', Number(e.target.value))}
                    className="flex-1 accent-petal-deep"
                  />
                  <span className="text-[11px] font-semibold text-petal-deep w-8">{goal.percent}%</span>
                </div>
                <ProgressBar
                  title=""
                  percent={goal.percent}
                  label={goal.percent === 0 ? 'Not started' : `${goal.percent}% complete`}
                />
              </div>
            ))}
          </PlannerCard>

          <PlannerCard color="sage" title="Areas of Life" desc="Rate each area (1–10) and set improvement goals.">
            <ul className="list-none">
              {lifeAreaNames.map((area) => (
                <li key={area} className="flex items-center gap-2 py-2 border-b border-[rgba(200,160,170,0.1)] last:border-0">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-sage" />
                  <span className="flex-1 text-[13px] text-ink-mid">{area}</span>
                  <input
                    value={data.lifeRatings[area] ?? ''}
                    onChange={e => update('lifeRatings', { ...data.lifeRatings, [area]: e.target.value })}
                    placeholder="—/10"
                    className="w-12 text-center text-[12px] font-semibold text-petal-deep bg-petal-pale rounded-full px-1 py-0.5 outline-none border border-transparent focus:border-petal transition-colors"
                  />
                </li>
              ))}
            </ul>
          </PlannerCard>

        </div>
      </FadeInView>
    </section>
  )
}
