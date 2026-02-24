import SectionHeader from './ui/SectionHeader'
import FadeInView from './ui/FadeInView'
import PlannerCard, { CardList } from './ui/PlannerCard'
import DpTextarea from './ui/DpTextarea'

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const mealCols = ['Breakfast', 'Lunch', 'Dinner', 'Snacks']

const groceryItems = [
  'Proteins: ___________________',
  'Vegetables: ___________________',
  'Fruits: ___________________',
  'Grains: ___________________',
  'Dairy: ___________________',
  'Snacks: ___________________',
  'Other: ___________________',
]

export default function MealsSection() {
  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20" id="meals">
      <SectionHeader
        icon="🥗"
        label="Nourish Your Body"
        title="Meals & Lifestyle"
        subtitle="Plan your meals to fuel your glow-up."
      />

      <FadeInView delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Meal planner - full width */}
          <div className="md:col-span-2">
            <div
              className="bg-white rounded-[20px] shadow-soft overflow-hidden"
              style={{ borderTop: '4px solid', borderImage: 'linear-gradient(90deg, #f5c4a1, #fce8d5) 1' }}
            >
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #f5c4a1, #fce8d5)' }} />
              <div className="p-9">
                <h3 className="font-playfair text-xl text-ink-dark mb-1.5">🍽️ Meal Planner</h3>
                <p className="text-[13px] text-ink-soft mb-5">Weekly meal prep saves time and keeps you on track.</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left text-[11px] font-semibold tracking-[1px] uppercase text-ink-soft py-2.5 px-3 border-b-2 border-petal-pale">
                          Day
                        </th>
                        {mealCols.map((col) => (
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
                      {weekDays.map((day) => (
                        <tr key={day} className="border-b" style={{ borderColor: 'rgba(200,160,170,0.08)' }}>
                          <td className="py-3 px-3 text-[13px] text-ink-mid font-medium">{day}</td>
                          {mealCols.map((col) => (
                            <td key={col} className="py-3 px-3">
                              <span
                                className="editable-cell"
                                contentEditable
                                suppressContentEditableWarning
                              >
                                &nbsp;
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Grocery list */}
          <PlannerCard color="latte" title="🛒 Grocery List" desc="Never forget what you need.">
            <CardList items={groceryItems} />
          </PlannerCard>

          {/* Recipe gallery */}
          <PlannerCard color="rose" title="📖 Recipe Gallery" desc="Save your favorite recipes here.">
            <DpTextarea placeholder="Recipe name, ingredients, steps..." minHeight={140} />
          </PlannerCard>
        </div>
      </FadeInView>
    </section>
  )
}
