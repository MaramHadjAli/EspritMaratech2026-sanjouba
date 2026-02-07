import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Import translation files
import frTranslations from './locales/fr.json';
import arTranslations from './locales/ar.json';
import enTranslations from './locales/en.json';
const resources = {
    fr: { translation: frTranslations },
    ar: { translation: arTranslations },
    en: { translation: enTranslations },
};
i18n
    .use(initReactI18next)
    .init({
    resources,
    lng: localStorage.getItem('language') || import.meta.env.VITE_DEFAULT_LANGUAGE || 'fr',
    fallbackLng: 'fr',
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
});
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('language', lng);
    document.documentElement.lang = lng;
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
});
export default i18n;
//# sourceMappingURL=i18n.js.map