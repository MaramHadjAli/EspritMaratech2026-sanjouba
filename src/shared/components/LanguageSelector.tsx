import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Check, ChevronDown } from 'lucide-react'

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'العربية', flag: '🇹🇳' }
]

export const LanguageSelector = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Sync avec i18n au montage
  useEffect(() => {
    const saved = localStorage.getItem('i18nextLng') || 'en'
    setCurrentLang(saved)
    i18n.changeLanguage(saved)
  }, [i18n])

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

  const handleLanguageChange = async (langCode: string) => {
    console.log('🌐 Changing language to:', langCode)
    
    // 1. Changer i18n
    await i18n.changeLanguage(langCode)
    
    // 2. Sauvegarder dans localStorage
    localStorage.setItem('i18nextLng', langCode)
    
    // 3. Mettre à jour le state local
    setCurrentLang(langCode)
    
    // 4. Mettre à jour le HTML
    document.documentElement.lang = langCode
    document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr'
    
    // 5. Fermer le dropdown
    setIsOpen(false)
    
    console.log('✅ Language changed to:', langCode)
  }

  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-white"
        aria-label="Changer de langue"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLanguage.flag} {currentLanguage.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`
                w-full flex items-center justify-between px-4 py-3 text-left transition-colors
                ${currentLang === lang.code 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-700'}
              `}
            >
              <span className="flex items-center gap-3">
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.label}</span>
              </span>
              {currentLang === lang.code && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector