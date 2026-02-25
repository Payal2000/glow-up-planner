"use client"

import { useEffect, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useSelectedDate } from "@/context/DateContext"
import type { PanelId } from "@/components/app-sidebar"

const PANEL_TITLES: Record<PanelId, string> = {
  home:     "Overview",
  schedule: "Daily Schedule",
  planner:  "Daily Planner",
  habits:   "Habit Tracker",
  weekly:   "Weekly View",
  goals:    "Goals",
  fitness:  "Fitness",
  meals:    "Meals",
  agents:   "AI Agents",
  jobs:     "Job Tracker",
}

interface SiteHeaderProps {
  panel: PanelId
  onOpenAgents: () => void
}

export function SiteHeader({ panel, onOpenAgents }: SiteHeaderProps) {
  const { selectedDate } = useSelectedDate()
  const [greeting, setGreeting] = useState("Good morning")
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const h = new Date().getHours()
    if (h >= 12 && h < 17) setGreeting("Good afternoon")
    else if (h >= 17) setGreeting("Good evening")
    else setGreeting("Good morning")

    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      const email = data.user?.email
      if (email) setUserName(email.split("@")[0])
    })
  }, [])

  const dateLabel = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-petal-light bg-white px-4 lg:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

      <div className="flex flex-1 items-center gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-ink-faint font-dm leading-none mb-0.5">
            {PANEL_TITLES[panel]}
          </p>
          <h1 className="font-playfair text-[18px] text-ink-dark leading-none" suppressHydrationWarning>
            {greeting}{userName ? `, ${userName}` : ""}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <span
          className="hidden sm:inline-block text-[12px] font-cormorant italic text-ink-soft px-3 py-1 rounded-full border border-petal-light bg-petal-pale"
          suppressHydrationWarning
        >
          {dateLabel}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenAgents}
          className="rounded-full bg-petal-pale text-petal-deep border border-petal-light hover:bg-petal-light text-[11px] font-semibold uppercase tracking-wide font-dm"
        >
          <span>✦</span>
          <span className="hidden sm:inline ml-1">AI Agents</span>
        </Button>
      </div>
    </header>
  )
}
