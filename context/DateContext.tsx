'use client'

import { createContext, useContext, useState } from 'react'

interface DateContextValue {
  selectedDate: Date
  setSelectedDate: (d: Date) => void
}

const DateContext = createContext<DateContextValue>({
  selectedDate: new Date(),
  setSelectedDate: () => {},
})

export function DateProvider({ children }: { children: React.ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  )
}

export function useSelectedDate() {
  return useContext(DateContext)
}
