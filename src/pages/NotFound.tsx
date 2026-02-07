import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@components/Button'
import { Card } from '@components/Card'
import { useAuth } from '@hooks/useAuth'

const NotFound: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const suggestedLinks = isAuthenticated ? [
    { label: 'Home', path: '/home' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Visits', path: '/visits' },
    { label: 'Settings', path: '/settings' },
  ] : [
    { label: 'Home', path: '/' },
    { label: 'Login', path: '/login' },
    { label: 'Register', path: '/register' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex items-center justify-center px-4 py-12 min-h-screen">
        <Card bordered className="w-full max-w-md p-8">
          {/* 404 Icon */}
          <div className="text-center mb-8">
            <div className="text-7xl font-bold text-primary-500 dark:text-primary-400 mb-4">
              404
            </div>
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-primary-600 dark:text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            {t('errors.404') || 'Page Not Found'}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>

          {/* Quick Navigation */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {suggestedLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Actions */}
          <div className="space-y-3 mb-6">
            <Link to={isAuthenticated ? '/home' : '/'} className="block">
              <Button className="w-full">
                {t('common.back') || 'Go Home'}
              </Button>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              Go Back
            </button>
          </div>

          {/* Help Section */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Need help?{' '}
              <a
                href="mailto:support@omnia.org"
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                Contact support
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default NotFound
