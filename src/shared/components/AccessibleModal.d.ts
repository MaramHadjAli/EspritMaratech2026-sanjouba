/**
 * AccessibleModal Component
 * WCAG AA compliant modal with focus management and keyboard support
 */
import React from 'react';
interface AccessibleModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    ariaDescribedBy?: string;
    size?: 'sm' | 'md' | 'lg';
}
export declare const AccessibleModal: React.FC<AccessibleModalProps>;
export {};
//# sourceMappingURL=AccessibleModal.d.ts.map