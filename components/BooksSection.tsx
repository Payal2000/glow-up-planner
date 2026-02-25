'use client'

import SectionHeader from './ui/SectionHeader'
import FadeInView from './ui/FadeInView'
import PlannerCard, { CardList } from './ui/PlannerCard'
import { useDailySection } from '@/hooks/useDailySection'

const library = [
  '📕 Currently Reading: ___________________',
  '📗 Next Up: ___________________',
  '📘 Finished: ___________________',
  '📙 Finished: ___________________',
  '📓 Finished: ___________________',
]

interface BooksData { authors: string; quotes: string }
const defaultBooks = (): BooksData => ({ authors: '', quotes: '' })
const taClass = 'w-full border border-dashed border-petal-light rounded-lg p-3 font-dm text-[13px] text-ink-mid bg-warm-white resize-y outline-none focus:border-petal transition-colors placeholder:text-ink-faint'

export default function BooksSection() {
  const { data, update, saved } = useDailySection<BooksData>('books', defaultBooks)

  return (
    <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-12" id="books">
      <SectionHeader icon="📚" label="Feed Your Mind" title="Books & Mindset" subtitle="Track your reading and save quotes that inspire you." />
      {saved && <p className="text-[11px] text-petal-deep font-semibold mb-4 text-right">✓ Saved</p>}
      <FadeInView delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <PlannerCard color="lavender" title="📖 Library" desc="Books I'm reading & want to read.">
            <CardList items={library} />
          </PlannerCard>
          <PlannerCard color="sky" title="✍️ Favorite Authors" desc="Authors who inspire your journey.">
            <textarea value={data.authors} onChange={e => update('authors', e.target.value)} placeholder="List your favorite authors..." style={{ minHeight: 100 }} className={taClass} />
          </PlannerCard>
          <PlannerCard color="rose" title="💬 Quotes That Hit Different" desc="Words to live by.">
            <textarea value={data.quotes} onChange={e => update('quotes', e.target.value)} placeholder="Save quotes that motivate you..." style={{ minHeight: 100 }} className={taClass} />
          </PlannerCard>
        </div>
      </FadeInView>
    </section>
  )
}
