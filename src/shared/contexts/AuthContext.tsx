import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { User, AuthContextType, SignupFormData } from '@types'
import { authService } from '@services/auth.service'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'))
  const [isLoading, setIsLoading] = useState(false)
  const [isRestoring, setIsRestoring] = useState(!!localStorage.getItem('authToken'))
  const isRestorationAttemptedRef = useRef(false)

  const normalizeUser = (rawUser: any): User | null => {
    if (!rawUser) return null
    const normalized = { ...rawUser }
    const derivedName =
      normalized.name ||
      normalized.fullName ||
      [normalized.firstName, normalized.lastName].filter(Boolean).join(' ') ||
      (normalized.email ? normalized.email.split('@')[0] : undefined)

    if (derivedName && !normalized.name) {
      normalized.name = derivedName
    }

    return normalized as User
  }

  useEffect(() => {
    // Restore auth state from localStorage
    const storedToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('authUser')
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        const normalizedUser = normalizeUser(parsedUser)
        if (normalizedUser) {
          setToken(storedToken)
          setUser(normalizedUser)
          localStorage.setItem('authUser', JSON.stringify(normalizedUser))
          console.log('🔐 [AuthContext] Restored from localStorage')
        }
      } catch (error) {
        console.error('❌ [AuthContext] Failed to parse stored user:', error)
        localStorage.removeItem('authUser')
      }
    }
  }, [])

  useEffect(() => {
    if (!token || user || isRestorationAttemptedRef.current) {
      setIsRestoring(false)
      return
    }

    const restoreUser = async () => {
      isRestorationAttemptedRef.current = true
      try {
        const response = await authService.getCurrentUser()
        const payload = response.data ?? response
        const resolvedUser = normalizeUser(payload)

        if (resolvedUser) {
          setUser(resolvedUser)
          localStorage.setItem('authUser', JSON.stringify(resolvedUser))
          console.log('🔐 [AuthContext] Restored user from API')
        }
      } catch (error) {
        console.error('❌ [AuthContext] Failed to restore user from API:', error)
        localStorage.removeItem('authToken')
        localStorage.removeItem('authUser')
        setToken(null)
        setUser(null)
      } finally {
        setIsRestoring(false)
      }
    }

    restoreUser()
  }, [token, user])

  // Log when user state changes
  useEffect(() => {
    console.log('🔐 [AuthContext] User state changed:', { 
      hasUser: !!user, 
      user,
      isAuthenticated: !!token && !!user 
    })
  }, [user, token])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    console.log('🔐 [AuthContext] Starting login...')
    try {
      const response = await authService.login(email, password)
      console.log('🔐 [AuthContext] Login response received:', { 
        hasToken: !!response.token, 
        hasUser: !!response.user
      })
      
      // Store token in localStorage first
      setToken(response.token)
      
      // Fetch full user data from getCurrentUser endpoint
      const userResponse = await authService.getCurrentUser()
      const fullUserData = (userResponse as any)?.data ?? userResponse
      const normalizedUser = normalizeUser(fullUserData)
      
      setUser(normalizedUser)
      if (normalizedUser) {
        localStorage.setItem('authUser', JSON.stringify(normalizedUser))
        console.log('🔐 [AuthContext] Stored full user data from getCurrentUser endpoint')
      }
      
      console.log('🔐 [AuthContext] State updated - isAuthenticated should be true now')
      return response
    } catch (error) {
      console.error('❌ [AuthContext] Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(async (data: SignupFormData) => {
    setIsLoading(true)
    try {
      const response = await authService.signup(data)
      
      // Store token in localStorage first
      setToken(response.token)
      
      // Fetch full user data from getCurrentUser endpoint
      const userResponse = await authService.getCurrentUser()
      const fullUserData = (userResponse as any)?.data ?? userResponse
      const normalizedUser = normalizeUser(fullUserData)
      
      setUser(normalizedUser)
      if (normalizedUser) {
        localStorage.setItem('authUser', JSON.stringify(normalizedUser))
        console.log('🔐 [AuthContext] Stored full user data from getCurrentUser endpoint')
      }
      return response
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    setToken(null)
    setUser(null)
  }, [])

  const refreshToken = useCallback(async () => {
    try {
      // TODO: Call API endpoint POST /auth/refresh
      // const response = await apiClient.post('/auth/refresh')
      // const { token } = response.data
      // setToken(token)
      // localStorage.setItem('authToken', token)
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
    }
  }, [logout])

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    isRestoring,
    login,
    signup,
    logout,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}