import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * AccessibleModal Component
 * WCAG AA compliant modal with focus management and keyboard support
 */
import { useEffect, useRef } from 'react';
import { useAccessibility } from '@hooks/useAccessibility';
const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
};
export const AccessibleModal = ({ isOpen, onClose, title, children, ariaDescribedBy, size = 'md', }) => {
    const modalRef = useRef(null);
    const { generateId } = useAccessibility();
    const modalId = generateId('modal');
    const titleId = generateId('modal-title');
    useEffect(() => {
        if (!isOpen)
            return;
        // Trap focus inside modal
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
            if (event.key === 'Tab') {
                const focusableElements = modalRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (!focusableElements || focusableElements.length === 0)
                    return;
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        event.preventDefault();
                        lastElement.focus();
                    }
                }
                else {
                    if (document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };
        // Prevent body scroll when modal is open
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        // Add event listener
        document.addEventListener('keydown', handleKeyDown);
        // Focus first button in modal
        const firstButton = modalRef.current?.querySelector('button');
        if (firstButton) {
            setTimeout(() => firstButton.focus(), 0);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity", onClick: onClose, "aria-hidden": "true" }), _jsx("div", { role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, "aria-describedby": ariaDescribedBy, className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: _jsxs("div", { ref: modalRef, className: `bg-white dark:bg-gray-800 rounded-lg shadow-xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`, children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700", children: [_jsx("h2", { id: titleId, className: "text-lg font-semibold text-gray-900 dark:text-white", children: title }), _jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded", "aria-label": "Close dialog", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsx("div", { className: "p-6", children: children })] }) })] }));
};
//# sourceMappingURL=AccessibleModal.js.map