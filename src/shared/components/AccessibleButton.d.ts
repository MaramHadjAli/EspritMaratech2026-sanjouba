/**
 * AccessibleButton Component
 * WCAG AA compliant button with proper keyboard support and ARIA labels
 */
import React from 'react';
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    ariaLabel?: string;
    ariaDescription?: string;
    ariaPressed?: boolean;
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    children: React.ReactNode;
}
export declare const AccessibleButton: React.ForwardRefExoticComponent<AccessibleButtonProps & React.RefAttributes<HTMLButtonElement>>;
export {};
//# sourceMappingURL=AccessibleButton.d.ts.map