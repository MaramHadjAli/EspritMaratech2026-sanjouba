/**
 * Number, Date, and Currency Formatters
 */
import { formatDistance, format, formatDistanceToNow } from 'date-fns';
import { fr, ar, enUS } from 'date-fns/locale';
// ============================================
// DATE FORMATTING
// ============================================
const locales = {
    fr: fr,
    ar: ar,
    en: enUS,
};
/**
 * Format date to display format (DD/MM/YYYY)
 */
export const formatDate = (date, locale = 'fr') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'dd/MM/yyyy', { locale: locales[locale] });
};
/**
 * Format date with time (DD/MM/YYYY HH:mm)
 */
export const formatDateTime = (date, locale = 'fr') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: locales[locale] });
};
/**
 * Format time only (HH:mm)
 */
export const formatTime = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'HH:mm');
};
/**
 * Format relative time ("2 days ago", "in 3 hours")
 */
export const formatRelativeTime = (date, locale = 'fr') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, {
        addSuffix: true,
        locale: locales[locale],
    });
};
/**
 * Format distance between two dates
 */
export const formatDateDistance = (from, to, locale = 'fr') => {
    return formatDistance(from, to, { locale: locales[locale] });
};
/**
 * Format month name (January, January, etc.)
 */
export const formatMonthName = (month, locale = 'fr') => {
    const date = new Date(2024, month - 1, 1);
    return format(date, 'MMMM', { locale: locales[locale] });
};
// ============================================
// CURRENCY FORMATTING (TND - Tunisia Dinar)
// ============================================
/**
 * Format amount as currency (TND)
 */
export const formatCurrency = (amount, currencyCode = 'TND') => {
    return new Intl.NumberFormat('fr-TN', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};
/**
 * Parse currency string to number
 */
export const parseCurrency = (currencyStr) => {
    return parseFloat(currencyStr.replace(/[^\d.]/g, ''));
};
// ============================================
// NUMBER FORMATTING
// ============================================
/**
 * Format number with thousand separators
 */
export const formatNumber = (num, locale = 'fr') => {
    return new Intl.NumberFormat(`${locale}-TN`).format(num);
};
/**
 * Format number as percentage
 */
export const formatPercentage = (num, decimals = 1) => {
    return `${(num * 100).toFixed(decimals)}%`;
};
/**
 * Format large numbers (1000 → 1K, 1000000 → 1M)
 */
export const formatCompactNumber = (num) => {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
};
// ============================================
// WEIGHT/QUANTITY FORMATTING
// ============================================
/**
 * Format weight (kg)
 */
export const formatWeight = (kg) => {
    if (kg >= 1) {
        return `${kg.toFixed(1)} kg`;
    }
    return `${(kg * 1000).toFixed(0)} g`;
};
/**
 * Format quantity with unit
 */
export const formatQuantity = (quantity, unit) => {
    return `${quantity} ${unit}`;
};
// ============================================
// NAME/STRING FORMATTING
// ============================================
/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
/**
 * Capitalize all words
 */
export const titleCase = (str) => {
    return str
        .split(' ')
        .map((word) => capitalize(word))
        .join(' ');
};
/**
 * Truncate string with ellipsis
 */
export const truncate = (str, maxLength) => {
    if (str.length > maxLength) {
        return str.substring(0, maxLength) + '...';
    }
    return str;
};
// ============================================
// PHONE FORMATTING
// ============================================
/**
 * Format phone number for display
 */
export const formatPhoneDisplay = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    // +216 2X XXX XXX format
    if (cleaned.length === 10) {
        return `+216 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
    }
    // +216 XX XXX XXX format
    if (cleaned.length === 12) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
    }
    return phone;
};
// ============================================
// FILE SIZE FORMATTING
// ============================================
/**
 * Format file size (B, KB, MB, GB)
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
//# sourceMappingURL=formatters.js.map