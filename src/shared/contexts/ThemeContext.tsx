import React, { createContext, useContext, useState, useEffect } from 'react'
import { ThemeContextType } from '@types'

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode')
    if (stored !== null) return JSON.parse(stored)
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const [fontScale, setFontScale] = useState(() => {
    return parseFloat(localStorage.getItem('fontScale') || '1')
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
    const root = document.documentElement
    if (isDarkMode) {
      root.setAttribute('data-theme', 'dark')
      root.classList.add('dark')
    } else {
      root.removeAttribute('data-theme')
      root.classList.remove('dark')
    }
  }, [isDarkMode])

  useEffect(() => {
    localStorage.setItem('fontScale', fontScale.toString())
    document.documentElement.setAttribute('data-font-scale', fontScale.toString())
    document.documentElement.style.fontSize = `${16 * fontScale}px`
  }, [fontScale])

  const toggleDarkMode = () => setIsDarkMode((prev: boolean) => !prev)

  const increaseFontSize = () => {
    setFontScale(prev => Math.min(prev + 0.1, 2))
  }

  const decreaseFontSize = () => {
    setFontScale(prev => Math.max(prev - 0.1, 0.8))
  }

  const resetFontSize = () => {
    setFontScale(1)
  }

  const value: ThemeContextType = {
    isDarkMode,
    toggleDarkMode,
    fontScale,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
