import React, { ReactNode } from 'react'
import { Button } from '@components/Button'
import { Card } from '@components/Card'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  errorId?: string
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Generate unique error ID for tracking
    const errorId = 'ERR_' + Date.now() + '_' + Math.random().toString(36).substring(7)
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error boundary caught:', error, errorInfo)
    }
    
    // Log to external error tracking service in production
    // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } })
    
    this.setState({
      errorInfo,
      errorId,
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, errorId: undefined })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8">
          <Card bordered className="w-full max-w-md p-8">
            {/* Error Icon */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              {/* Error Title */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Oops! Something went wrong
              </h1>

              {/* Error Message */}
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>

              {/* Error ID */}
              {this.state.errorId && (
                <p className="text-xs text-gray-500 dark:text-gray-500 font-mono mb-6 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  Error ID: {this.state.errorId}
                </p>
              )}
            </div>

            {/* Error Details (Dev Mode) */}
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Component Stack (Development Only):
                </p>
                <pre className="text-xs text-yellow-800 dark:text-yellow-200 overflow-auto max-h-32 font-mono whitespace-pre-wrap break-words">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}

            {/* Helpful Tips */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                What you can try:
              </p>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Refresh the page</li>
                <li>• Clear your browser cache</li>
                <li>• Check your internet connection</li>
                <li>• Try again in a few moments</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={this.handleReset}
                className="w-full"
              >
                Try Again
              </Button>
              <Button
                onClick={this.handleGoHome}
                variant="secondary"
                className="w-full"
              >
                Go Home
              </Button>
            </div>

            {/* Support Message */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Still having issues?{' '}
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
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
