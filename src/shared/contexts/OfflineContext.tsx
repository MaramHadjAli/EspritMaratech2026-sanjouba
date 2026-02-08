/**
 * Offline Context
 * Provides network status, pending action count, and sync triggers across the app.
 * Listens to browser online/offline events and auto-syncs when connection returns.
 */

import React, { createContext, useState, useEffect, useCallback, useRef } from 'react'
import { offlineStorage, type PendingAction } from '@services/offlineStorage'
import { syncQueue, type SyncEvent } from '@services/syncQueue'

export interface OfflineContextValue {
  /** true = no network */
  isOffline: boolean
  /** Number of actions waiting to be synced */
  pendingCount: number
  /** true while sync is running */
  isSyncing: boolean
  /** Last sync event for UI feedback */
  lastSyncEvent: SyncEvent | null
  /** Manually trigger sync */
  triggerSync: () => Promise<void>
  /** Queue an action to be synced later */
  queueAction: (action: Omit<PendingAction, 'id'>) => Promise<number>
  /** Refresh the pending count */
  refreshPendingCount: () => Promise<void>
}

export const OfflineContext = createContext<OfflineContextValue>({
  isOffline: !navigator.onLine,
  pendingCount: 0,
  isSyncing: false,
  lastSyncEvent: null,
  triggerSync: async () => {},
  queueAction: async () => 0,
  refreshPendingCount: async () => {},
})

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [pendingCount, setPendingCount] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncEvent, setLastSyncEvent] = useState<SyncEvent | null>(null)
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Refresh pending count from IndexedDB
  const refreshPendingCount = useCallback(async () => {
    try {
      const count = await offlineStorage.getPendingCount()
      setPendingCount(count)
    } catch {
      // IndexedDB might not be available
    }
  }, [])

  // Queue an action
  const queueAction = useCallback(async (action: Omit<PendingAction, 'id'>): Promise<number> => {
    const id = await offlineStorage.addPendingAction(action)
    await refreshPendingCount()
    return id
  }, [refreshPendingCount])

  // Trigger sync
  const triggerSync = useCallback(async () => {
    if (isOffline) return
    setIsSyncing(true)
    try {
      await syncQueue.processSyncQueue()
    } finally {
      setIsSyncing(false)
      await refreshPendingCount()
    }
  }, [isOffline, refreshPendingCount])

  // Listen for browser online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      // Auto-sync after a short delay when coming back online
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current)
      syncTimeoutRef.current = setTimeout(() => {
        triggerSync()
      }, 1500) // wait 1.5s to let connection stabilize
    }

    const handleOffline = () => {
      setIsOffline(true)
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
        syncTimeoutRef.current = null
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current)
    }
  }, [triggerSync])

  // Listen for sync events from the queue
  useEffect(() => {
    const unsubscribe = syncQueue.onSyncEvent((event) => {
      setLastSyncEvent(event)

      if (event.type === 'sync_start') {
        setIsSyncing(true)
      }

      if (event.type === 'sync_done') {
        setIsSyncing(false)
        refreshPendingCount()
        // Auto-clear the event after 5 seconds
        setTimeout(() => setLastSyncEvent(null), 5000)
      }

      if (event.type === 'sync_progress') {
        refreshPendingCount()
      }
    })

    return unsubscribe
  }, [refreshPendingCount])

  // Load initial pending count
  useEffect(() => {
    refreshPendingCount()
  }, [refreshPendingCount])

  const value: OfflineContextValue = {
    isOffline,
    pendingCount,
    isSyncing,
    lastSyncEvent,
    triggerSync,
    queueAction,
    refreshPendingCount,
  }

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  )
}

export default OfflineProvider
