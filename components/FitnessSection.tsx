import SectionHeader from './ui/SectionHeader'
import FadeInView from './ui/FadeInView'
import PlannerCard, { CardList } from './ui/PlannerCard'
import ProgressBar from './ui/ProgressBar'
import DpTextarea from './ui/DpTextarea'

const workoutPlan = [
  'AM (Fasted, 15 min): HIIT / Cardio / Yoga',
  'PM (30 min): Strength Training',
  'Mon — Legs + Glutes',
  'Tue — Upper Body + Core',
  'Wed — Cardio + Flexibility',
  'Thu — Back + Shoulders',
  'Fri — Full Body',
  'Sat — Active Recovery / Walk',
  'Sun — Rest Day',
]

const bodyTracker = [
  'Current Weight: ___________',
  'Goal Weight: ___________',
  'Waist: ___________',
  'Hips: ___________',
  'Arms: ___________',
  'Energy Level (1–10): ___________',
  'How I Feel: ___________',
]

export default function FitnessSection() {
  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20" id="fitness">
      <SectionHeader
        icon="💪"
        label="Move Your Body"
        title="Fitness & Glow-Up"
        subtitle="45 min daily — 15 min fasted AM + 30 min PM strength."
      />

      <FadeInView delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PlannerCard color="sage" title="🏋️ Workout Planner" desc="Split across morning & evening for max results.">
            <CardList items={workoutPlan} />
          </PlannerCard>

          <PlannerCard color="sky" title="📊 Body Progress Tracker" desc="Track changes weekly — be patient with yourself.">
            <CardList items={bodyTracker} />
          </PlannerCard>

          <PlannerCard color="gold" title="🎯 Fitness Goals" desc="What are you working toward?">
            <ProgressBar title="Goal: ____________________" percent={20} label="20% there" />
            <DpTextarea placeholder="Notes: what's working, what to adjust..." className="mt-3" />
          </PlannerCard>
        </div>
      </FadeInView>
    </section>
  )
}
