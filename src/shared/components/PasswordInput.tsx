/**
 * PasswordInput Component
 * Password input with show/hide toggle button
 * Accessible and supports dark mode
 */

import React from 'react'
import clsx from 'clsx'

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showPassword?: boolean
  onToggleShowPassword?: () => void
  error?: string
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showPassword = false, onToggleShowPassword, error, className, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={clsx(
            'w-full px-4 py-2.5 border-2 rounded-lg transition-colors',
            'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
            'placeholder-gray-500 dark:placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
            'disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed',
            error
              ? 'border-red-500 dark:border-red-400 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:border-primary-500',
            className
          )}
          {...props}
        />
        {onToggleShowPassword && (
          <button
            type="button"
            onClick={onToggleShowPassword}
            className={clsx(
              'absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400',
              'hover:text-gray-900 dark:hover:text-gray-200',
              'focus:outline-2 focus:outline-offset-2 focus:outline-primary-500',
              'p-1 rounded transition-colors active:scale-95'
            )}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            aria-pressed={showPassword}
            title={showPassword ? 'Masquer' : 'Afficher'}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
