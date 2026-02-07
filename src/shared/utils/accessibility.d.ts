/**
 * Accessibility Utilities
 * WCAG AA compliant helpers for keyboard navigation, focus management, and ARIA support
 */
export declare const focusElement: (element: HTMLElement | null) => void;
export declare const focusFirstFocusable: () => void;
export declare const isKeyboardEvent: (event: KeyboardEvent, key: string) => boolean;
export declare const handleEscapeKey: (callback: () => void) => (event: KeyboardEvent) => void;
export declare const handleEnterKey: (callback: () => void) => (event: KeyboardEvent) => void;
export declare const handleTabKey: (event: KeyboardEvent, onTab: () => void) => void;
export declare const getAriaLabel: (label: string) => string;
export declare const getAriaDescription: (description: string) => string;
export declare const getAriaLabelledBy: (...ids: string[]) => string;
export declare const createSkipLink: (targetId: string, label: string) => {
    href: string;
    'aria-label': string;
    className: string;
};
export declare const announceToScreenReader: (message: string, politeness?: "polite" | "assertive") => void;
export declare const validateHeadingHierarchy: (headings: NodeListOf<Element>) => boolean;
export declare const isContrastSufficient: (foreground: string, background: string) => boolean;
export declare const linkLabelToInput: (inputId: string, labelFor: string) => boolean;
export declare const getFormFieldError: (fieldName: string, errors: Record<string, any>) => string | null;
export declare const announceFormError: (fieldName: string, error: string) => void;
export declare const getTableAccessibilityProps: (role: "table" | "grid") => {
    role: "grid" | "table";
    'aria-label': string;
};
export declare const trapFocus: (event: KeyboardEvent, firstFocusable: HTMLElement, lastFocusable: HTMLElement) => void;
export declare const getTooltipAccessibilityProps: (tooltipId: string) => {
    'aria-describedby': string;
    'aria-tooltip': string;
};
export declare const announceLoading: (message?: string) => void;
export declare const announceLoadingComplete: (message?: string) => void;
export declare const getButtonAccessibilityProps: (disabled?: boolean, ariaPressed?: boolean) => Record<string, any>;
export declare const getLinkAccessibilityProps: (href: string, external?: boolean) => Record<string, any>;
export declare const prefersReducedText: () => boolean;
export declare const prefersReducedMotion: () => boolean;
export declare const prefersDarkMode: () => boolean;
export declare const generateUniqueId: (prefix?: string) => string;
export declare const getHeadingLevel: (element: Element) => number | null;
//# sourceMappingURL=accessibility.d.ts.map