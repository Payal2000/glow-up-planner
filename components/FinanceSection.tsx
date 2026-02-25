'use client'

import SectionHeader from './ui/SectionHeader'
import FadeInView from './ui/FadeInView'
import PlannerCard, { CardList } from './ui/PlannerCard'
import { useDailySection } from '@/hooks/useDailySection'

const balanceLabels = ['Total Income', 'Total Expenses', 'Savings Goal', 'Current Savings', 'Net Balance']

interface FinanceRow { col1: string; col2: string; col3: string }
interface FinanceData {
  balance: Record<string, string>
  income: FinanceRow[]
  expenses: FinanceRow[]
}

const emptyRow = (): FinanceRow => ({ col1: '', col2: '', col3: '' })
const defaultFinance = (): FinanceData => ({
  balance: {},
  income: [emptyRow(), emptyRow(), emptyRow()],
  expenses: [emptyRow(), emptyRow(), emptyRow(), emptyRow()],
})

const cellClass = 'w-full bg-warm-white rounded-md border border-petal-light px-2 py-1.5 text-[12px] text-ink-mid outline-none focus:border-petal transition-colors placeholder:text-ink-faint'

function EditableTable({
  cols, rows, onChange,
}: {
  cols: string[]
  rows: FinanceRow[]
  onChange: (rows: FinanceRow[]) => void
}) {
  const fields: (keyof FinanceRow)[] = ['col1', 'col2', 'col3']
  return (
    <div className="overflow-x-auto mt-3">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {cols.map(col => (
              <th key={col} className="text-left text-[11px] font-semibold tracking-[1px] uppercase text-ink-soft py-2.5 px-2 border-b-2 border-petal-pale">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b" style={{ borderColor: 'rgba(200,160,170,0.08)' }}>
              {fields.map((f, fi) => (
                <td key={fi} className="py-2 px-2">
                  <input
                    value={row[f]}
                    onChange={e => {
                      const next = rows.map((r, ri) => ri === i ? { ...r, [f]: e.target.value } : r)
                      onChange(next)
                    }}
                    placeholder="—"
                    className={cellClass}
                  />
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
  const { data, update, saved } = useDailySection<FinanceData>('finance', defaultFinance)

  return (
    <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-12" id="finance">
      <SectionHeader icon="💰" label="Money Matters" title="Finance & Money Reset" subtitle="Take control of your finances with clarity." />
      {saved && <p className="text-[11px] text-petal-deep font-semibold mb-4 text-right">✓ Saved</p>}

      <FadeInView delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

          <PlannerCard color="gold" title="💵 Balance Calculator" desc="Know your numbers at a glance.">
            <ul className="list-none">
              {balanceLabels.map(label => (
                <li key={label} className="flex items-center gap-2 py-2 border-b border-[rgba(200,160,170,0.1)] last:border-0">
                  <span className="text-[12px] text-ink-soft flex-1">{label}:</span>
                  <input
                    value={data.balance[label] ?? ''}
                    onChange={e => update('balance', { ...data.balance, [label]: e.target.value })}
                    placeholder="$—"
                    className="w-24 text-right bg-warm-white rounded-md border border-petal-light px-2 py-1 text-[12px] text-ink-mid outline-none focus:border-petal transition-colors"
                  />
                </li>
              ))}
            </ul>
          </PlannerCard>

          <PlannerCard color="sage" title="📈 Income Tracking" desc="Track all your income sources.">
            <EditableTable
              cols={['Source', 'Amount', 'Date']}
              rows={data.income}
              onChange={rows => update('income', rows)}
            />
          </PlannerCard>

          <PlannerCard color="peach" title="💳 Expense Tracking" desc="See where your money goes.">
            <EditableTable
              cols={['Category', 'Amount', 'Date']}
              rows={data.expenses}
              onChange={rows => update('expenses', rows)}
            />
          </PlannerCard>

        </div>
      </FadeInView>
    </section>
  )
}
