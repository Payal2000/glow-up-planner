'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AuthButton from './AuthButton'

const links = [
  { href: '#timetable', label: 'Timetable' },
  { href: '#daily', label: 'Daily Planner' },
  { href: '#weekly', label: 'Weekly View' },
  { href: '#habits', label: 'Habits' },
  { href: '#goals', label: 'Goals' },
  { href: '#wellness', label: 'Wellness' },
  { href: '#fitness', label: 'Fitness' },
  { href: '#meals', label: 'Meals' },
  { href: '#finance', label: 'Finance' },
  { href: '#books', label: 'Books' },
]

export default function Nav() {
  const [active, setActive] = useState('timetable')

  useEffect(() => {
    const sectionIds = links.map((l) => l.href.slice(1))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActive(href.slice(1))
  }

  return (
    <nav
      className="sticky top-0 z-50 flex gap-2 flex-wrap items-center justify-between px-6 py-3.5 overflow-x-auto"
      style={{
        background: 'rgba(254,250,248,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(232,160,180,0.15)',
      }}
    >
      <div className="flex gap-2 flex-wrap items-center">
        {links.map(({ href, label }) => {
          const isActive = active === href.slice(1)
          return (
            <motion.a
              key={href}
              href={href}
              onClick={(e) => handleClick(e, href)}
              className="text-[12px] font-medium tracking-[1px] uppercase no-underline px-[18px] py-2 rounded-full whitespace-nowrap transition-colors duration-300"
              style={{
                color: isActive ? '#3d2b2b' : '#9c7e7e',
                background: isActive ? '#f5d5de' : 'transparent',
              }}
              whileHover={{ backgroundColor: '#f5d5de', color: '#3d2b2b' }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.a>
          )
        })}
      </div>
      <AuthButton />
    </nav>
  )
}
