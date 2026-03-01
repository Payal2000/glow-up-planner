'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Nav from './Nav'

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <div className="flex min-h-screen">
      <Nav collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <motion.main
        className="flex-1 pt-[56px] md:pt-0 min-w-0"
        animate={{ marginLeft: isDesktop ? (collapsed ? 72 : 280) : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.main>
    </div>
  )
}
