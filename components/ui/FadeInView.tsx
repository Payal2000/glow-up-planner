'use client'

import { motion } from 'framer-motion'

interface FadeInViewProps {
  children: React.ReactNode
  delay?: number
  className?: string
  y?: number
}

export default function FadeInView({ children, delay = 0, className, y = 30 }: FadeInViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
