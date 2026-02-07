/**
 * AccessibleFormField Component
 * WCAG AA compliant form field with proper labeling and error handling
 */

import React, { forwardRef } from 'react'
import { useAccessibility } from '@hooks/useAccessibility'

interface AccessibleFormFieldProps {
  id?: string
  label: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  children: React.ReactElement
  className?: string
}

export const AccessibleFormField = forwardRef<HTMLDivElement, AccessibleFormFieldProps>(
  (
    {
      id,
      label,
      error,
      hint,
      required = false,
      disabled = false,
      children,
      className,
    },
    ref
  ) => {
    const { generateId } = useAccessibility()
    const fieldId = id || generateId('field')
    const errorId = generateId('error')
    const hintId = hint ? generateId('hint') : undefined

    const describedBy = [error && errorId, hintId].filter(Boolean).join(' ')

    return (
      <div ref={ref} className={`mb-6 ${className}`}>
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
        >
          {label}
          {required && (
            <span
              className="text-red-600 dark:text-red-400 ml-1"
              aria-label="required"
            >
              *
            </span>
          )}
        </label>

        {hint && (
          <p id={hintId} className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            {hint}
          </p>
        )}

        {React.cloneElement(children, {
          id: fieldId,
          disabled,
          'aria-invalid': !!error,
          'aria-describedby': describedBy || undefined,
          'aria-required': required,
        })}

        {error && (
          <p id={errorId} className="text-sm text-red-600 dark:text-red-400 mt-2" role="alert">
            <span className="sr-only">Error: </span>
            {error}
          </p>
        )}
      </div>
    )
  }
)

AccessibleFormField.displayName = 'AccessibleFormField'
