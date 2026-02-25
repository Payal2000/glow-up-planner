import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const HABIT_NAMES = [
  'Morning Workout (fasted)',
  '3+ Cold Outreach',
  '5 LeetCode Problems',
  '3 hrs Study',
  '1 hr Build',
  '5+ Applications',
  '8 Glasses Water',
  'Skincare Routine',
  'Sleep by 10:30 PM',
  'Evening Workout (30 min)',
]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: rows } = await supabase
      .from('habit_weeks')
      .select('week_start, filled')
      .eq('user_id', user.id)
      .order('week_start', { ascending: false })
      .limit(4)

    if (!rows || rows.length === 0) {
      return NextResponse.json({
        analysis: "Not enough habit data yet — start tracking your habits for at least a week and come back for insights!",
      })
    }

    const weeksAnalyzed = rows.length
    const maxPossible = weeksAnalyzed * 7
    const maxDayPossible = weeksAnalyzed * HABIT_NAMES.length

    const habitTotals = new Array(HABIT_NAMES.length).fill(0)
    const dayTotals: Record<string, number> = {}
    DAYS.forEach(d => { dayTotals[d] = 0 })

    const weekSummaries: string[] = []

    for (const row of rows) {
      const filled: Record<string, boolean> = row.filled ?? {}
      const weekDate = new Date(row.week_start + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const lines: string[] = []

      for (let hi = 0; hi < HABIT_NAMES.length; hi++) {
        const daysHit = DAYS.filter(day => filled[`${hi}-${day}`])
        habitTotals[hi] += daysHit.length
        daysHit.forEach(d => { dayTotals[d]++ })
        lines.push(`  ${HABIT_NAMES[hi]}: ${daysHit.length}/7 (${daysHit.join(', ') || 'missed'})`)
      }
      weekSummaries.push(`Week of ${weekDate}:\n${lines.join('\n')}`)
    }

    const habitRanked = HABIT_NAMES
      .map((name, hi) => ({ name, rate: Math.round((habitTotals[hi] / maxPossible) * 100), completions: habitTotals[hi] }))
      .sort((a, b) => b.rate - a.rate)

    const dayRanked = DAYS
      .map(day => ({ day, rate: Math.round((dayTotals[day] / maxDayPossible) * 100) }))
      .sort((a, b) => b.rate - a.rate)

    const habitSummaryText = habitRanked.map(h => `  ${h.name}: ${h.rate}% (${h.completions}/${maxPossible} days)`).join('\n')
    const daySummaryText = dayRanked.map(d => `  ${d.day}: ${d.rate}% completion`).join('\n')

    const prompt = `You are a habit coach analyzing ${weeksAnalyzed} weeks of data for a woman doing a serious personal glow-up. She tracks 10 daily habits across career (LeetCode, studying, applications, cold outreach, building) and wellness (morning workout, evening workout, hydration, skincare, sleep).

RAW WEEKLY DATA:
${weekSummaries.join('\n\n')}

HABIT COMPLETION RATES (best to worst):
${habitSummaryText}

DAY-OF-WEEK STRENGTH (best to worst):
${daySummaryText}

Respond in this exact structure. Use the section headers exactly as written. Do not use em dashes anywhere.

STRENGTHS
Write 2 to 3 sentences naming her strongest habits by actual name and percentage. Be specific about what her consistency in those areas reveals.

GAPS
Write 2 to 3 sentences naming her weakest habits by actual name and percentage. Call out which days of the week are the worst for each gap. Be honest and direct, not harsh.

HOW TO ADDRESS THE GAPS
For each gap habit named above, give one concrete, specific action she can take this week to improve it. Write this as a short numbered list, one item per gap. Each item should be one sentence. Make the actions realistic and specific to the habit, not generic advice.

Rules: use actual habit names and numbers throughout. No emojis. No hashtags. No em dashes. No filler phrases.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    })

    const analysis = completion.choices[0]?.message?.content ?? ''
    return NextResponse.json({ analysis })
  } catch (err) {
    console.error('habit-analysis error:', err)
    return NextResponse.json({ error: 'Failed to analyse habits' }, { status: 500 })
  }
}
