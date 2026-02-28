'use client'

import { motion } from 'framer-motion'

type CardColor = 'rose' | 'sage' | 'lavender' | 'peach' | 'sky' | 'gold' | 'latte'

const gradients: Record<CardColor, string> = {
  rose: 'linear-gradient(90deg, #e8a0b4, #f5d5de)',
  sage: 'linear-gradient(90deg, #b8c9a3, #e3ecd8)',
  lavender: 'linear-gradient(90deg, #f5b8c8, #fce8ef)',
  peach: 'linear-gradient(90deg, #f5c4a1, #fce8d5)',
  sky: 'linear-gradient(90deg, #a8c8e0, #daeaf5)',
  gold: 'linear-gradient(90deg, #e0c88a, #f5ecd0)',
  latte: 'linear-gradient(90deg, #b08b6e, #f0e0d4)',
}

const dotColors: Record<CardColor, string> = {
  rose: '#e8a0b4',
  sage: '#b8c9a3',
  lavender: '#f5b8c8',
  peach: '#f5c4a1',
  sky: '#a8c8e0',
  gold: '#e0c88a',
  latte: '#d4b89c',
}

interface PlannerCardProps {
  color: CardColor
  title: string
  desc?: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function PlannerCard({ color, title, desc, children, className = '', style }: PlannerCardProps) {
  return (
    <motion.div
      className={`bg-[#f0e8e0] rounded-[20px] pt-0 overflow-hidden shadow-soft relative ${className}`}
      style={style}
      whileHover={{ y: -6, boxShadow: '0 8px 40px rgba(200,160,170,0.22)' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Gradient top bar */}
      <div className="h-1 w-full" style={{ background: gradients[color] }} />

      <div className="p-5 sm:p-7 md:p-9">
        <h3 className="font-playfair text-xl text-ink-dark mb-1.5">{title}</h3>
        {desc && <p className="text-[13px] text-ink-soft mb-5">{desc}</p>}

        {/* Provide dot color via CSS variable for list items */}
        <div
          style={{ '--dot-color': dotColors[color] } as React.CSSProperties}
          className="card-dot-context"
        >
          {children}
        </div>
      </div>
    </motion.div>
  )
}

export function CardList({ items }: { items: string[] }) {
  return (
    <ul className="list-none">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-center gap-2.5 text-[14px] text-ink-mid py-2.5 border-b border-[rgba(200,160,170,0.1)] last:border-0"
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: 'var(--dot-color, #e8a0b4)' }}
          />
          {item}
        </li>
      ))}
    </ul>
  )
}
