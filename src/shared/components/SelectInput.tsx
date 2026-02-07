/**
 * SelectInput Component
 * Dropdown select field with accessible options
 */

import React from 'react'
import clsx from 'clsx'

interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

export const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            {label}
          </label>
        )}

        <select
          ref={ref}
          className={clsx(
            'w-full px-3 py-2.5 rounded-lg border transition-colors',
            'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
            'border-gray-300 dark:border-gray-600',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            error && 'border-danger focus:ring-danger',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <p
            id={`${props.id}-error`}
            className="mt-1 text-sm text-danger font-medium"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

SelectInput.displayName = 'SelectInput'

export default SelectInput
