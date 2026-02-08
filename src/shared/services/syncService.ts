/**
 * Sync Service
 * Re-exports the main sync functionality for backward compatibility.
 * The actual sync logic is in @core/services/syncQueue
 */

import { syncQueue, type SyncEvent } from '@core/services/syncQueue'
import { offlineStorage, type PendingAction } from '@core/services/offlineStorage'

export interface SyncResult {
  total: number
  synced: number
  failed: number
  errors: string[]
}

/**
 * SyncService wrapper for compatibility
 * Delegates to the core syncQueue service
 */
class SyncService {
  private listeners: Array<(result: SyncResult) => void> = []

  onSyncComplete(listener: (result: SyncResult) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners(result: SyncResult) {
    this.listeners.forEach((l) => l(result))
  }

  async syncAll(): Promise<SyncResult> {
    console.log('🔄 Sync: Starting sync process...')
    
    if (syncQueue.isSyncInProgress()) {
      console.log('🔄 Sync: Already in progress, skipping')
      return { total: 0, synced: 0, failed: 0, errors: ['Sync already in progress'] }
    }

    if (!navigator.onLine) {
      console.log('🔄 Sync: Still offline, skipping')
      return { total: 0, synced: 0, failed: 0, errors: ['Still offline'] }
    }

    try {
      const pendingActions = await offlineStorage.getAllPendingActions()
      console.log('🔄 Sync: Found pending actions:', pendingActions.length)
      
      const { succeeded, failed } = await syncQueue.processSyncQueue()
      
      const result: SyncResult = {
        total: pendingActions.length,
        synced: succeeded,
        failed,
        errors: [],
      }
      
      this.notifyListeners(result)
      return result
    } catch (error) {
      console.error('Sync error:', error)
      return { total: 0, synced: 0, failed: 0, errors: ['Sync failed'] }
    }
  }
}

export const syncService = new SyncService()

// Re-export for convenience
export { offlineStorage, syncQueue }
export type { PendingAction, SyncEvent }