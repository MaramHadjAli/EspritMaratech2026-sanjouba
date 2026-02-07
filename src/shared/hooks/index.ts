/**
 * Custom Hooks Index
 * Export all custom hooks from one place
 */

export { useAuth, useIsAuthenticated, useCurrentUser, useIsAdmin, useIsEmployee } from './useAuth'
export { useTheme } from './useTheme'
export { useLanguage, useI18n } from './useLanguage'
export { useNotification, useToast } from './useNotification'
export { useDashboardStats, resetDashboardStatsCache } from './useDashboardStats'

// Accessibility hook for context
import { useContext } from 'react'
import { AccessibilityContext } from '@contexts/AccessibilityContext'
import type { AccessibilityContextType } from '@types'

export const useAccessibilitySettings = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibilitySettings must be used within AccessibilityProvider')
  }
  return context
}
