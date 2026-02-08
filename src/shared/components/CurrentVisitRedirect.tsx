/**
 * Current Visit Redirect Component
 * Automatically redirects employees to their current visit page on app load
 */

import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { userService } from '@services/user.service'

interface CurrentVisitRedirectProps {
  children: React.ReactNode
}

export const CurrentVisitRedirect: React.FC<CurrentVisitRedirectProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    const checkCurrentVisit = async () => {
      // Only check if user is authenticated and on the home page
      if (!isAuthenticated || !user) {
        return
      }

      // Skip redirect if user is already on a visit page
      if (location.pathname.includes('/visits')) {
        return
      }

      // Only employees should be redirected
      if (user.role !== 'EMPLOYEE') {
        return
      }

      try {
        const response = await userService.getCurrentVisit()
        const currentVisit = response.data ?? response

        if (currentVisit && currentVisit.id) {
          // Only redirect if user is on the home page or dashboard
          if (
            location.pathname === '/' ||
            location.pathname === '/home' ||
            location.pathname === '/dashboard'
          ) {
            navigate(`/visits/${currentVisit.id}`, { replace: true })
          }
        }
      } catch (err) {
        // No current visit or error fetching - just continue
        console.debug('No current visit found for employee')
      }
    }

    checkCurrentVisit()
  }, [isAuthenticated, user, navigate, location.pathname])

  return <>{children}</>
}

export default CurrentVisitRedirect
