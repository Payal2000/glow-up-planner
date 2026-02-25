import SectionHeader from './ui/SectionHeader'
import FadeInView from './ui/FadeInView'
import PlannerCard, { CardList } from './ui/PlannerCard'

const morning = [
  'Wake up at 6:30 AM',
  'Drink a glass of water',
  '15-min fasted workout',
  'Skincare + sunscreen',
  'Healthy breakfast',
  'Set daily intention',
  'Start outreach by 7:30',
]

const evening = [
  'Finish work by 7:15 PM',
  'Dinner + no screens',
  'Evening skincare',
  'Journal: wins & lessons',
  "Prep tomorrow's plan",
  'Read for 20 min',
  'Lights out by 10:30 PM',
]

const skincare = [
  'AM: Cleanser → Serum → Moisturizer → SPF',
  'PM: Double Cleanse → Toner → Treatment → Night Cream',
  'Weekly: Exfoliate + Mask',
  'Skin condition today: ___________',
  'Products to restock: ___________',
]

export default function WellnessSection() {
  return (
    <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-12" id="wellness">
      <SectionHeader
        icon="🧖‍♀️"
        label="Glow From Within"
        title="Wellness & Self-Care"
        subtitle="Your morning, evening, and skincare rituals."
      />

      <FadeInView delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <PlannerCard color="rose" title="☀️ Morning Routine" desc="Start every day with intention.">
            <CardList items={morning} />
          </PlannerCard>

          <PlannerCard color="lavender" title="🌙 Evening Routine" desc="Wind down and reflect.">
            <CardList items={evening} />
          </PlannerCard>

          <PlannerCard color="peach" title="✨ Skincare Tracker" desc="Track your AM & PM routine consistency.">
            <CardList items={skincare} />
          </PlannerCard>
        </div>
      </FadeInView>
    </section>
  )
}
