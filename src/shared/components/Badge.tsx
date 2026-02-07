/**
 * Badge Component
 * Displays status, labels, or counts
 */

import React from 'react'
import clsx from 'clsx'

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray'
type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  icon?: React.ReactNode
  children: React.ReactNode
  dot?: boolean
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
  success: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
  warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200',
  danger: 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200',
  info: 'bg-info-100 text-info-800 dark:bg-info-900 dark:text-info-200',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
}

const SIZE_STYLES: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs font-medium',
  md: 'px-3 py-1 text-sm font-medium',
  lg: 'px-4 py-2 text-base font-medium',
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  dot = false,
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full font-medium transition-colors',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className
      )}
      {...props}
    >
      {dot && <span className="w-2 h-2 rounded-full bg-current" />}
      {icon}
      {children}
    </span>
  )
}

export default Badge
