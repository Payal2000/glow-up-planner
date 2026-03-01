'use client'

import { createContext, useContext, useState } from 'react'

type SectionId = 'timetable' | 'daily' | 'weekly' | 'habits' | 'meals' | 'fitness'

interface SectionContextValue {
  activeSection: SectionId
  setActiveSection: (id: SectionId) => void
}

const SectionContext = createContext<SectionContextValue>({
  activeSection: 'timetable',
  setActiveSection: () => {},
})

export function SectionProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<SectionId>('timetable')
  return (
    <SectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </SectionContext.Provider>
  )
}

export const useSection = () => useContext(SectionContext)
