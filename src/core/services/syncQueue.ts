/**
 * Sync Queue Service
 * Processes pending offline actions when the network comes back online.
 * Uses axiosInstance to replay saved requests in FIFO order.
 */

import axiosInstance from '../api/axiosInstance'
import {
  getAllPendingActions,
  updatePendingAction,
  removePendingAction,
  type PendingAction,
} from './offlineStorage'

export type SyncEvent =
  | { type: 'sync_start'; total: number }
  | { type: 'sync_progress'; completed: number; total: number; action: PendingAction }
  | { type: 'sync_done'; succeeded: number; failed: number }
  | { type: 'sync_error'; action: PendingAction; error: string }

type SyncListener = (event: SyncEvent) => void

let isSyncing = false
const listeners: Set<SyncListener> = new Set()

export function onSyncEvent(listener: SyncListener): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

function emit(event: SyncEvent) {
  listeners.forEach(fn => {
    try { fn(event) } catch { /* ignore listener errors */ }
  })
}

/**
 * Process all pending actions sequentially.
 * Returns { succeeded, failed } counts.
 */
export async function processSyncQueue(): Promise<{ succeeded: number; failed: number }> {
  if (isSyncing) return { succeeded: 0, failed: 0 }
  if (!navigator.onLine) return { succeeded: 0, failed: 0 }

  isSyncing = true
  let succeeded = 0
  let failed = 0

  try {
    const actions = await getAllPendingActions()
    const pending = actions.filter(a => a.status === 'pending' || a.status === 'failed')

    if (pending.length === 0) {
      isSyncing = false
      return { succeeded: 0, failed: 0 }
    }

    emit({ type: 'sync_start', total: pending.length })

    for (const action of pending) {
      if (!navigator.onLine) break // stop if we go offline mid-sync

      try {
        // Mark as syncing
        await updatePendingAction(action.id!, { status: 'syncing' })

        // Replay the original request
        await axiosInstance({
          method: action.method,
          url: action.endpoint,
          data: action.payload,
        })

        // Success — remove from queue
        await removePendingAction(action.id!)
        succeeded++

        emit({
          type: 'sync_progress',
          completed: succeeded + failed,
          total: pending.length,
          action,
        })
      } catch (err: any) {
        failed++
        const retries = (action.retries || 0) + 1

        if (retries >= 5) {
          // Too many retries — mark permanently failed
          await updatePendingAction(action.id!, { status: 'failed', retries })
        } else {
          // Will retry next sync cycle
          await updatePendingAction(action.id!, { status: 'pending', retries })
        }

        emit({
          type: 'sync_error',
          action,
          error: err?.message || 'Unknown error',
        })
      }
    }

    emit({ type: 'sync_done', succeeded, failed })
  } catch (err) {
    console.error('[SyncQueue] Fatal error during sync:', err)
  } finally {
    isSyncing = false
  }

  return { succeeded, failed }
}

export function isSyncInProgress(): boolean {
  return isSyncing
}

export const syncQueue = {
  processSyncQueue,
  isSyncInProgress,
  onSyncEvent,
}

export default syncQueue
