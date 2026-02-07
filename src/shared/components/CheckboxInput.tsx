/**
 * CheckboxInput Component
 * Custom styled checkbox with accessibility and dark mode support
 */

import React from 'react'
import clsx from 'clsx'

interface CheckboxInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const CheckboxInput = React.forwardRef<HTMLInputElement, CheckboxInputProps>(
  ({ label, id, ...props }, ref) => {
    return (
      <div className="flex items-center gap-3">
        <input
          ref={ref}
          type="checkbox"
          id={id}
          className={clsx(
            'w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600',
            'accent-primary-500 dark:accent-primary-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
            'cursor-pointer transition-colors',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={id}
            className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none hover:text-gray-900 dark:hover:text-gray-100"
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

CheckboxInput.displayName = 'CheckboxInput'
