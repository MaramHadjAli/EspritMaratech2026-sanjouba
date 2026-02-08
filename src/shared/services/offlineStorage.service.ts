export interface PendingAction {
  id: string
  type: string
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  data?: any
  retries: number
  createdAt: number
}

class OfflineStorage {
  private readonly STORAGE_KEY = 'pending_actions'

  async getPendingActions(): Promise<PendingAction[]> {
    const data = localStorage.getItem(this.STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }

  async addPendingAction(action: Omit<PendingAction, 'id' | 'retries' | 'createdAt'>): Promise<void> {
    console.log('📴 Offline: Adding pending action', action)
    const actions = await this.getPendingActions()
    actions.push({
      ...action,
      id: crypto.randomUUID(),
      retries: 0,
      createdAt: Date.now(),
    })
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(actions))
    console.log('📴 Offline: Total pending actions:', actions.length)
  }

  async removePendingAction(id: string): Promise<void> {
    const actions = await this.getPendingActions()
    const filtered = actions.filter((a) => a.id !== id)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered))
  }

  async updatePendingAction(action: PendingAction): Promise<void> {
    const actions = await this.getPendingActions()
    const index = actions.findIndex((a) => a.id === action.id)
    if (index !== -1) {
      actions[index] = action
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(actions))
    }
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY)
  }
}

export const offlineStorage = new OfflineStorage()