export const dynamic = 'force-dynamic'

import Hero from '@/components/Hero'
import Nav from '@/components/Nav'
import AppShell from '@/components/AppShell'

export default function Home() {
  return (
    <main>
      <Hero />
      <Nav />
      <AppShell />
    </main>
  )
}
