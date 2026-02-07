/**
 * FormField Component
 * Wrapper for labels, inputs, and error messages
 */

import React from 'react'
import clsx from 'clsx'

interface FormFieldProps {
  label: string
  error?: string
  helperText?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  required = false,
  children,
  className,
}) => {
  return (
    <div className={clsx('w-full flex flex-col gap-1.5', className)}>
      <label className="text-sm font-medium text-gray-900 dark:text-white">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>

      {children}

      {error && (
        <p className="text-xs text-danger font-medium" role="alert">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-xs text-gray-600 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  )
}

export default FormField
