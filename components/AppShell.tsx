'use client'

import { DateProvider } from '@/context/DateContext'
import TimetableSection from './TimetableSection'
import DailyPlanner from './DailyPlanner'
import JobTracker from './JobTracker'
import HabitTracker from './HabitTracker'
import FitnessSection from './FitnessSection'
import MealsSection from './MealsSection'
import Footer from './Footer'
import Divider from './ui/Divider'

export default function AppShell() {
  return (
    <DateProvider>
      <div
        style={{
          backgroundImage: 'url(/images/castor.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center top',
        }}
      >
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
      <FitnessSection />
      <Footer />
      </div>
    </DateProvider>
  )
}
