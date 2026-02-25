import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

type Action = 'analyze-daily' | 'analyze-weekly' | 'research-food' | 'guidance'

interface MealEntry {
  meal: string
  food: string
  servings: string
  servingSize: string
  protein: string
  carbs: string
  sugar: string
  fat: string
  calories: string
}

function formatEntries(entries: MealEntry[]): string {
  const filled = entries.filter(e => e.food)
  if (!filled.length) return 'No meals logged.'
  return filled.map(e =>
    `- [${e.meal || '?'}] ${e.food}${e.servings ? ` ×${e.servings}` : ''}${e.calories ? ` | ${e.calories} kcal` : ''}${e.protein ? ` | P:${e.protein}g` : ''}${e.carbs ? ` C:${e.carbs}g` : ''}${e.fat ? ` F:${e.fat}g` : ''}`
  ).join('\n')
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const action: Action = body.action
    const calorieGoal: string = body.calorieGoal ?? '2000'

    let prompt = ''

    // ── Daily Analysis ─────────────────────────────────────────────────────
    if (action === 'analyze-daily') {
      const entries: MealEntry[] = body.entries ?? []
      const meals = formatEntries(entries)
      prompt = `You are a nutrition coach. Analyze today's food diary and give concise, actionable insights.

Calorie Goal: ${calorieGoal} kcal
Today's meals:
${meals}

Give a brief analysis (3-5 bullet points) covering:
• How close they are to their calorie goal and whether they're over/under
• Protein, carb, fat balance — is it good or lacking?
• Any nutrient gaps (fiber, vitamins, etc.) you can infer
• One specific swap or addition to improve today's nutrition
• Overall verdict: on track, needs improvement, or great

Keep it friendly, direct, no fluff. Use bullet points (•). No markdown headers.`

    // ── Weekly Analysis ────────────────────────────────────────────────────
    } else if (action === 'analyze-weekly') {
      const weekData: { date: string; entries: MealEntry[]; calorieGoal: string }[] = body.weekData ?? []
      const summary = weekData.map(d => {
        const filled = d.entries.filter(e => e.food)
        const totalCal = filled.reduce((s, e) => s + (parseFloat(e.calories) || 0), 0)
        const totalProtein = filled.reduce((s, e) => s + (parseFloat(e.protein) || 0), 0)
        return `${d.date}: ${filled.length} items, ~${Math.round(totalCal)} kcal, ~${Math.round(totalProtein)}g protein`
      }).join('\n') || 'No data for this week.'

      prompt = `You are a nutrition coach. Analyze this week's food diary and give a weekly review.

Calorie Goal per day: ${calorieGoal} kcal
Weekly summary:
${summary}

Give a weekly review (4-6 bullet points) covering:
• Consistency — did they hit their calorie goal most days?
• Protein trend — are they getting enough across the week?
• Days that look concerning (too low, too high, or empty)
• One habit to build or break next week
• Overall weekly grade: A, B, C, D

Keep it friendly and motivating. Use bullet points (•). No markdown headers.`

    // ── Food Research ──────────────────────────────────────────────────────
    } else if (action === 'research-food') {
      const query: string = body.query ?? ''
      if (!query) return NextResponse.json({ error: 'query required' }, { status: 400 })

      prompt = `You are a nutrition database. The user wants to know the macros for: "${query}"

Return ONLY a JSON object in this exact format, no extra text:
{
  "food": "full product/food name",
  "servings": "1",
  "servingSize": "standard serving size (e.g. 100g, 1 cup, 1 slice)",
  "calories": "number only",
  "protein": "number only in grams",
  "carbs": "number only in grams",
  "sugar": "number only in grams",
  "fat": "number only in grams",
  "notes": "one sentence about this food (health note or tip)"
}

Use average/typical values from nutrition databases. Be accurate. Numbers only for macro fields (no units).`

    // ── General Guidance ───────────────────────────────────────────────────
    } else if (action === 'guidance') {
      const question: string = body.question ?? ''
      const entries: MealEntry[] = body.entries ?? []
      const meals = formatEntries(entries)
      if (!question) return NextResponse.json({ error: 'question required' }, { status: 400 })

      prompt = `You are a friendly, knowledgeable nutrition and wellness coach.

Today's food diary:
${meals}
Calorie Goal: ${calorieGoal} kcal

User's question: "${question}"

Answer directly and helpfully in 3-5 sentences. Be specific, practical, and encouraging. No fluff. If the question is about weight loss/gain, give a concrete calorie/macro target. If it's about a specific food, give a direct answer.`

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const isJson = action === 'research-food'

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: isJson ? 300 : 400,
      messages: [{ role: 'user', content: prompt }],
      ...(isJson ? { response_format: { type: 'json_object' } } : {}),
    })

    const content = completion.choices[0]?.message?.content ?? ''

    if (isJson) {
      try {
        const parsed = JSON.parse(content)
        return NextResponse.json({ result: parsed })
      } catch {
        return NextResponse.json({ error: 'Failed to parse food data' }, { status: 500 })
      }
    }

    return NextResponse.json({ result: content })
  } catch (err) {
    console.error('meal-coach error:', err)
    return NextResponse.json({ error: 'Agent failed' }, { status: 500 })
  }
}
