'use client'

import { DateProvider } from '@/context/DateContext'
import TimetableSection from './TimetableSection'
import DailyPlanner from './DailyPlanner'
import JobTracker from './JobTracker'
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
      <JobTracker />
      <Divider />
      <HabitTracker />
      <Divider />
      <MealsSection />
      <Divider />
      <GoalsSection />
      <Divider />
      <FitnessSection />
      <Divider />
      <WhyLoveIt />
      <Footer />
    </DateProvider>
  )
}
