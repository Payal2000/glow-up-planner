'use client'

import { useState, useEffect } from 'react'
import type { MouseEvent } from 'react'
import { motion } from 'framer-motion'
import AuthButton from './AuthButton'

const links = [
  { href: '#timetable', label: 'Timetable' },
  { href: '#daily', label: 'Daily Planner' },
  { href: '#weekly', label: 'Job Tracker' },
  { href: '#habits', label: 'Habits' },
  { href: '#goals', label: 'Goals' },
  { href: '#fitness', label: 'Fitness' },
  { href: '#meals', label: 'Meals' },
]

export default function Nav() {
  const [active, setActive] = useState('timetable')
  const [menuOpen, setMenuOpen] = useState(false)

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

  const closeMenuIfMobile = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setMenuOpen(false)
    }
  }

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActive(href.slice(1))
    closeMenuIfMobile()
  }

  return (
    <nav
      className="sticky top-0 z-50 px-4 sm:px-6 py-3.5"
      style={{
        background: 'rgba(254,250,248,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(232,160,180,0.15)',
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="hidden md:flex gap-2 flex-wrap items-center flex-1">
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

        <div className="md:hidden flex items-center justify-between w-full gap-3">
          <p className="text-[11px] font-semibold tracking-[4px] uppercase text-petal">
            Sections
          </p>
          <motion.button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-[12px] font-medium tracking-[1px] uppercase px-4 py-2 rounded-full border border-petal/40 text-ink-mid flex items-center gap-2"
            whileTap={{ scale: 0.95 }}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {menuOpen ? 'Close' : 'Menu'}
            <span className="text-petal-deep">{menuOpen ? '—' : '+'}</span>
          </motion.button>
        </div>

        <div className="hidden md:flex">
          <AuthButton />
        </div>
      </div>

      <motion.div
        id="mobile-nav"
        initial={false}
        animate={{ opacity: menuOpen ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${menuOpen ? 'max-h-[700px] mt-3' : 'max-h-0'}`}
        aria-hidden={!menuOpen}
      >
        <div className="flex flex-col gap-1.5 pt-3">
          {links.map(({ href, label }) => {
            const isActive = active === href.slice(1)
            return (
              <motion.a
                key={`mobile-${href}`}
                href={href}
                onClick={(e) => handleClick(e, href)}
                className="text-[12px] font-medium tracking-[1px] uppercase no-underline px-4 py-2 rounded-full transition-colors duration-300 text-center"
                style={{
                  color: isActive ? '#3d2b2b' : '#9c7e7e',
                  background: isActive ? '#f5d5de' : '#fef8f5',
                }}
                whileHover={{ backgroundColor: '#f5d5de', color: '#3d2b2b' }}
                transition={{ duration: 0.2 }}
              >
                {label}
              </motion.a>
            )
          })}
        </div>
        <div className="pt-3 border-t border-[rgba(232,160,180,0.2)] mt-3">
          <AuthButton />
        </div>
      </motion.div>
    </nav>
  )
}
