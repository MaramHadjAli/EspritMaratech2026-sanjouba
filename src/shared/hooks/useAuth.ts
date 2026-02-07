/**
 * useAuth Hook
 * Custom hook for accessing auth context and functions
 */

import { useAuthContext } from '@contexts/AuthContext'
import { AuthContextType } from '@types'

export const useAuth = (): AuthContextType => {
  return useAuthContext()
}

// Additional auth-related hooks
export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated
}

export const useCurrentUser = () => {
  const { user } = useAuth()
  return user
}

export const useIsAdmin = () => {
  const { user } = useAuth()
  return user?.role === 'ADMIN'
}

export const useIsEmployee = () => {
  const { user } = useAuth()
  return user?.role === 'EMPLOYEE' || user?.role === 'ADMIN'
}
