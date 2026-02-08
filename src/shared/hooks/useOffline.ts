/**
 * useOffline Hook
 * Convenient accessor for Offline context values
 */

import { useContext } from 'react'
import { OfflineContext, type OfflineContextValue } from '@contexts/OfflineContext'

export function useOffline(): OfflineContextValue {
  const ctx = useContext(OfflineContext)
  if (!ctx) {
    throw new Error('useOffline must be used within an OfflineProvider')
  }
  return ctx
}

export default useOffline
