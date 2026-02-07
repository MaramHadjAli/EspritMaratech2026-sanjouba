import React, { createContext, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Language, LanguageContextType } from '@types'

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation()

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang)
  }

  const value: LanguageContextType = {
    language: (i18n.language as Language) || 'fr',
    setLanguage,
    isRTL: i18n.language === 'ar',
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
