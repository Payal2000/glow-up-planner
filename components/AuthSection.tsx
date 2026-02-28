'use client'

import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

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

export default function AuthSection() {
  const signInWithGoogle = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  return (
    <section
      id="auth"
      className="flex flex-col items-center justify-center px-4 py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #f9e4eb 0%, #f5dce5 50%, #fce8ef 100%)' }}
    >
      {/* Background orbs */}
      <motion.div
        className="absolute top-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(232,160,180,0.18) 0%, transparent 70%)' }}
        animate={{ x: [0, 15, 0], y: [0, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-60px] left-[-60px] w-[260px] h-[260px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(232,160,180,0.18) 0%, transparent 70%)' }}
        animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 flex flex-col items-center text-center max-w-[480px] w-full"
      >
        {/* Decorative heart-bow */}
        <img src="/icons/pink-heart-bow.png" alt="" className="w-20 h-20 object-contain mb-4 drop-shadow-sm" />

        {/* Badge */}
        <span className="font-dm text-[11px] font-semibold tracking-[4px] uppercase text-petal-deep bg-white/70 backdrop-blur-sm px-6 py-2 rounded-full mb-8 border border-petal/20">
          Your Plans, Saved Securely
        </span>

        {/* Heading */}
        <h2 className="font-playfair font-bold text-ink-dark leading-tight mb-4" style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}>
          Ready to Start Your<br />
          <span className="text-petal-deep italic">Glow-Up?</span>
        </h2>

        <p className="font-cormorant text-ink-soft leading-relaxed mb-12" style={{ fontSize: 'clamp(16px, 2.5vw, 22px)' }}>
          Sign in to save your plans, habits, meals, and goals across all your devices.
        </p>

        {/* Sign in card */}
        <motion.div
          className="w-full bg-white/80 backdrop-blur-sm rounded-[28px] p-8 shadow-card border border-petal/10"
          whileHover={{ y: -2, boxShadow: '0 12px 48px rgba(200,160,170,0.2)' }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white border border-petal-light hover:border-petal rounded-2xl px-6 py-4 text-[15px] font-semibold text-ink-dark shadow-soft hover:shadow-hover transition-all"
            whileTap={{ scale: 0.97 }}
            whileHover={{ y: -1 }}
            transition={{ duration: 0.15 }}
          >
            <GoogleIcon />
            Continue with Google
          </motion.button>

          <p className="text-[11px] text-ink-faint mt-6 leading-relaxed">
            Your data is private and only visible to you.
          </p>
        </motion.div>

        {/* Feature hints */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {['📅 Timetable', '💼 Job Tracker', '✅ Habits', '🥗 Meals', '🎯 Goals', '💪 Fitness'].map(item => (
            <span
              key={item}
              className="text-[12px] text-ink-soft bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-petal/15"
            >
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
