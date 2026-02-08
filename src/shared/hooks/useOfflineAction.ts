/**
 * Hook to execute an API action or queue it offline
 */

import { useCallback } from 'react'
import { useOffline } from '@hooks/useOffline'
import { offlineStorage } from '@services/offlineStorage'
import { useNotification } from '@hooks/useNotification'
import { useTranslation } from 'react-i18next'
import axiosInstance from '@core/api/axiosInstance'

type ActionType = 'CREATE_AID' | 'CREATE_VISIT' | 'CREATE_FAMILY' | 'UPDATE_FAMILY' | 'UPDATE_VISIT'

interface UseOfflineActionOptions {
  type: ActionType
  endpoint: string
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
}

export function useOfflineAction<T = any>({ type, endpoint, method = 'POST' }: UseOfflineActionOptions) {
  const { isOffline, refreshPendingCount } = useOffline()
  const { addNotification } = useNotification()
  const { t } = useTranslation()

  const execute = useCallback(
    async (data: any): Promise<{ success: boolean; data?: T; offline?: boolean }> => {
      const offlineMsg = t('offline.savedLocally') !== 'offline.savedLocally'
        ? t('offline.savedLocally')
        : 'Saved locally — will sync when online'

      if (!isOffline) {
        // Try online first
        try {
          const response = await axiosInstance.request({
            url: endpoint,
            method,
            data,
          })
          return { success: true, data: response.data }
        } catch (error: any) {
          // If network error (not 4xx), queue offline
          if (!error.response) {
            await offlineStorage.addPendingAction({ type, endpoint, method, payload: data, createdAt: new Date().toISOString(), retries: 0, status: 'pending', label: `${type}` })
            await refreshPendingCount()
            addNotification({ message: offlineMsg, type: 'warning' })
            return { success: true, offline: true }
          }
          throw error
        }
      } else {
        // Offline — queue the action
        await offlineStorage.addPendingAction({ type, endpoint, method, payload: data, createdAt: new Date().toISOString(), retries: 0, status: 'pending', label: `${type}` })
        await refreshPendingCount()
        addNotification({ message: offlineMsg, type: 'warning' })
        return { success: true, offline: true }
      }
    },
    [isOffline, endpoint, method, type, refreshPendingCount, addNotification, t]
  )

  return { execute, isOffline }
}