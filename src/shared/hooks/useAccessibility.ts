/**
 * useAccessibility Hook
 * Custom hook for managing accessibility features
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import {
  focusElement,
  trapFocus,
  prefersReducedMotion,
  prefersReducedText,
  prefersDarkMode,
  generateUniqueId,
  announceToScreenReader,
} from '@utils/accessibility'

interface UseAccessibilityOptions {
  enableSkipLink?: boolean
  enableFocusTrap?: boolean
  announceChanges?: boolean
}

export const useAccessibility = (options: UseAccessibilityOptions = {}) => {
  const { enableSkipLink = true, enableFocusTrap = false, announceChanges = true } = options
  const containerRef = useRef<HTMLDivElement>(null)
  const [announcement, setAnnouncement] = useState<string>('')

  // Focus management
  const setFocus = useCallback((element: HTMLElement | null) => {
    if (element) {
      focusElement(element)
    }
  }, [])

  const focusOnMount = useCallback(() => {
    if (containerRef.current) {
      focusElement(containerRef.current)
    }
  }, [])

  // Announce updates to screen readers
  const announce = useCallback((message: string, assertive = false) => {
    if (announceChanges) {
      setAnnouncement(message)
      announceToScreenReader(message, assertive ? 'assertive' : 'polite')
    }
  }, [announceChanges])

  // Tab trap for modals
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (enableFocusTrap && containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      if (focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
        trapFocus(event, firstElement, lastElement)
      }
    }
  }, [enableFocusTrap])

  // Preference checks
  const reducedMotion = prefersReducedMotion()
  const reducedText = prefersReducedText()
  const darkMode = prefersDarkMode()

  useEffect(() => {
    if (containerRef.current && enableFocusTrap) {
      containerRef.current.addEventListener('keydown', handleKeyDown)
      return () => {
        containerRef.current?.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [enableFocusTrap, handleKeyDown])

  return {
    containerRef,
    setFocus,
    focusOnMount,
    announce,
    announcement,
    reducedMotion,
    reducedText,
    darkMode,
    generateId: generateUniqueId,
  }
}

/**
 * useAriaLabel Hook
 * Manages aria labels dynamically
 */
export const useAriaLabel = (baseLabel: string) => {
  const [ariaLabel, setAriaLabel] = useState(baseLabel)

  const updateAriaLabel = useCallback((label: string) => {
    setAriaLabel(label)
  }, [])

  return { ariaLabel, updateAriaLabel }
}

/**
 * useKeyboardNavigation Hook
 * Handle common keyboard interactions
 */
export const useKeyboardNavigation = (callbacks: Record<string, () => void>) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Enter':
          callbacks.onEnter?.()
          break
        case 'Escape':
          callbacks.onEscape?.()
          break
        case ' ':
          callbacks.onSpace?.()
          break
        case 'ArrowUp':
          callbacks.onArrowUp?.()
          break
        case 'ArrowDown':
          callbacks.onArrowDown?.()
          break
        case 'ArrowLeft':
          callbacks.onArrowLeft?.()
          break
        case 'ArrowRight':
          callbacks.onArrowRight?.()
          break
        default:
          break
      }
    },
    [callbacks]
  )

  return { handleKeyDown }
}

/**
 * useFocusVisible Hook
 * Shows focus indicator only for keyboard navigation
 */
export const useFocusVisible = () => {
  const [isFocusVisible, setIsFocusVisible] = useState(false)

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      setIsFocusVisible(true)
    }
  }, [])

  const handleMouseDown = useCallback(() => {
    setIsFocusVisible(false)
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousedown', handleMouseDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [handleKeyDown, handleMouseDown])

  return { isFocusVisible }
}

/**
 * useThemePreference Hook
 * Detect and respond to theme preferences
 */
export const useThemePreference = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (prefersDarkMode()) {
      return 'dark'
    }
    return 'light'
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return { theme }
}

/**
 * useMotionPreference Hook
 * Detect and respond to motion preferences
 */
export const useMotionPreference = () => {
  const [allowMotion, setAllowMotion] = useState(() => !prefersReducedMotion())

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      setAllowMotion(!e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return { allowMotion }
}
