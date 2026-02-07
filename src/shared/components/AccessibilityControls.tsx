/**
 * AccessibilityControls Component
 * Provides UI controls for accessibility settings (contrast, text size, TTS)
 */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccessibilitySettings } from '@hooks'

const AccessibilityControls: React.FC = () => {
  const { t } = useTranslation()
  const {
    isHighContrastMode,
    toggleHighContrast,
    fontSize,
    setFontSize,
    isTTSEnabled,
    toggleTTS,
  } = useAccessibilitySettings()
  
  const [isOpen, setIsOpen] = useState(false)

  const handleIncreaseFontSize = () => {
    setFontSize(Math.min(fontSize + 10, 150))
  }

  const handleDecreaseFontSize = () => {
    setFontSize(Math.max(fontSize - 10, 80))
  }

  const handleSpeak = () => {
    if (!window.speechSynthesis) return
    
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      return
    }

    // Read main content
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      const text = mainContent.textContent || ''
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 1000)) // Limit text length
      utterance.lang = document.documentElement.lang || 'fr-FR'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="relative">
      {/* Accessibility Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        aria-label={t('accessibility.title')}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <AccessibilityIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
          role="menu"
        >
          {/* High Contrast Toggle */}
          <div className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {t('accessibility.highContrast')}
              </span>
              <button
                onClick={toggleHighContrast}
                role="switch"
                aria-checked={isHighContrastMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isHighContrastMode ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isHighContrastMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Text Size Controls */}
          <div className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {t('accessibility.textSize')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDecreaseFontSize}
                  className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                  aria-label={t('accessibility.textSizeDecrease')}
                  disabled={fontSize <= 80}
                >
                  <span className="text-lg font-bold">−</span>
                </button>
                <span className="text-xs text-gray-600 dark:text-gray-400 w-10 text-center">
                  {fontSize}%
                </span>
                <button
                  onClick={handleIncreaseFontSize}
                  className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                  aria-label={t('accessibility.textSizeIncrease')}
                  disabled={fontSize >= 150}
                >
                  <span className="text-lg font-bold">+</span>
                </button>
              </div>
            </div>
          </div>

          {/* Text-to-Speech */}
          <div className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">
            <button
              onClick={handleSpeak}
              className="w-full flex items-center justify-between text-sm text-gray-700 dark:text-gray-300"
            >
              <span>{t('accessibility.textToSpeech')}</span>
              <SpeakerIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Reset */}
          <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2 px-4">
            <button
              onClick={() => {
                setFontSize(100)
                if (isHighContrastMode) toggleHighContrast()
                if (isTTSEnabled) toggleTTS()
              }}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              {t('accessibility.resetSettings')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Icons
const AccessibilityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const SpeakerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
)

export default AccessibilityControls
