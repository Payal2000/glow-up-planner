'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Nav from './Nav'

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Nav collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <motion.main
        className="flex-1 pt-[56px] md:pt-0"
        animate={{ marginLeft: collapsed ? 72 : 280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ marginLeft: 280 }}
      >
        {children}
      </motion.main>
    </div>
  )
}
