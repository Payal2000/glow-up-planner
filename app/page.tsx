export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Hero from '@/components/Hero'
import AppShell from '@/components/AppShell'
import AuthSection from '@/components/AuthSection'
import SidebarLayout from '@/components/SidebarLayout'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main>
        <Hero />
        <AuthSection />
      </main>
    )
  }

  // ── Logged in: Collapsible Sidebar + Dashboard ──────────────────────────────
  return (
    <SidebarLayout>
      <AppShell />
    </SidebarLayout>
  )
}
