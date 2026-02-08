/**
 * OfflineBanner Component
 * Sticky banner that appears when the app is offline.
 * Also shows sync progress and success notifications.
 */

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useOffline } from '@hooks/useOffline'

// Icons
const WifiOffIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M16.72 11.06A10.94 10.94 0 0119 12.55" />
    <path d="M5 12.55a10.94 10.94 0 015.17-2.39" />
    <path d="M10.71 5.05A16 16 0 0122.56 9" />
    <path d="M1.42 9a15.91 15.91 0 014.7-2.88" />
    <path d="M8.53 16.11a6 6 0 016.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
)

const WifiOnIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0114.08 0" />
    <path d="M1.42 9a16 16 0 0121.16 0" />
    <path d="M8.53 16.11a6 6 0 016.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
)

const SyncIcon = ({ spinning }: { spinning?: boolean }) => (
  <svg className={`w-5 h-5 flex-shrink-0 ${spinning ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const OfflineBanner: React.FC = () => {
  const { t } = useTranslation()
  const { isOffline, pendingCount, isSyncing, lastSyncEvent } = useOffline()
  const [showSuccess, setShowSuccess] = useState(false)
  const [syncResult, setSyncResult] = useState<{ succeeded: number; failed: number } | null>(null)

  // Show success banner briefly after sync completes
  useEffect(() => {
    if (lastSyncEvent?.type === 'sync_done') {
      const { succeeded, failed } = lastSyncEvent
      if (succeeded > 0) {
        setSyncResult({ succeeded, failed })
        setShowSuccess(true)
        const timer = setTimeout(() => {
          setShowSuccess(false)
          setSyncResult(null)
        }, 4000)
        return () => clearTimeout(timer)
      }
    }
  }, [lastSyncEvent])

  // Nothing to show
  if (!isOffline && !isSyncing && !showSuccess && pendingCount === 0) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none">
      <div className="max-w-lg mx-auto px-4 pb-4 space-y-2">

        {/* ── Offline Banner ── */}
        {isOffline && (
          <div
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border
              bg-amber-50 dark:bg-amber-900/90 border-amber-200 dark:border-amber-700
              text-amber-800 dark:text-amber-200 backdrop-blur-md
              animate-slide-up"
            role="alert"
            aria-live="assertive"
          >
            <WifiOffIcon />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{t('offline.noConnection')}</p>
              <p className="text-xs opacity-80">{t('offline.workOffline')}</p>
            </div>
            {pendingCount > 0 && (
              <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-200 dark:bg-amber-800 text-xs font-bold">
                {pendingCount}
              </span>
            )}
          </div>
        )}

        {/* ── Pending actions badge (when online but have unsent data) ── */}
        {!isOffline && !isSyncing && !showSuccess && pendingCount > 0 && (
          <div className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border
            bg-blue-50 dark:bg-blue-900/90 border-blue-200 dark:border-blue-700
            text-blue-800 dark:text-blue-200 backdrop-blur-md
            animate-slide-up"
          >
            <SyncIcon />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">
                {t('offline.pendingSync', { count: pendingCount })}
              </p>
            </div>
          </div>
        )}

        {/* ── Syncing Banner ── */}
        {isSyncing && (
          <div className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border
            bg-blue-50 dark:bg-blue-900/90 border-blue-200 dark:border-blue-700
            text-blue-800 dark:text-blue-200 backdrop-blur-md
            animate-slide-up"
          >
            <SyncIcon spinning />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{t('offline.syncing')}</p>
              {lastSyncEvent?.type === 'sync_progress' && (
                <div className="mt-1.5 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-500"
                    style={{ width: `${(lastSyncEvent.completed / lastSyncEvent.total) * 100}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Success Banner ── */}
        {showSuccess && syncResult && (
          <div className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border
            bg-emerald-50 dark:bg-emerald-900/90 border-emerald-200 dark:border-emerald-700
            text-emerald-800 dark:text-emerald-200 backdrop-blur-md
            animate-slide-up"
          >
            <CheckIcon />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">
                {t('offline.syncSuccess', { count: syncResult.succeeded })}
              </p>
              {syncResult.failed > 0 && (
                <p className="text-xs opacity-80">
                  {t('offline.syncFailed', { count: syncResult.failed })}
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default OfflineBanner
