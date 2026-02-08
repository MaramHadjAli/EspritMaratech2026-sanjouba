/**
 * Offline Storage Service
 * IndexedDB wrapper for storing pending actions and cached data
 * Uses a simple promise-based API over the IndexedDB async interface
 */

const DB_NAME = 'omnia_offline'
const DB_VERSION = 1

// Store names
const PENDING_ACTIONS_STORE = 'pendingActions'
const CACHED_DATA_STORE = 'cachedData'

export interface PendingAction {
  id?: number // auto-incremented
  type: 'CREATE_AID' | 'CREATE_FAMILY' | 'CREATE_VISIT' | 'UPDATE_AID' | 'UPDATE_VISIT' | 'UPDATE_FAMILY'
  endpoint: string
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  payload: any
  createdAt: string
  retries: number
  status: 'pending' | 'syncing' | 'failed'
  label: string // human-readable label like "Aide alimentaire - Famille Ben Ali"
}

export interface CachedData {
  key: string // e.g. "families_list", "aids_list"
  data: any
  cachedAt: string
  expiresAt: string
}

// ---------- DB Connection ----------

let dbInstance: IDBDatabase | null = null

function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance)

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Pending actions store (auto-increment key)
      if (!db.objectStoreNames.contains(PENDING_ACTIONS_STORE)) {
        const store = db.createObjectStore(PENDING_ACTIONS_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        })
        store.createIndex('status', 'status', { unique: false })
        store.createIndex('type', 'type', { unique: false })
        store.createIndex('createdAt', 'createdAt', { unique: false })
      }

      // Cached data store (key = manual string key)
      if (!db.objectStoreNames.contains(CACHED_DATA_STORE)) {
        db.createObjectStore(CACHED_DATA_STORE, { keyPath: 'key' })
      }
    }

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result
      resolve(dbInstance)
    }

    request.onerror = () => {
      console.error('[OfflineStorage] Failed to open IndexedDB')
      reject(request.error)
    }
  })
}

// ---------- Pending Actions ----------

/**
 * Generate a simple hash for deduplication
 */
function generatePayloadHash(payload: any): string {
  try {
    return btoa(JSON.stringify(payload)).slice(0, 50)
  } catch {
    return String(Date.now())
  }
}

/**
 * Check if a similar action was recently added (within DEDUP_WINDOW_MS)
 * to prevent double submissions from rapid clicks or network retries
 */
const DEDUP_WINDOW_MS = 5000 // 5 seconds

async function isDuplicateAction(action: Omit<PendingAction, 'id'>): Promise<boolean> {
  const existing = await getAllPendingActions()
  const now = Date.now()
  const payloadHash = generatePayloadHash(action.payload)

  return existing.some((a) => {
    const timeDiff = now - new Date(a.createdAt).getTime()
    const sameType = a.type === action.type
    const sameEndpoint = a.endpoint === action.endpoint
    const samePayload = generatePayloadHash(a.payload) === payloadHash
    
    return timeDiff < DEDUP_WINDOW_MS && sameType && sameEndpoint && samePayload
  })
}

export async function addPendingAction(action: Omit<PendingAction, 'id'>): Promise<number> {
  // Deduplication check - prevent rapid duplicate submissions
  const isDuplicate = await isDuplicateAction(action)
  if (isDuplicate) {
    console.log('[OfflineStorage] Duplicate action detected, skipping:', action.type)
    return -1 // Return -1 to indicate duplicate was skipped
  }

  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_ACTIONS_STORE, 'readwrite')
    const store = tx.objectStore(PENDING_ACTIONS_STORE)
    const request = store.add(action)
    request.onsuccess = () => {
      console.log('[OfflineStorage] Action queued:', action.type, action.label)
      resolve(request.result as number)
    }
    request.onerror = () => reject(request.error)
  })
}

export async function getAllPendingActions(): Promise<PendingAction[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_ACTIONS_STORE, 'readonly')
    const store = tx.objectStore(PENDING_ACTIONS_STORE)
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getPendingActionsByStatus(status: PendingAction['status']): Promise<PendingAction[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_ACTIONS_STORE, 'readonly')
    const store = tx.objectStore(PENDING_ACTIONS_STORE)
    const index = store.index('status')
    const request = index.getAll(status)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function updatePendingAction(id: number, updates: Partial<PendingAction>): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_ACTIONS_STORE, 'readwrite')
    const store = tx.objectStore(PENDING_ACTIONS_STORE)
    const getReq = store.get(id)
    getReq.onsuccess = () => {
      const existing = getReq.result
      if (!existing) { reject(new Error('Action not found')); return }
      const updated = { ...existing, ...updates }
      const putReq = store.put(updated)
      putReq.onsuccess = () => resolve()
      putReq.onerror = () => reject(putReq.error)
    }
    getReq.onerror = () => reject(getReq.error)
  })
}

export async function removePendingAction(id: number): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_ACTIONS_STORE, 'readwrite')
    const store = tx.objectStore(PENDING_ACTIONS_STORE)
    const request = store.delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function clearAllPendingActions(): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_ACTIONS_STORE, 'readwrite')
    const store = tx.objectStore(PENDING_ACTIONS_STORE)
    const request = store.clear()
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function getPendingCount(): Promise<number> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_ACTIONS_STORE, 'readonly')
    const store = tx.objectStore(PENDING_ACTIONS_STORE)
    const request = store.count()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// ---------- Cached Data (for reading lists offline) ----------

export async function setCachedData(key: string, data: any, ttlMinutes = 60): Promise<void> {
  const db = await openDB()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + ttlMinutes * 60 * 1000)

  return new Promise((resolve, reject) => {
    const tx = db.transaction(CACHED_DATA_STORE, 'readwrite')
    const store = tx.objectStore(CACHED_DATA_STORE)
    const request = store.put({
      key,
      data,
      cachedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    })
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function getCachedData<T = any>(key: string): Promise<T | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CACHED_DATA_STORE, 'readonly')
    const store = tx.objectStore(CACHED_DATA_STORE)
    const request = store.get(key)
    request.onsuccess = () => {
      const result = request.result as CachedData | undefined
      if (!result) { resolve(null); return }

      // Check expiry
      if (new Date(result.expiresAt) < new Date()) {
        // Expired — but still return it if we're offline (better than nothing)
        if (!navigator.onLine) {
          resolve(result.data)
        } else {
          resolve(null)
        }
        return
      }

      resolve(result.data)
    }
    request.onerror = () => reject(request.error)
  })
}

export async function removeCachedData(key: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CACHED_DATA_STORE, 'readwrite')
    const store = tx.objectStore(CACHED_DATA_STORE)
    const request = store.delete(key)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// ---------- Export all as a namespace ----------

export const offlineStorage = {
  addPendingAction,
  getAllPendingActions,
  getPendingActionsByStatus,
  updatePendingAction,
  removePendingAction,
  clearAllPendingActions,
  getPendingCount,
  setCachedData,
  getCachedData,
  removeCachedData,
}

export default offlineStorage
