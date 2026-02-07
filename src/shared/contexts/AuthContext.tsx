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

  useEffect(() => {
    // Restore auth state from localStorage
    const storedToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('authUser')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      console.log('🔐 [AuthContext] Restored from localStorage')
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
        const resolvedUser = (payload as any)?.user ?? payload

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
        hasUser: !!response.user,
        user: response.user 
      })
      
      setToken(response.token)
      setUser(response.user)
      
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
      setToken(response.token)
      setUser(response.user)
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