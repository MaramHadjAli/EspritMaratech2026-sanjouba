import { jsx as _jsx } from "react/jsx-runtime";
import { createContext } from 'react';
import { useTranslation } from 'react-i18next';
export const LanguageContext = createContext(undefined);
export const LanguageProvider = ({ children }) => {
    const { i18n } = useTranslation();
    const setLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };
    const value = {
        language: i18n.language || 'fr',
        setLanguage,
        isRTL: i18n.language === 'ar',
    };
    return _jsx(LanguageContext.Provider, { value: value, children: children });
};
//# sourceMappingURL=LanguageContext.js.map