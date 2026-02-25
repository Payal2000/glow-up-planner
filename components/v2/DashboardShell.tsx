'use client'

import { useState } from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar, type PanelId } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import HomePanel from './HomePanel'
import AgentsPanel from './AgentsPanel'
import TimetableTimeline from './TimetableTimeline'
import JobsKanban from './JobsKanban'

// Existing sections
import DailyPlanner from '../DailyPlanner'
import HabitTracker from '../HabitTracker'
import WeeklyView from '../WeeklyView'
import GoalsSection from '../GoalsSection'
import FitnessSection from '../FitnessSection'
import MealsSection from '../MealsSection'

export default function DashboardShell() {
  const [panel, setPanel] = useState<PanelId>('home')

  const renderPanel = () => {
    switch (panel) {
      case 'home':     return <HomePanel onNav={setPanel} />
      case 'schedule': return <TimetableTimeline />
      case 'planner':  return <DailyPlanner />
      case 'habits':   return <HabitTracker />
      case 'weekly':   return <WeeklyView />
      case 'goals':    return <GoalsSection />
      case 'fitness':  return <FitnessSection />
      case 'meals':    return <MealsSection />
      case 'agents':   return <AgentsPanel />
      case 'jobs':     return <JobsKanban />
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar activePanel={panel} onNav={setPanel} variant="inset" />
      <SidebarInset>
        <SiteHeader panel={panel} onOpenAgents={() => setPanel('agents')} />
        <main className="flex-1 overflow-y-auto bg-warm-white">
          {renderPanel()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
