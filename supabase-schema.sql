-- Run this in your Supabase project: SQL Editor → New query → Run

-- ── Daily Plans ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_plans (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  date        DATE        NOT NULL,
  data        JSONB       NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, date)
);

ALTER TABLE daily_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own daily plans" ON daily_plans;
CREATE POLICY "Users can read own daily plans"
  ON daily_plans FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can upsert own daily plans" ON daily_plans;
CREATE POLICY "Users can upsert own daily plans"
  ON daily_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own daily plans" ON daily_plans;
CREATE POLICY "Users can update own daily plans"
  ON daily_plans FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own daily plans" ON daily_plans;
CREATE POLICY "Users can delete own daily plans"
  ON daily_plans FOR DELETE
  USING (auth.uid() = user_id);

-- ── Timetables ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS timetables (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  entries     JSONB       NOT NULL DEFAULT '[]'::jsonb,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own timetable" ON timetables;
CREATE POLICY "Users can read own timetable"
  ON timetables FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can upsert own timetable" ON timetables;
CREATE POLICY "Users can upsert own timetable"
  ON timetables FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own timetable" ON timetables;
CREATE POLICY "Users can update own timetable"
  ON timetables FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own timetable" ON timetables;
CREATE POLICY "Users can delete own timetable"
  ON timetables FOR DELETE
  USING (auth.uid() = user_id);

-- ── Habit Weeks ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS habit_weeks (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  week_start  DATE        NOT NULL,  -- always a Monday
  filled      JSONB       NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, week_start)
);

ALTER TABLE habit_weeks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own habit weeks" ON habit_weeks;
CREATE POLICY "Users can read own habit weeks"
  ON habit_weeks FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can upsert own habit weeks" ON habit_weeks;
CREATE POLICY "Users can upsert own habit weeks"
  ON habit_weeks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own habit weeks" ON habit_weeks;
CREATE POLICY "Users can update own habit weeks"
  ON habit_weeks FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own habit weeks" ON habit_weeks;
CREATE POLICY "Users can delete own habit weeks"
  ON habit_weeks FOR DELETE
  USING (auth.uid() = user_id);
