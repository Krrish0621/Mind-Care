"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

interface DarkModeContextType {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export const useDarkMode = () => {
  const context = useContext(DarkModeContext)
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider')
  }
  return context
}

interface DarkModeProviderProps {
  children: React.ReactNode
}

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Detect if dark mode class is already set from hardcoded place:
    const html = document.documentElement
    const hardcodedDark = html.classList.contains('dark')

    const savedTheme = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    // If hardcoded dark mode is present, prioritize that and sync state
    if (hardcodedDark) {
      setIsDarkMode(true)
      // Do NOT add or remove class, since it's hardcoded and must stay
    } else {
      // Otherwise apply dark mode following saved setting or prefers-color-scheme
      if (savedTheme === 'true' || (!savedTheme && prefersDark)) {
        setIsDarkMode(true)
        html.classList.add('dark')
      } else {
        setIsDarkMode(false)
        html.classList.remove('dark')
      }
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())

    const html = document.documentElement

    // Only toggle class if not hardcoded
    if (!html.classList.contains('dark') || !newDarkMode) {
      if (newDarkMode) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    }
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}
