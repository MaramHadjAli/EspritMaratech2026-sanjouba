/**
 * useNotification Hook
 * Custom hook for accessing notification/toast functionality
 */

import { useContext } from 'react'
import { NotificationContext } from '@contexts/NotificationContext'
import { NotificationContextType, NotificationType } from '@types'

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }

  return context
}

/**
 * Hook with convenience methods for specific toast types
 */
export const useToast = () => {
  const { addNotification } = useNotification()

  return {
    success: (message: string, duration?: number) => {
      addNotification({ message, type: 'success' as NotificationType, duration })
    },
    error: (message: string, duration?: number) => {
      addNotification({ message, type: 'error' as NotificationType, duration })
    },
    info: (message: string, duration?: number) => {
      addNotification({ message, type: 'info' as NotificationType, duration })
    },
    warning: (message: string, duration?: number) => {
      addNotification({ message, type: 'warning' as NotificationType, duration })
    },
  }
}
