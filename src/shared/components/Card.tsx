/**
 * Card Component
 * Generic container for content with styling
 */

import React from 'react'
import clsx from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean
  hoverable?: boolean
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
  bordered = true,
  hoverable = false,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'rounded-lg bg-white dark:bg-gray-800 p-4',
        bordered && 'border border-gray-200 dark:border-gray-700',
        hoverable && 'hover:shadow-md transition-shadow cursor-pointer',
        'shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
