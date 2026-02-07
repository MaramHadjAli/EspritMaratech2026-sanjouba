import React from 'react'
import { useNotification } from '@hooks/useNotification'
import { Notification } from '@types'
import clsx from 'clsx'

const Toast: React.FC = () => {
  const { notifications } = useNotification()

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {notifications.map((notification) => (
        <ToastItem key={notification.id} notification={notification} />
      ))}
    </div>
  )
}

const ToastItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const { removeNotification } = useNotification()

  const bgColor: Record<string, string> = {
    success: 'bg-success',
    error: 'bg-danger',
    warning: 'bg-warning',
    info: 'bg-info',
  }

  const icon: Record<string, React.ReactNode> = {
    success: <CheckIcon className="w-5 h-5" />,
    error: <XIcon className="w-5 h-5" />,
    warning: <AlertIcon className="w-5 h-5" />,
    info: <InfoIcon className="w-5 h-5" />,
  }

  return (
    <div
      className={clsx(
        'flex items-center gap-3 px-4 py-3 rounded-lg text-white shadow-lg',
        'animate-slide-up',
        bgColor[notification.type] || 'bg-info'
      )}
    >
      {icon[notification.type] || icon.info}
      <div className="flex-1">
        <p className="font-medium">{notification.message}</p>
      </div>
      {notification.action && (
        <button
          onClick={() => {
            notification.action?.callback()
            removeNotification(notification.id)
          }}
          className="font-medium underline hover:opacity-80 transition-opacity"
        >
          {notification.action.label}
        </button>
      )}
      <button
        onClick={() => removeNotification(notification.id)}
        aria-label="Close notification"
        className="hover:opacity-80 transition-opacity"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

// Icons
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const AlertIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

export default Toast
