/**
 * Avatar Component
 * Displays user profile pictures or initials fallback
 */

import React from 'react'
import clsx from 'clsx'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type AvatarShape = 'circle' | 'square'

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string
  initials?: string
  size?: AvatarSize
  shape?: AvatarShape
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info'
  online?: boolean
}

const SIZE_STYLES: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
}

const VARIANT_STYLES = {
  primary: 'bg-primary-500 text-white',
  secondary: 'bg-secondary-500 text-white',
  danger: 'bg-danger text-white',
  success: 'bg-success text-white',
  warning: 'bg-warning text-white',
  info: 'bg-info text-white',
}

const STATUS_SIZE: Record<AvatarSize, string> = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  initials,
  size = 'md',
  shape = 'circle',
  variant = 'primary',
  online,
  className,
  alt = 'Avatar',
  ...props
}) => {
  const sizeClass = SIZE_STYLES[size]
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-md'

  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={alt}
          className={clsx(sizeClass, shapeClass, 'object-cover', className)}
          {...props}
        />
      ) : (
        <div
          className={clsx(
            sizeClass,
            shapeClass,
            'flex items-center justify-center font-bold',
            VARIANT_STYLES[variant],
            className
          )}
        >
          {initials || '?'}
        </div>
      )}

      {online !== undefined && (
        <div
          className={clsx(
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            STATUS_SIZE[size],
            online ? 'bg-success' : 'bg-gray-400'
          )}
          aria-label={online ? 'Online' : 'Offline'}
        />
      )}
    </div>
  )
}

export default Avatar
