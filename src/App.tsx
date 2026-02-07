import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@contexts/AuthContext'
import { ThemeProvider } from '@contexts/ThemeContext'
import { LanguageProvider } from '@contexts/LanguageContext'
import { NotificationProvider } from '@contexts/NotificationContext'
import { AccessibilityProvider } from '@contexts/AccessibilityContext'
import { useAuth } from '@hooks/useAuth'
import LoginPage from '@features/auth/LoginPage'
import RegisterPage from '@features/auth/RegisterPage'
import AddEmployeePage from '@features/auth/AddEmployeePage'
import LandingPage from '@features/landing/LandingPage'
import HomePage from '@features/home/HomePage'
import DashboardPage from '@features/dashboard/DashboardPage'
import VisitsPage from '@features/visits/VisitsPage'
import VisitDetailPage from '@features/visits/VisitDetailPage'
import CreateEditVisitPage from '@features/visits/CreateEditVisitPage'
import FamiliesPage from '@features/families/FamiliesPage'
import FamilyDetailPage from '@features/families/FamilyDetailPage'
import CreateEditFamilyPage from '@features/families/CreateEditFamilyPage'
import AidPage from '@features/aid/AidPage'
import AidDetailPage from '@features/aid/AidDetailPage'
import CreateEditAidPage from '@features/aid/CreateEditAidPage'
import SettingsPage from '@features/settings/SettingsPage'
import HistoryPage from '@features/history/HistoryPage'
import { ProfileEditPage } from '@features/profile/ProfileEditPage'
import { ChangePasswordPage } from '@features/profile/ChangePasswordPage'
import NotFound from './pages/NotFound'
import ErrorBoundary from './pages/ErrorBoundary'
import Toast from '@components/Toast'
import Layout from './core/layout/Layout'

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// Protected admin-only route wrapper
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/home" replace />
  }
  
  return <>{children}</>
}

const AppRoutes = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {isAuthenticated ? (
        // Authenticated routes - wrapped in Layout
        <Route element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/profile/change-password" element={<ChangePasswordPage />} />
          
          {/* Admin routes */}
          <Route path="/employees/add" element={<ProtectedAdminRoute><AddEmployeePage /></ProtectedAdminRoute>} />
          
          {/* Visits routes */}
          <Route path="/visits" element={<VisitsPage />} />
          <Route path="/visits/create" element={<CreateEditVisitPage />} />
          <Route path="/visits/:id" element={<VisitDetailPage />} />
          <Route path="/visits/:id/edit" element={<CreateEditVisitPage />} />
          
          {/* Families routes */}
          <Route path="/families" element={<FamiliesPage />} />
          <Route path="/families/add" element={<CreateEditFamilyPage />} />
          <Route path="/families/:id" element={<FamilyDetailPage />} />
          <Route path="/families/:id/edit" element={<CreateEditFamilyPage />} />
          
          {/* Aid routes */}
          <Route path="/aid" element={<AidPage />} />
          <Route path="/aid/add" element={<CreateEditAidPage />} />
          <Route path="/aid/:id" element={<AidDetailPage />} />
          <Route path="/aid/:id/edit" element={<CreateEditAidPage />} />
          
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      ) : (
        // Public routes
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<NotFound />} />
        </>
      )}
    </Routes>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AccessibilityProvider>
            <AuthProvider>
              <NotificationProvider>
                <Router>
                  <AppRoutes />
                  <Toast />
                </Router>
              </NotificationProvider>
            </AuthProvider>
          </AccessibilityProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
