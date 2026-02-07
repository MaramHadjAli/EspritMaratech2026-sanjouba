/**
 * useLanguage Hook
 * Custom hook for accessing language context and i18n functions
 */
import { useContext } from 'react';
import { LanguageContext } from '@contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
/**
 * Helper hook that combines useLanguage with useTranslation
 */
export const useI18n = () => {
    const { t, i18n } = useTranslation();
    const { language, setLanguage, isRTL } = useLanguage();
    return {
        t,
        language,
        setLanguage,
        isRTL,
        dir: isRTL ? 'rtl' : 'ltr',
        currentLang: i18n.language,
    };
};
//# sourceMappingURL=useLanguage.js.map