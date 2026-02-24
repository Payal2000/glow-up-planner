'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  percent: number
  label?: string
  title?: string
}

export default function ProgressBar({ percent, label, title }: ProgressBarProps) {
  return (
    <div className="bg-white rounded-[16px] p-6 shadow-soft mb-4">
      {title && (
        <h4 className="font-playfair text-[17px] text-ink-dark mb-3">{title}</h4>
      )}
      <div className="h-2 bg-petal-pale rounded-full overflow-hidden mb-2">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #e8a0b4, #c77d94)' }}
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
      {label && <p className="text-[12px] text-ink-soft">{label}</p>}
    </div>
  )
}
