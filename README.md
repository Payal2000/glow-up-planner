# Glow-Up Planner

A personal productivity and wellness planner built for women doing a serious glow-up — tracking career goals, daily habits, job applications, fitness, finances, and more. Powered by Next.js, Supabase, and OpenAI.

## Features

### Daily Planner
- Set daily intentions and top priorities with checkboxes
- Track LeetCode problems solved, study notes, build log, and cold outreach
- Timetable / schedule builder with color-coded block types
- Reflection section at end of day
- AI-generated **Daily Brief** — a personalised 150-word morning briefing based on your data

### Habit Tracker
- 10 daily habits tracked across a 7-day week grid (desktop table + mobile cards)
- Habits: Morning Workout, Cold Outreach, LeetCode, Study, Build, Applications, Water, Skincare, Sleep, Evening Workout
- Cloud sync per week via Supabase
- AI **4-Week Habit Analysis** — identifies strengths, gaps, and concrete fixes
- AI **Weekly Wrap-Up** — structured review auto-saved to Sunday's notes

### Job Application Tracker
- Full application table: company, position, status, date, salary, next action, contact, links
- Smart status selector (Applied, Interviewing, Offer, Rejected, Withdrawn)
- Sort by date descending, debounced cloud save
- AI **Cold Outreach Drafter** — 3-sentence LinkedIn DM per row, one click
- **Analytics tab** — stat cards, status breakdown bars, applications by month chart, conversion pipeline

### Calendar & Notes
- Monthly calendar with per-day notes
- Notes auto-populated from Weekly Wrap-Up AI output

### Additional Sections
- Goals tracker
- Fitness log
- Meals planner
- Finance tracker
- Books reading list
- Wellness section

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Auth + Database | Supabase (Postgres + RLS) |
| AI | OpenAI `gpt-4o-mini` |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Language | TypeScript |

## Getting Started

### 1. Clone and install
```bash
git clone <your-repo-url>
cd glow-up-planner
npm install
```

### 2. Set up environment variables
Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

> `OPENAI_API_KEY` is server-only — never prefix it with `NEXT_PUBLIC_`.

### 3. Set up the database
Run the SQL in `supabase-schema.sql` in your Supabase project's SQL editor. This creates the `daily_plans` and `habit_weeks` tables with RLS policies.

### 4. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in **Project Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
4. In **Supabase → Authentication → URL Configuration**, add your Vercel URL as a redirect URL: `https://your-project.vercel.app/**`
5. Deploy

## AI Agents

All AI features call server-side API routes so the OpenAI key never reaches the client.

| Agent | Route | What it does |
|---|---|---|
| Daily Brief | `/api/agent/daily-brief` | 150-word morning briefing from today's data |
| Habit Analysis | `/api/agent/habit-analysis` | 4-week habit pattern report |
| Weekly Wrap-Up | `/api/agent/weekly-wrap` | Weekly review auto-saved to Sunday notes |
| Study Plan | `/api/agent/study-plan` | 5-day LeetCode plan from your tracking data |
| Cold Outreach | `/api/agent/cold-outreach` | 3-sentence LinkedIn DM per job application |

## Project Structure

```
app/
  api/agent/          # AI agent API routes
  auth/               # Supabase auth callback
  page.tsx            # Main page
components/
  DailyPlanner.tsx    # Daily planner + AI brief
  HabitTracker.tsx    # Habit grid + AI analysis + weekly wrap
  WeeklyView.tsx      # Job tracker + analytics + cold outreach
  TimetableSection.tsx # Calendar + schedule builder
  ...                 # Goals, Fitness, Finance, Meals, Books, Wellness
context/
  DateContext.tsx     # Global selected date state
lib/
  supabase/           # Supabase client (browser + server)
supabase-schema.sql   # Database schema
```
