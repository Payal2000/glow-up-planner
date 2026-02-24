import Hero from '@/components/Hero'
import Nav from '@/components/Nav'
import TimetableSection from '@/components/TimetableSection'
import DailyPlanner from '@/components/DailyPlanner'
import WeeklyView from '@/components/WeeklyView'
import HabitTracker from '@/components/HabitTracker'
import GoalsSection from '@/components/GoalsSection'
import WellnessSection from '@/components/WellnessSection'
import FitnessSection from '@/components/FitnessSection'
import MealsSection from '@/components/MealsSection'
import FinanceSection from '@/components/FinanceSection'
import BooksSection from '@/components/BooksSection'
import WhyLoveIt from '@/components/WhyLoveIt'
import Footer from '@/components/Footer'
import Divider from '@/components/ui/Divider'

export default function Home() {
  return (
    <main>
      <Hero />
      <Nav />
      <TimetableSection />
      <Divider />
      <DailyPlanner />
      <Divider />
      <WeeklyView />
      <Divider />
      <HabitTracker />
      <Divider />
      <GoalsSection />
      <Divider />
      <WellnessSection />
      <Divider />
      <FitnessSection />
      <Divider />
      <MealsSection />
      <Divider />
      <FinanceSection />
      <Divider />
      <BooksSection />
      <Divider />
      <WhyLoveIt />
      <Footer />
    </main>
  )
}
