/**
 * useAccessibility Hook
 * Custom hook for managing accessibility features
 */
interface UseAccessibilityOptions {
    enableSkipLink?: boolean;
    enableFocusTrap?: boolean;
    announceChanges?: boolean;
}
export declare const useAccessibility: (options?: UseAccessibilityOptions) => {
    containerRef: import("react").RefObject<HTMLDivElement>;
    setFocus: (element: HTMLElement | null) => void;
    focusOnMount: () => void;
    announce: (message: string, assertive?: boolean) => void;
    announcement: string;
    reducedMotion: boolean;
    reducedText: boolean;
    darkMode: boolean;
    generateId: (prefix?: string) => string;
};
/**
 * useAriaLabel Hook
 * Manages aria labels dynamically
 */
export declare const useAriaLabel: (baseLabel: string) => {
    ariaLabel: string;
    updateAriaLabel: (label: string) => void;
};
/**
 * useKeyboardNavigation Hook
 * Handle common keyboard interactions
 */
export declare const useKeyboardNavigation: (callbacks: Record<string, () => void>) => {
    handleKeyDown: (event: KeyboardEvent) => void;
};
/**
 * useFocusVisible Hook
 * Shows focus indicator only for keyboard navigation
 */
export declare const useFocusVisible: () => {
    isFocusVisible: boolean;
};
/**
 * useThemePreference Hook
 * Detect and respond to theme preferences
 */
export declare const useThemePreference: () => {
    theme: "dark" | "light";
};
/**
 * useMotionPreference Hook
 * Detect and respond to motion preferences
 */
export declare const useMotionPreference: () => {
    allowMotion: boolean;
};
export {};
//# sourceMappingURL=useAccessibility.d.ts.map