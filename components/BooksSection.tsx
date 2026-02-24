import SectionHeader from './ui/SectionHeader'
import FadeInView from './ui/FadeInView'
import PlannerCard, { CardList } from './ui/PlannerCard'
import DpTextarea from './ui/DpTextarea'

const library = [
  '📕 Currently Reading: ___________________',
  '📗 Next Up: ___________________',
  '📘 Finished: ___________________',
  '📙 Finished: ___________________',
  '📓 Finished: ___________________',
]

export default function BooksSection() {
  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20" id="books">
      <SectionHeader
        icon="📚"
        label="Feed Your Mind"
        title="Books & Mindset"
        subtitle="Track your reading and save quotes that inspire you."
      />

      <FadeInView delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PlannerCard color="lavender" title="📖 Library" desc="Books I'm reading & want to read.">
            <CardList items={library} />
          </PlannerCard>

          <PlannerCard color="sky" title="✍️ Favorite Authors" desc="Authors who inspire your journey.">
            <DpTextarea placeholder="List your favorite authors..." minHeight={100} />
          </PlannerCard>

          <PlannerCard color="rose" title="💬 Quotes That Hit Different" desc="Words to live by.">
            <DpTextarea placeholder="Save quotes that motivate you..." minHeight={100} />
          </PlannerCard>
        </div>
      </FadeInView>
    </section>
  )
}
