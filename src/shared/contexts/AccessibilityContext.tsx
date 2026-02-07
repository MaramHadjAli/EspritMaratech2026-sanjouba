import React, { createContext, useState, useEffect, useCallback } from 'react'
import { AccessibilityContextType } from '@types'

export const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTTSEnabled, setIsTTSEnabled] = useState(() => {
    return localStorage.getItem('ttsEnabled') === 'true'
  })

  const [isKeyboardNavEnabled, setIsKeyboardNavEnabled] = useState(() => {
    return localStorage.getItem('keyboardNavEnabled') !== 'false' // Default true
  })

  const [isHighContrastMode, setIsHighContrastMode] = useState(() => {
    return localStorage.getItem('highContrastMode') === 'true'
  })

  const [fontSize, setFontSizeState] = useState(() => {
    return parseInt(localStorage.getItem('accessibilityFontSize') || '100', 10)
  })

  // Apply high contrast mode
  useEffect(() => {
    localStorage.setItem('highContrastMode', isHighContrastMode.toString())
    if (isHighContrastMode) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [isHighContrastMode])

  // Apply font size
  useEffect(() => {
    localStorage.setItem('accessibilityFontSize', fontSize.toString())
    document.documentElement.style.setProperty('--accessibility-font-scale', `${fontSize / 100}`)
  }, [fontSize])

  // Save TTS preference
  useEffect(() => {
    localStorage.setItem('ttsEnabled', isTTSEnabled.toString())
  }, [isTTSEnabled])

  // Save keyboard nav preference
  useEffect(() => {
    localStorage.setItem('keyboardNavEnabled', isKeyboardNavEnabled.toString())
  }, [isKeyboardNavEnabled])

  const toggleTTS = useCallback(() => {
    setIsTTSEnabled(prev => {
      if (prev) {
        // Stop any ongoing speech
        window.speechSynthesis?.cancel()
      }
      return !prev
    })
  }, [])

  const toggleKeyboardNav = useCallback(() => {
    setIsKeyboardNavEnabled(prev => !prev)
  }, [])

  const toggleHighContrast = useCallback(() => {
    setIsHighContrastMode(prev => !prev)
  }, [])

  const setFontSize = useCallback((size: number) => {
    // Clamp between 80% and 150%
    const clampedSize = Math.max(80, Math.min(150, size))
    setFontSizeState(clampedSize)
  }, [])

  // Text-to-speech helper
  const speakText = useCallback((text: string) => {
    if (!isTTSEnabled || !window.speechSynthesis) return
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = document.documentElement.lang || 'fr-FR'
    utterance.rate = 0.9
    utterance.pitch = 1
    
    window.speechSynthesis.speak(utterance)
  }, [isTTSEnabled])

  const stopSpeech = useCallback(() => {
    window.speechSynthesis?.cancel()
  }, [])

  const value: AccessibilityContextType = {
    isTTSEnabled,
    toggleTTS,
    isKeyboardNavEnabled,
    toggleKeyboardNav,
    isHighContrastMode,
    toggleHighContrast,
    fontSize,
    setFontSize,
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export default AccessibilityProvider
