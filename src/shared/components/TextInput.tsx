/**
 * TextInput Component
 * Basic text input field with accessibility and dark mode support
 */

import React from 'react'
import clsx from 'clsx'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
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
    )
  }
)


TextInput.displayName = 'TextInput'

export default TextInput
