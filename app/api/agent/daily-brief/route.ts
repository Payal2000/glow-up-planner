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
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getWeekStart(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const day = date.getDay()
  const monday = new Date(date)
  monday.setDate(date.getDate() - ((day + 6) % 7))
  return monday.toISOString().split('T')[0]
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const date: string = body.date
    const weekStart = getWeekStart(date)

    const dateObj = new Date(date + 'T00:00:00')
    const todayDay = DAY_NAMES[dateObj.getDay()]

    const [planRow, habitRow, jobRow] = await Promise.all([
      supabase.from('daily_plans').select('data').eq('user_id', user.id).eq('date', date).maybeSingle(),
      supabase.from('habit_weeks').select('filled').eq('user_id', user.id).eq('week_start', weekStart).maybeSingle(),
      supabase.from('daily_plans').select('data').eq('user_id', user.id).eq('date', 'job-tracker').maybeSingle(),
    ])

    const planData = planRow.data?.data ?? {}
    const habitFilled: Record<string, boolean> = habitRow.data?.filled ?? {}
    const applications = (jobRow.data?.data?.applications ?? []) as Array<{ company: string; position: string; status?: string }>

    const completedToday = HABIT_NAMES.filter((_, hi) => habitFilled[`${hi}-${todayDay}`])
    const weeklyHabitSummary = HABIT_NAMES.map((name, hi) => {
      const daysCompleted = DAYS.filter(day => habitFilled[`${hi}-${day}`])
      return `  ${name}: ${daysCompleted.length}/7 days (${daysCompleted.join(', ') || 'none yet'})`
    }).join('\n')

    const timetable = Array.isArray(planData.timetable)
      ? (planData.timetable as Array<{ time: string; activity: string }>).map(b => `  ${b.time}: ${b.activity}`).join('\n')
      : '  (No schedule set for today)'

    const intention = planData.intention || '(none set)'
    const priorities = Array.isArray(planData.priorities)
      ? (planData.priorities as Array<{ text: string; done: boolean }>).filter(p => p.text).map(p => `  - ${p.text}${p.done ? ' ✓' : ''}`).join('\n') || '  (none)'
      : '  (none)'

    const appCount = applications.length
    const recentApps = applications.slice(-5).map(a => `  - ${a.company} / ${a.position}${a.status ? ` [${a.status}]` : ''}`).join('\n')

    const prompt = `You are a warm, direct, motivational coach for a woman in her mid-20s doing a serious glow-up: building her tech career (LeetCode, job applications, cold outreach, studying) and improving her health (fasted workouts, hydration, skincare, sleep).

Today is ${date} (${dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}).

MORNING INTENTION:
${intention}

TOP PRIORITIES TODAY:
${priorities}

TODAY'S SCHEDULE:
${timetable}

THIS WEEK'S HABIT PROGRESS:
${weeklyHabitSummary}

HABITS COMPLETED SO FAR TODAY:
${completedToday.length > 0 ? completedToday.join(', ') : 'None yet. Day is just starting.'}

JOB SEARCH (${appCount} total applications tracked):
${recentApps || '  (No applications tracked yet)'}

Write a short, personal daily brief (150–200 words max). Structure it as flowing prose:
1. One sentence acknowledging where she is today, specific to her data
2. Two or three sentences of concrete, encouraging observations about her week or today's plan
3. One sentence spotlighting her most important focus today and why it matters
4. A closing sentence that is genuinely motivating, specific and not generic

Tone: warm but direct, like a high-performance friend. No corporate language. No bullet lists. No emojis. No em dashes. Under 200 words.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    })

    const brief = completion.choices[0]?.message?.content ?? ''
    return NextResponse.json({ brief })
  } catch (err) {
    console.error('daily-brief error:', err)
    return NextResponse.json({ error: 'Failed to generate brief' }, { status: 500 })
  }
}
