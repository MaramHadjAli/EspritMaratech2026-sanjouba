/**
 * ColorBlindToggle Component
 * Allows users to switch between colorblind-friendly color modes
 * Supports: Normal, Deuteranopia, Protanopia, Tritanopia
 */

import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, Check, ChevronDown } from 'lucide-react'

// Eye icon SVG
const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

type ColorBlindMode = 'normal' | 'deuteranopia' | 'protanopia' | 'tritanopia'

const modes = [
  { 
    code: 'normal', 
    label: 'Normal', 
    description: 'Vision normale',
    preview: ['#EF4444', '#22C55E', '#3B82F6', '#F59E0B']
  },
  { 
    code: 'deuteranopia', 
    label: 'Deutéranopie', 
    description: 'Difficulté rouge-vert',
    preview: ['#0077BB', '#33BBEE', '#EE7733', '#CCBB44']
  },
  { 
    code: 'protanopia', 
    label: 'Protanopie', 
    description: 'Difficulté rouge-vert',
    preview: ['#0077BB', '#33BBEE', '#EE7733', '#CCBB44']
  },
  { 
    code: 'tritanopia', 
    label: 'Tritanopie', 
    description: 'Difficulté bleu-jaune',
    preview: ['#CC3311', '#009988', '#EE3377', '#33BBEE']
  }
]

export const ColorBlindToggle: React.FC = () => {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const [isOpen, setIsOpen] = useState(false)
  const [currentMode, setCurrentMode] = useState<ColorBlindMode>('normal')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Charger le mode sauvegardé
  useEffect(() => {
    const saved = localStorage.getItem('colorBlindMode') as ColorBlindMode
    if (saved && modes.some(m => m.code === saved)) {
      setCurrentMode(saved)
      applyColorMode(saved)
    }
  }, [])

  // Fermer dropdown si clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const applyColorMode = (mode: ColorBlindMode) => {
    console.log('🎨 Applying color mode:', mode)
    
    // Appliquer sur le document
    document.documentElement.setAttribute('data-color-mode', mode)
    
    // Sauvegarder
    localStorage.setItem('colorBlindMode', mode)
    
    console.log('✅ Color mode applied:', mode)
  }

  const handleModeChange = (mode: ColorBlindMode) => {
    setCurrentMode(mode)
    applyColorMode(mode)
    setIsOpen(false)
  }

  const current = modes.find(m => m.code === currentMode) || modes[0]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-white"
        aria-label="Mode d'accessibilité couleurs"
        title="Accessibilité daltonien"
      >
        <Eye className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">{current.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-slate-700">
            <p className="text-sm font-semibold text-white">Mode daltonien</p>
            <p className="text-xs text-slate-400">Adapter les couleurs à votre vision</p>
          </div>
          
          {modes.map((mode) => (
            <button
              key={mode.code}
              onClick={() => handleModeChange(mode.code as ColorBlindMode)}
              className={`
                w-full flex items-center justify-between px-4 py-3 text-left transition-colors
                ${currentMode === mode.code 
                  ? 'bg-blue-600/20 border-l-4 border-blue-500' 
                  : 'hover:bg-slate-700 border-l-4 border-transparent'}
              `}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{mode.label}</span>
                  {currentMode === mode.code && <Check className="w-4 h-4 text-blue-400" />}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{mode.description}</p>
                
                {/* Preview des couleurs */}
                <div className="flex gap-1 mt-2">
                  {mode.preview.map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-md shadow-inner"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ColorBlindToggle
