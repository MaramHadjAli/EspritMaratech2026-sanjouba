import axiosInstance from '@core/api/axiosInstance'
import { offlineStorage } from '@services/offlineStorage'

// Add response interceptor to cache GET responses:
axiosInstance.interceptors.response.use(
  async (response: any) => {
    // Cache successful GET responses for offline use
    if (response.config.method === 'get' && response.config.url) {
      try {
        await offlineStorage.setCachedData(
          `api:${response.config.url}`,
          response.data,
          30 // 30 min cache
        )
      } catch {
        // Silently fail caching
      }
    }
    return response
  },
  async (error: any) => {
    // If offline and GET request, try to serve from cache
    if (
      !navigator.onLine &&
      error.config?.method === 'get' &&
      error.config?.url
    ) {
      try {
        const cached = await offlineStorage.getCachedData(`api:${error.config.url}`)
        if (cached) {
          return { data: cached, status: 200, statusText: 'OK (cached)', config: error.config, headers: {} }
        }
      } catch {
        // No cache available
      }
    }

    // ...existing error handling code...
    return Promise.reject(error)
  }
)