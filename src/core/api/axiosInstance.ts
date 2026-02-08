/**
 * Axios Instance
 * Configured HTTP client for API calls with interceptors
 */

import axios, { AxiosRequestConfig } from 'axios'

// Use the browser's current hostname so it works on both localhost and phone (via LAN IP)
const API_BASE_URL = `http://${window.location.hostname}:3000`

type RetriableAxiosConfig = AxiosRequestConfig & {
  _retry?: boolean
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Dedicated client to refresh tokens without triggering interceptors again
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const redirectToLogin = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('authUser')
  window.location.href = '/login'
}

const refreshAccessToken = async (): Promise<string | null> => {
  const storedRefreshToken = localStorage.getItem('refreshToken')
  if (!storedRefreshToken) {
    return null
  }

  try {
    const response = await refreshClient.post('/auth/refresh', {
      refreshToken: storedRefreshToken,
    })

    const { token, refreshToken } = response.data.data || response.data
    if (!token) {
      return null
    }

    localStorage.setItem('authToken', token)
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }

    return token
  } catch (error) {
    return null
  }
}

// Endpoints that should not include the authorization token
const noAuthEndpoints = ['auth/login', 'auth/refresh', 'auth/register']

const isNoAuthEndpoint = (url: string): boolean => {
  if (!url) return false
  // Normalize URL by removing leading slash and query params
  const cleanUrl = url.split('?')[0].replace(/^\/+/, '').toLowerCase()
  return noAuthEndpoints.some(endpoint => 
    cleanUrl === endpoint.toLowerCase() || cleanUrl.startsWith(endpoint.toLowerCase() + '/')
  )
}

// Add request interceptor to attach token
axiosInstance.interceptors.request.use(
  config => {
    if (!isNoAuthEndpoint(config.url || '')) {
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  error => Promise.reject(error)
)

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config as RetriableAxiosConfig | undefined
    const status = error.response?.status
    const url = originalRequest?.url || ''

    // Don't handle 401s for auth endpoints themselves
    if (isNoAuthEndpoint(url)) {
      return Promise.reject(error)
    }

    // Handle 401 for protected endpoints - try to refresh token
    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true

      const newToken = await refreshAccessToken()
      if (newToken) {
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        }
        return axiosInstance(originalRequest)
      } else {
        redirectToLogin()
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
