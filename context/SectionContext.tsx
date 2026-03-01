'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type SectionId = 'timetable' | 'daily' | 'weekly' | 'habits' | 'meals' | 'fitness'

const STORAGE_KEY = 'glow-up-active-section'
const VALID: SectionId[] = ['timetable', 'daily', 'weekly', 'habits', 'meals', 'fitness']

function readStored(): SectionId {
  if (typeof window === 'undefined') return 'timetable'
  const v = localStorage.getItem(STORAGE_KEY)
  return VALID.includes(v as SectionId) ? (v as SectionId) : 'timetable'
}

interface SectionContextValue {
  activeSection: SectionId
  setActiveSection: (id: SectionId) => void
}

const SectionContext = createContext<SectionContextValue>({
  activeSection: 'timetable',
  setActiveSection: () => {},
})

export function SectionProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSectionState] = useState<SectionId>('timetable')

  // Restore from localStorage on mount
  useEffect(() => {
    setActiveSectionState(readStored())
  }, [])

  const setActiveSection = (id: SectionId) => {
    localStorage.setItem(STORAGE_KEY, id)
    setActiveSectionState(id)
  }

  return (
    <SectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </SectionContext.Provider>
  )
}

export const useSection = () => useContext(SectionContext)
