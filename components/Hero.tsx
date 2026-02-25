'use client'

import { motion } from 'framer-motion'

const tags = [
  '💗 Agendas & Planning',
  '✨ Wellness & Self-Care',
  '🎯 Goals & Life Design',
  '💪 Fitness & Glow-Up',
  '🥗 Meals & Lifestyle',
  '💰 Finance & Money',
  '📚 Books & Mindset',
]

const fadeDown = (delay: number) => ({
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] },
})

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 py-[60px] relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #fffbf9 0%, #fdf0f4 50%, #f9e4eb 100%)' }}
    >
      {/* Floating orb top-right */}
      <motion.div
        className="absolute -top-[100px] -right-[100px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(232,160,180,0.2) 0%, transparent 70%)' }}
        animate={{ x: [0, 20, 0], y: [0, -30, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Floating orb bottom-left */}
      <motion.div
        className="absolute -bottom-[60px] -left-[80px] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(184,201,163,0.15) 0%, transparent 70%)' }}
        animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Ribbon */}
      <motion.span
        {...fadeDown(0)}
        className="font-dm text-[11px] font-semibold tracking-[4px] uppercase text-petal-deep bg-white/60 backdrop-blur-[10px] px-7 py-2.5 rounded-full mb-8 relative z-10"
      >
        🎀 Your 2026 Glow-Up Starts Here
      </motion.span>

      {/* Headline */}
      <motion.h1
        {...fadeDown(0.1)}
        className="font-playfair font-bold leading-[1.1] text-ink-dark mb-2 relative z-10"
        style={{ fontSize: 'clamp(48px, 8vw, 90px)' }}
      >
        Glow-Up{' '}
        <span className="text-petal-deep italic">Life</span>{' '}
        Planner
      </motion.h1>

      {/* Year */}
      <motion.p
        {...fadeDown(0.2)}
        className="font-cormorant text-ink-soft font-normal tracking-[6px] mb-7 relative z-10"
        style={{ fontSize: 'clamp(20px, 3vw, 32px)' }}
      >
        — 2 0 2 6 —
      </motion.p>

      {/* Description */}
      <motion.p
        {...fadeDown(0.3)}
        className="max-w-[560px] text-[16px] text-ink-mid leading-[1.8] mb-10 relative z-10"
      >
        This planner is built for girls who want structure without stress. It keeps your days
        clear, your goals organized, and your routines simple. Everything you need — planning,
        habits, fitness, meals, money, and self-care — in one place.
      </motion.p>

      {/* Tags */}
      <motion.div
        {...fadeDown(0.4)}
        className="flex flex-wrap gap-2.5 justify-center relative z-10"
      >
        {tags.map((tag) => (
          <motion.span
            key={tag}
            className="text-[12px] font-medium px-[18px] py-2 rounded-full bg-white/70 text-ink-mid backdrop-blur-sm border border-petal/20"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.9)' }}
            transition={{ duration: 0.2 }}
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>
    </section>
  )
}
