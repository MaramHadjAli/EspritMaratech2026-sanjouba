/**
 * Spinner / Loader Component
 * Loading indicator with animation
 */

import React from 'react'
import clsx from 'clsx'

type SpinnerSize = 'sm' | 'md' | 'lg'
type SpinnerColor = 'primary' | 'white' | 'gray'

interface SpinnerProps {
  size?: SpinnerSize
  color?: SpinnerColor
  label?: string
}

const SIZE_STYLES: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

const COLOR_STYLES: Record<SpinnerColor, string> = {
  primary: 'border-primary-500',
  white: 'border-white',
  gray: 'border-gray-400',
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  label = 'Loading...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={clsx(
          'animate-spin rounded-full border-2 border-transparent',
          SIZE_STYLES[size],
          `border-r-${COLOR_STYLES[color]}`
        )}
        role="status"
        aria-label={label}
      >
        <span className="sr-only">{label}</span>
      </div>
      {label && <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>}
    </div>
  )
}

export default Spinner
