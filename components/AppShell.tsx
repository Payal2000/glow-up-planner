'use client'

import { DateProvider } from '@/context/DateContext'
import TimetableSection from './TimetableSection'
import DailyPlanner from './DailyPlanner'
import WeeklyView from './WeeklyView'
import HabitTracker from './HabitTracker'
import GoalsSection from './GoalsSection'
import FitnessSection from './FitnessSection'
import MealsSection from './MealsSection'
import WhyLoveIt from './WhyLoveIt'
import Footer from './Footer'
import Divider from './ui/Divider'

export default function AppShell() {
  return (
    <DateProvider>
      <TimetableSection />
      <Divider />
      <DailyPlanner />
      <Divider />
      <HabitTracker />
      <Divider />
      <WeeklyView />
      <Divider />
      <GoalsSection />
      <Divider />
      <FitnessSection />
      <Divider />
      <MealsSection />
      <Divider />
      <WhyLoveIt />
      <Footer />
    </DateProvider>
  )
}
