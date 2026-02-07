/**
 * DatePicker Component
 * Accessible date input field
 */

import React from 'react'
import clsx from 'clsx'
import { formatDate } from '@utils/formatters'

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  disabledDate?: (date: Date) => boolean
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, helperText, disabledDate, className, ...props }, ref) => {
    const dateInputId = props.id || `date-${Math.random().toString(36).substring(7)}`

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={dateInputId}
            className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
          >
            {label}
            {props.required && <span className="text-danger ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={dateInputId}
          type="date"
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
          aria-describedby={error ? `${dateInputId}-error` : helperText ? `${dateInputId}-helper` : undefined}
          {...props}
        />

        {error && (
          <p
            id={`${dateInputId}-error`}
            className="mt-1 text-sm text-danger font-medium"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${dateInputId}-helper`} className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'

export default DatePicker
