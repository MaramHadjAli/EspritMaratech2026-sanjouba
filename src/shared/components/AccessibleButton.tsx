/**
 * AccessibleButton Component
 * WCAG AA compliant button with proper keyboard support and ARIA labels
 */

import React, { forwardRef } from 'react'
import { useFocusVisible } from '@hooks/useAccessibility'

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  ariaLabel?: string
  ariaDescription?: string
  ariaPressed?: boolean
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

const variantClasses = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white',
  secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white',
}

const sizeClasses = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      ariaLabel,
      ariaDescription,
      ariaPressed,
      disabled = false,
      loading = false,
      icon,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isFocusVisible } = useFocusVisible()

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        aria-description={ariaDescription}
        aria-pressed={ariaPressed}
        aria-disabled={disabled}
        aria-busy={loading}
        className={`
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          rounded-lg
          font-medium
          transition-colors
          duration-200
          inline-flex
          items-center
          gap-2
          disabled:opacity-50
          disabled:cursor-not-allowed
          ${isFocusVisible ? 'ring-2 ring-primary-500 ring-offset-2' : 'focus:outline-none'}
          ${className}
        `}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Loading"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {icon && !loading && icon}
        {children}
      </button>
    )
  }
)

AccessibleButton.displayName = 'AccessibleButton'
