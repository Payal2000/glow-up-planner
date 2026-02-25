import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { company, position, contact } = await req.json()
    if (!company && !position) return NextResponse.json({ error: 'company or position required' }, { status: 400 })

    const prompt = `You are helping a woman in her mid-20s write a cold outreach message for a job opportunity. She is a software engineer actively grinding LeetCode, building projects, and doing a serious career glow-up.

Target: ${position || 'Software Engineer'} role at ${company || 'this company'}${contact ? `, reaching out to ${contact}` : ''}.

Write a 3-sentence LinkedIn DM (or cold email body, no subject line) that:
1. Opens with ONE specific, genuine detail about ${company || 'the company'}: their product, tech stack, mission, or culture (make it feel researched, not generic)
2. Introduces her briefly: software engineer, building in tech, actively improving her skills through daily LeetCode, personal projects, and studying CS fundamentals
3. Ends with a clear, low-pressure ask: a 15-min chat, advice on breaking in, or referral consideration

Tone: warm, direct, confident. Not desperate or formal. No filler phrases like "I hope this finds you well." No placeholders like [your name]. No em dashes. Just the 3-sentence message body, ready to send.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    })

    const message = completion.choices[0]?.message?.content ?? ''
    return NextResponse.json({ message })
  } catch (err) {
    console.error('cold-outreach error:', err)
    return NextResponse.json({ error: 'Failed to generate outreach' }, { status: 500 })
  }
}
