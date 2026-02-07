/**
 * Number, Date, and Currency Formatters
 */
/**
 * Format date to display format (DD/MM/YYYY)
 */
export declare const formatDate: (date: string | Date, locale?: string) => string;
/**
 * Format date with time (DD/MM/YYYY HH:mm)
 */
export declare const formatDateTime: (date: string | Date, locale?: string) => string;
/**
 * Format time only (HH:mm)
 */
export declare const formatTime: (date: string | Date) => string;
/**
 * Format relative time ("2 days ago", "in 3 hours")
 */
export declare const formatRelativeTime: (date: string | Date, locale?: string) => string;
/**
 * Format distance between two dates
 */
export declare const formatDateDistance: (from: Date, to: Date, locale?: string) => string;
/**
 * Format month name (January, January, etc.)
 */
export declare const formatMonthName: (month: number, locale?: string) => string;
/**
 * Format amount as currency (TND)
 */
export declare const formatCurrency: (amount: number, currencyCode?: string) => string;
/**
 * Parse currency string to number
 */
export declare const parseCurrency: (currencyStr: string) => number;
/**
 * Format number with thousand separators
 */
export declare const formatNumber: (num: number, locale?: string) => string;
/**
 * Format number as percentage
 */
export declare const formatPercentage: (num: number, decimals?: number) => string;
/**
 * Format large numbers (1000 → 1K, 1000000 → 1M)
 */
export declare const formatCompactNumber: (num: number) => string;
/**
 * Format weight (kg)
 */
export declare const formatWeight: (kg: number) => string;
/**
 * Format quantity with unit
 */
export declare const formatQuantity: (quantity: number, unit: string) => string;
/**
 * Capitalize first letter
 */
export declare const capitalize: (str: string) => string;
/**
 * Capitalize all words
 */
export declare const titleCase: (str: string) => string;
/**
 * Truncate string with ellipsis
 */
export declare const truncate: (str: string, maxLength: number) => string;
/**
 * Format phone number for display
 */
export declare const formatPhoneDisplay: (phone: string) => string;
/**
 * Format file size (B, KB, MB, GB)
 */
export declare const formatFileSize: (bytes: number) => string;
//# sourceMappingURL=formatters.d.ts.map