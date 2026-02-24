import SectionHeader from './ui/SectionHeader'
import FadeInView from './ui/FadeInView'
import PlannerCard from './ui/PlannerCard'
import ProgressBar from './ui/ProgressBar'
import DpTextarea from './ui/DpTextarea'

const lifeAreas = [
  'Career & Professional Growth — __ /10',
  'Health & Fitness — __ /10',
  'Financial Wellness — __ /10',
  'Relationships & Social — __ /10',
  'Personal Development — __ /10',
  'Fun & Recreation — __ /10',
  'Mental & Emotional Health — __ /10',
  'Spirituality & Mindfulness — __ /10',
]

export default function GoalsSection() {
  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20" id="goals">
      <SectionHeader
        icon="🎯"
        label="Dream Big, Plan Smart"
        title="Goals & Life Design"
        subtitle="Track your glow-up across every area of life."
      />

      <FadeInView delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PlannerCard color="rose" title="Dream Life Vision" desc="Where do you see yourself in 1 year?">
            <DpTextarea placeholder="Write your dream life vision..." minHeight={120} />
          </PlannerCard>

          <PlannerCard color="lavender" title="Goal Tracking System" desc="Break big dreams into monthly goals.">
            <ProgressBar title="🎯 Goal: ____________________" percent={30} label="30% complete" />
            <ProgressBar title="🎯 Goal: ____________________" percent={10} label="10% complete" />
            <ProgressBar title="🎯 Goal: ____________________" percent={0} label="Not started" />
          </PlannerCard>

          <PlannerCard color="sage" title="Areas of Life" desc="Rate each area (1–10) and set improvement goals.">
            <ul className="list-none">
              {lifeAreas.map((area, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 text-[14px] text-ink-mid py-2.5 border-b border-[rgba(200,160,170,0.1)] last:border-0"
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-sage" />
                  {area}
                </li>
              ))}
            </ul>
          </PlannerCard>
        </div>
      </FadeInView>
    </section>
  )
}
