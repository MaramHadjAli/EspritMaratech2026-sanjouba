import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

export const useLanguage = () => {
  const { i18n, t } = useTranslation()

  const changeLanguage = (lang: 'fr' | 'en' | 'ar') => {
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }

  useEffect(() => {
    const saved = localStorage.getItem('language') as 'fr' | 'en' | 'ar'
    if (saved) {
      i18n.changeLanguage(saved)
    }
  }, [i18n])

  return { t, currentLanguage: i18n.language, changeLanguage }
}