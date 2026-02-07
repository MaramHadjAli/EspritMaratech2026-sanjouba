/**
 * useLanguage Hook
 * Custom hook for accessing language context and i18n functions
 */
import { LanguageContextType } from '@types';
export declare const useLanguage: () => LanguageContextType;
/**
 * Helper hook that combines useLanguage with useTranslation
 */
export declare const useI18n: () => {
    t: import("i18next").TFunction<"translation", undefined>;
    language: import("@types").Language;
    setLanguage: (lang: import("@types").Language) => void;
    isRTL: boolean;
    dir: string;
    currentLang: string;
};
//# sourceMappingURL=useLanguage.d.ts.map