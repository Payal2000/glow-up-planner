'use client'

import { motion } from 'framer-motion'
import SectionHeader from './ui/SectionHeader'
import FadeInView from './ui/FadeInView'

const features = [
  { color: 'rose' as const, emoji: '🌸', desc: 'Aesthetic, feminine, motivating design' },
  { color: 'lavender' as const, emoji: '🌟', desc: 'Fully customizable to your lifestyle' },
  { color: 'sage' as const, emoji: '🎯', desc: 'Perfect for your 2026 glow-up journey' },
  { color: 'peach' as const, emoji: '📋', desc: 'Clear instructions included' },
  { color: 'gold' as const, emoji: '⚡', desc: 'Instantly available and easy to duplicate' },
  { color: 'sky' as const, emoji: '🧠', desc: 'Research-backed timetable built in' },
]

const gradients: Record<string, string> = {
  rose: 'linear-gradient(90deg, #e8a0b4, #f5d5de)',
  lavender: 'linear-gradient(90deg, #f5b8c8, #fce8ef)',
  sage: 'linear-gradient(90deg, #b8c9a3, #e3ecd8)',
  peach: 'linear-gradient(90deg, #f5c4a1, #fce8d5)',
  gold: 'linear-gradient(90deg, #e0c88a, #f5ecd0)',
  sky: 'linear-gradient(90deg, #a8c8e0, #daeaf5)',
}

export default function WhyLoveIt() {
  return (
    <section className="max-w-[800px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SectionHeader
        icon="🎀"
        label="Made For You"
        title="Why You'll Love It"
      />

      <FadeInView delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.emoji}
              className="bg-[#fffcf8] rounded-[20px] overflow-hidden shadow-soft text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -6, boxShadow: '0 8px 40px rgba(200,160,170,0.22)' }}
            >
              <div className="h-1 w-full" style={{ background: gradients[f.color] }} />
              <div className="p-9">
                <h3 className="font-playfair text-3xl mb-2">{f.emoji}</h3>
                <p className="text-[13px] text-ink-soft">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </FadeInView>
    </section>
  )
}
