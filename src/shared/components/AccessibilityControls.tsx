/**
 * AccessibilityControls Component - Premium Moose-Inspired Design
 * WCAG AA Compliant with animated controls
 */

import React, { useState, useContext, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AccessibilityContext } from '@contexts/AccessibilityContext'
import type { AccessibilityContextType } from '@types'

const useAccessibilitySettings = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibilitySettings must be used within AccessibilityProvider')
  }
  return context
}

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
  const [isHovered, setIsHovered] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Font size presets: A (100%), A+ (125%), A++ (150%)
  const fontSizePresets = [
    { label: 'A', value: 100 },
    { label: 'A+', value: 125 },
    { label: 'A++', value: 150 },
  ]

  const handleSpeak = () => {
    if (!window.speechSynthesis) return
    
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      return
    }

    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      const text = mainContent.textContent || ''
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 2000))
      utterance.lang = document.documentElement.lang || 'fr-FR'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleReset = () => {
    setFontSize(100)
    if (isHighContrastMode) toggleHighContrast()
    if (isTTSEnabled) toggleTTS()
    window.speechSynthesis?.cancel()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Moose-Inspired Animated Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500
          ${isOpen 
            ? 'bg-primary-100 dark:bg-primary-900/50' 
            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        aria-label={t('accessibility.title')}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <div className={`transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
          <MooseAccessibilityIcon 
            className={`w-5 h-5 transition-colors duration-300
              ${isOpen 
                ? 'text-primary-600 dark:text-primary-400' 
                : 'text-gray-600 dark:text-gray-300'
              }`}
            isAnimated={isHovered || isOpen}
          />
        </div>
        {/* Pulse ring on hover */}
        <span 
          className={`absolute inset-0 rounded-full border-2 border-primary-400 transition-all duration-500
            ${isHovered ? 'opacity-100 scale-125' : 'opacity-0 scale-100'}`}
        />
      </button>

      {/* Premium Dropdown Menu */}
      <div
        className={`absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 transition-all duration-300 origin-top-right
          ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
        role="menu"
      >
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <AccessibilityIcon className="w-4 h-4" />
            {t('accessibility.title')}
          </h3>
          <p className="text-xs text-primary-100 mt-0.5">{t('accessibility.subtitle') || 'WCAG AA Compliant'}</p>
        </div>

        <div className="p-3 space-y-3">
          {/* Font Size Selector - A, A+, A++ */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('accessibility.textSize')}
            </label>
            <div className="flex gap-2">
              {fontSizePresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setFontSize(preset.value)}
                  className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500
                    ${fontSize === preset.value
                      ? 'bg-primary-500 text-white shadow-md scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  aria-pressed={fontSize === preset.value}
                  style={{ fontSize: preset.value === 100 ? '0.875rem' : preset.value === 125 ? '1rem' : '1.125rem' }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <ContrastIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('accessibility.highContrast')}
              </span>
            </div>
            <button
              onClick={toggleHighContrast}
              role="switch"
              aria-checked={isHighContrastMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                ${isHighContrastMode ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300
                  ${isHighContrastMode ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>

          {/* Text-to-Speech Button */}
          <button
            onClick={handleSpeak}
            className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <div className="flex items-center gap-3">
              <SpeakerIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-500 transition-colors" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('accessibility.textToSpeech')}
              </span>
            </div>
            <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full">
              {window.speechSynthesis?.speaking ? t('accessibility.stop') || 'Stop' : t('accessibility.play') || 'Play'}
            </span>
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none focus:underline"
          >
            {t('accessibility.resetSettings')}
          </button>
        </div>
      </div>
    </div>
  )
}

// Moose-Inspired Animated Accessibility Icon
const MooseAccessibilityIcon: React.FC<{ className?: string; isAnimated?: boolean }> = ({ className, isAnimated }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Body */}
    <circle cx="12" cy="5" r="3" className={isAnimated ? 'animate-pulse' : ''} />
    <path d="M12 8v4" />
    {/* Arms */}
    <path 
      d="M8 12L4 15" 
      className={isAnimated ? 'origin-left transition-transform duration-300' : ''}
      style={isAnimated ? { transform: 'rotate(-5deg)' } : {}}
    />
    <path 
      d="M16 12L20 15" 
      className={isAnimated ? 'origin-right transition-transform duration-300' : ''}
      style={isAnimated ? { transform: 'rotate(5deg)' } : {}}
    />
    {/* Legs */}
    <path d="M12 12v4" />
    <path d="M12 16L9 22" />
    <path d="M12 16L15 22" />
  </svg>
)

const AccessibilityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3" />
    <path d="M12 8v8" />
    <path d="M8 12l-4 3" />
    <path d="M16 12l4 3" />
    <path d="M9 22l3-6 3 6" />
  </svg>
)

const ContrastIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" />
  </svg>
)

const SpeakerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
)

export default AccessibilityControls
