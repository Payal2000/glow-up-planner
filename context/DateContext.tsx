'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface DateContextValue {
  selectedDate: Date
  setSelectedDate: (d: Date) => void
}

const DateContext = createContext<DateContextValue>({
  selectedDate: new Date(),
  setSelectedDate: () => {},
})

export function DateProvider({ children }: { children: React.ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    setSelectedDate(new Date())
  }, [])

  // During SSR selectedDate is null; suppress hydration warnings on date-displaying
  // elements handle the brief server/client mismatch until useEffect fires on client
  return (
    <DateContext.Provider value={{ selectedDate: selectedDate ?? new Date(), setSelectedDate }}>
      {children}
    </DateContext.Provider>
  )
}

export function useSelectedDate() {
  return useContext(DateContext)
}
