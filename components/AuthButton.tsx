'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import type { User } from '@supabase/supabase-js'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  // Create client only once, client-side
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)

  useEffect(() => {
    supabaseRef.current = createClient()
    const supabase = supabaseRef.current

    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabaseRef.current?.auth.signOut()
    window.location.href = '/login'
  }

  if (!user) return null

  const initials = user.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : user.email?.[0].toUpperCase() ?? '?'

  const avatar = user.user_metadata?.avatar_url

  return (
    <div className="flex items-center gap-2">
      {avatar ? (
        <img src={avatar} alt="avatar" className="w-7 h-7 rounded-full object-cover border border-petal-light" />
      ) : (
        <div className="w-7 h-7 rounded-full bg-petal-pale border border-petal-light flex items-center justify-center text-[11px] font-bold text-petal-deep">
          {initials}
        </div>
      )}
      <motion.button
        onClick={signOut}
        className="text-[11px] font-semibold tracking-wider uppercase text-ink-soft hover:text-ink-dark transition-colors"
        whileTap={{ scale: 0.95 }}
      >
        Sign out
      </motion.button>
    </div>
  )
}
