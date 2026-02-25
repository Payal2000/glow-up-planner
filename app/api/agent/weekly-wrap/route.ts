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

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { weekStart } = await req.json()
    if (!weekStart) return NextResponse.json({ error: 'weekStart required' }, { status: 400 })

    // Build all 7 date strings for the week
    const weekDates = DAYS.map((_, i) => addDays(weekStart, i))

    // Fetch habit_weeks, all daily_plans for the week, and job tracker — in parallel
    const [habitRow, ...planRows] = await Promise.all([
      supabase.from('habit_weeks').select('filled').eq('user_id', user.id).eq('week_start', weekStart).maybeSingle(),
      ...weekDates.map(date =>
        supabase.from('daily_plans').select('data').eq('user_id', user.id).eq('date', date).maybeSingle()
          .then(r => ({ date, data: r.data?.data ?? {} }))
      ),
    ])

    const jobRow = await supabase.from('daily_plans').select('data').eq('user_id', user.id).eq('date', 'job-tracker').maybeSingle()
    const allApps: Array<{ company: string; position: string; status?: string; date?: string }> = jobRow.data?.data?.applications ?? []

    // Habit summary
    const habitFilled: Record<string, boolean> = habitRow.data?.filled ?? {}
    const habitLines = HABIT_NAMES.map((name, hi) => {
      const daysHit = DAYS.filter(day => habitFilled[`${hi}-${day}`])
      return `  ${name}: ${daysHit.length}/7 (${daysHit.join(', ') || 'missed'})`
    })

    // Daily plans summary — intentions, top priorities done, reflections
    const dayLines: string[] = []
    for (const row of planRows as Array<{ date: string; data: Record<string, unknown> }>) {
      const d = row.data
      const dayName = DAYS[weekDates.indexOf(row.date)] ?? row.date
      const intention = d.intention as string || ''
      const priorities = (d.priorities as Array<{ text: string; done: boolean }> ?? []).filter(p => p.text)
      const priorityLines = priorities.map(p => `    - ${p.text}${p.done ? ' ✓' : ''}`).join('\n')
      const reflection = d.reflection as string || ''
      if (intention || priorities.length || reflection) {
        dayLines.push(`  ${dayName}:${intention ? `\n    Intention: ${intention}` : ''}${priorityLines ? `\n    Priorities:\n${priorityLines}` : ''}${reflection ? `\n    Reflection: ${reflection}` : ''}`)
      }
    }

    // Job apps this week
    const weekApps = allApps.filter(a => a.date && a.date >= weekStart && a.date <= weekDates[6])
    const appLines = weekApps.length > 0
      ? weekApps.map(a => `  - ${a.company} / ${a.position}${a.status ? ` [${a.status}]` : ''}`).join('\n')
      : '  None this week'

    const totalHabitsHit = HABIT_NAMES.reduce((sum, _, hi) => sum + DAYS.filter(day => habitFilled[`${hi}-${day}`]).length, 0)
    const totalPossible = HABIT_NAMES.length * 7
    const habitPct = Math.round((totalHabitsHit / totalPossible) * 100)

    const weekLabel = new Date(weekStart + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

    const prompt = `You are a direct performance coach writing a weekly wrap-up for a woman doing a serious glow-up. She tracks habits, daily plans, and job applications.

WEEK OF ${weekLabel}:

HABIT COMPLETION (${habitPct}% overall):
${habitLines.join('\n')}

DAILY INTENTIONS AND REFLECTIONS:
${dayLines.length > 0 ? dayLines.join('\n') : '  (No daily notes recorded)'}

JOB APPLICATIONS THIS WEEK:
${appLines}

Respond in this exact structure. Use the section headers exactly as written. Do not use em dashes anywhere.

WINS
2 to 3 sentences on what she genuinely crushed this week. Be specific: use real habit names, actual numbers, and details from her plans. No generic praise.

WHAT SLIPPED
Name 1 to 2 specific things that did not go as planned, using actual habit names and numbers. State each gap clearly. Do not soften it with filler phrases.

HOW TO ADDRESS THE GAPS
For each gap named above, give one specific, concrete action she can take next week to fix it. Write this as a short numbered list, one item per gap, one sentence each. Make it practical and tied to her actual data.

FOCUS FOR NEXT WEEK
One sentence. The single most important priority for next week based on her data.

Rules: use real names and numbers throughout. No emojis. No hashtags. No em dashes. No motivational filler.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 450,
      messages: [{ role: 'user', content: prompt }],
    })

    const wrap = completion.choices[0]?.message?.content ?? ''

    // Auto-save to Sunday's daily notes
    const sundayDate = weekDates[6]
    const { data: sundayRow } = await supabase.from('daily_plans').select('data').eq('user_id', user.id).eq('date', sundayDate).maybeSingle()
    const merged = { ...(sundayRow?.data ?? {}), notes: wrap }
    await supabase.from('daily_plans').upsert(
      { user_id: user.id, date: sundayDate, data: merged, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,date' },
    )

    return NextResponse.json({ wrap, savedTo: sundayDate })
  } catch (err) {
    console.error('weekly-wrap error:', err)
    return NextResponse.json({ error: 'Failed to generate wrap-up' }, { status: 500 })
  }
}
