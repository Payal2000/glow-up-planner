'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSelectedDate } from '@/context/DateContext'

/**
 * Shared hook for sections that persist data per-date in daily_plans.data[sectionKey].
 * Each section has its own namespace so saves don't clobber each other.
 */
export function useDailySection<T extends Record<string, unknown>>(
  sectionKey: string,
  makeDefault: () => T,
) {
  const supabase = createClient()
  const { selectedDate } = useSelectedDate()
  const dateKey = selectedDate.toISOString().split('T')[0]

  const [data, setData] = useState<T>(makeDefault)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstLoad = useRef(true)
  const defaultRef = useRef(makeDefault)

  // Load when date changes
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    isFirstLoad.current = true

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || cancelled) return

      const { data: row } = await supabase
        .from('daily_plans')
        .select('data')
        .eq('user_id', user.id)
        .eq('date', dateKey)
        .maybeSingle()

      if (!cancelled) {
        const saved = row?.data?.[sectionKey]
        setData(saved ? { ...defaultRef.current(), ...saved } : defaultRef.current())
        setLoading(false)
        setTimeout(() => { isFirstLoad.current = false }, 0)
      }
    }

    load()
    return () => { cancelled = true }
  }, [dateKey]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save (debounced 700ms), read-merge-write to preserve other sections
  useEffect(() => {
    if (loading || isFirstLoad.current) return

    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: existing } = await supabase
        .from('daily_plans')
        .select('data')
        .eq('user_id', user.id)
        .eq('date', dateKey)
        .maybeSingle()

      const merged = { ...(existing?.data ?? {}), [sectionKey]: data }
      await supabase.from('daily_plans').upsert(
        { user_id: user.id, date: dateKey, data: merged, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,date' },
      )

      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    }, 700)

    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  const update = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setData(prev => ({ ...prev, [key]: value }))
  }, [])

  return { data, setData, update, loading, saved, dateKey }
}
