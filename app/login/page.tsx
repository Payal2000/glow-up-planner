'use client'

import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const signInWithGoogle = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="bg-white rounded-[24px] shadow-card p-12 max-w-sm w-full text-center"
      >
        <span className="text-4xl block mb-4">🌸</span>
        <h1 className="font-playfair text-[28px] text-ink-dark mb-2">Glow-Up Planner</h1>
        <p className="text-[14px] text-ink-soft mb-10">
          Sign in to save your plans across all devices.
        </p>

        <motion.button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white border border-petal-light hover:border-petal rounded-xl px-5 py-3.5 text-[14px] font-semibold text-ink-dark shadow-soft hover:shadow-hover transition-all"
          whileTap={{ scale: 0.97 }}
          whileHover={{ y: -1 }}
          transition={{ duration: 0.15 }}
        >
          <GoogleIcon />
          Continue with Google
        </motion.button>

        <p className="text-[11px] text-ink-faint mt-8 leading-relaxed">
          Your data is private and only visible to you.
        </p>
      </motion.div>
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}
