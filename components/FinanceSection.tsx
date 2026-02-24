import SectionHeader from './ui/SectionHeader'
import FadeInView from './ui/FadeInView'
import PlannerCard, { CardList } from './ui/PlannerCard'

const balanceItems = [
  'Total Income: $ ___________',
  'Total Expenses: $ ___________',
  'Savings Goal: $ ___________',
  'Current Savings: $ ___________',
  'Net Balance: $ ___________',
]

function MiniTable({ cols, rows }: { cols: string[]; rows: number }) {
  return (
    <div className="overflow-x-auto mt-3">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {cols.map((col) => (
              <th
                key={col}
                className="text-left text-[11px] font-semibold tracking-[1px] uppercase text-ink-soft py-2.5 px-3 border-b-2 border-petal-pale"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-b" style={{ borderColor: 'rgba(200,160,170,0.08)' }}>
              {cols.map((col) => (
                <td key={col} className="py-3 px-3">
                  <span className="editable-cell" contentEditable suppressContentEditableWarning>
                    &nbsp;
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function FinanceSection() {
  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20" id="finance">
      <SectionHeader
        icon="💰"
        label="Money Matters"
        title="Finance & Money Reset"
        subtitle="Take control of your finances with clarity."
      />

      <FadeInView delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PlannerCard color="gold" title="💵 Balance Calculator" desc="Know your numbers at a glance.">
            <CardList items={balanceItems} />
          </PlannerCard>

          <PlannerCard color="sage" title="📈 Income Tracking" desc="Track all your income sources.">
            <MiniTable cols={['Source', 'Amount', 'Date']} rows={3} />
          </PlannerCard>

          <PlannerCard color="peach" title="💳 Expense Tracking" desc="See where your money goes.">
            <MiniTable cols={['Category', 'Amount', 'Date']} rows={4} />
          </PlannerCard>
        </div>
      </FadeInView>
    </section>
  )
}
