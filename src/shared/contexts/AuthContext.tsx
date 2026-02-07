import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { User, AuthContextType, SignupFormData } from '@types'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'))
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Restore auth state from localStorage
    const storedToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('authUser')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // TODO: Call API endpoint POST /auth/login
      // const response = await apiClient.post('/auth/login', { email, password })
      // const { token, user } = response.data
      
      // Placeholder for testing
      const mockUser: User = {
        id: '1',
        email,
        fullName: 'Test User',
        phoneNumber: '+216 XX XXX XXX',
        role: 'USER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const mockToken = 'mock-jwt-token-' + Date.now()

      localStorage.setItem('authToken', mockToken)
      localStorage.setItem('authUser', JSON.stringify(mockUser))
      setToken(mockToken)
      setUser(mockUser)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(async (data: SignupFormData) => {
    setIsLoading(true)
    try {
      // TODO: Call API endpoint POST /auth/signup
      // const response = await apiClient.post('/auth/signup', data)
      // const { token, user } = response.data
      
      const mockUser: User = {
        id: '1',
        email: data.email,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        role: 'USER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const mockToken = 'mock-jwt-token-' + Date.now()

      localStorage.setItem('authToken', mockToken)
      localStorage.setItem('authUser', JSON.stringify(mockUser))
      setToken(mockToken)
      setUser(mockUser)
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
    login,
    signup,
    logout,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
