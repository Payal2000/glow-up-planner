import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

function getWeekStart(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDay()
  d.setDate(d.getDate() - ((day + 6) % 7))
  return d.toISOString().split('T')[0]
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { date } = await req.json()
    if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })

    const weekStart = getWeekStart(date)
    const weekDates = DAYS.map((_, i) => addDays(weekStart, i))

    // Fetch all daily_plans for the week in parallel
    const dayRows = await Promise.all(
      weekDates.map(d =>
        supabase.from('daily_plans').select('data').eq('user_id', user.id).eq('date', d).maybeSingle()
          .then(r => ({ date: d, day: DAYS[weekDates.indexOf(d)], data: r.data?.data ?? {} }))
      )
    )

    // Collect all LeetCode attempts across the week
    type CheckItem = { text: string; done: boolean }
    const leetcodeSummary: string[] = []
    const studyNotesSummary: string[] = []

    for (const row of dayRows) {
      const lc = (row.data.leetcode as CheckItem[] ?? []).filter(p => p.text)
      const sn = row.data.studyNotes as string
      if (lc.length > 0) {
        const solved = lc.filter(p => p.done).map(p => p.text)
        const attempted = lc.filter(p => !p.done).map(p => p.text)
        leetcodeSummary.push(`  ${row.day}: solved [${solved.join(', ') || 'none'}]${attempted.length ? `, attempted [${attempted.join(', ')}]` : ''}`)
      }
      if (sn?.trim()) {
        studyNotesSummary.push(`  ${row.day}: ${sn.trim().slice(0, 120)}${sn.length > 120 ? '…' : ''}`)
      }
    }

    const totalSolved = dayRows.reduce((sum, r) => {
      const lc = r.data.leetcode as CheckItem[] ?? []
      return sum + lc.filter(p => p.done && p.text).length
    }, 0)

    const weekLabel = new Date(weekStart + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

    const prompt = `You are a technical study coach building a personalized 5-day LeetCode and CS study plan for a woman grinding her tech career. She tracks daily LeetCode and study sessions.

CURRENT WEEK (${weekLabel}):

LEETCODE ACTIVITY:
${leetcodeSummary.length > 0 ? leetcodeSummary.join('\n') : '  No problems recorded yet this week'}

STUDY NOTES:
${studyNotesSummary.length > 0 ? studyNotesSummary.join('\n') : '  No study notes recorded'}

TOTAL PROBLEMS SOLVED THIS WEEK: ${totalSolved}

Respond in this exact structure. Use the section headers exactly as written. Do not use em dashes anywhere.

GAPS THIS WEEK
Name 1 to 2 specific weak areas or topics she avoided, based on what is missing or unsolved in her data. If no data, name foundational areas she should prioritize. Be direct and specific, not generic.

HOW TO ADDRESS THE GAPS
For each gap named above, give one concrete action she can take next week. Write as a short numbered list, one item per gap, one sentence each.

5-DAY PLAN
Write the plan as 5 lines, one per day, in this format:
Monday: [topic] | [2 to 3 specific LeetCode problems or problem types] | [brief study focus]
Tuesday: [topic] | [2 to 3 specific problems] | [study focus]
Wednesday: [topic] | [2 to 3 specific problems] | [study focus]
Thursday: [topic] | [2 to 3 specific problems] | [study focus]
Friday: [topic] | [2 to 3 specific problems] | [study focus]

Rules: If she solved problems, infer her level and suggest slightly harder or adjacent topics. If no problems recorded, start with Arrays, Strings, Hash Maps. Rotate through: Arrays/Strings, Trees/Graphs, Dynamic Programming, Sliding Window, Binary Search. Each day targets 5 problems. No emojis. No hashtags. No em dashes. No motivational filler.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    })

    const plan = completion.choices[0]?.message?.content ?? ''
    return NextResponse.json({ plan })
  } catch (err) {
    console.error('study-plan error:', err)
    return NextResponse.json({ error: 'Failed to generate study plan' }, { status: 500 })
  }
}
