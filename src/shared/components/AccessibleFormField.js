import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * AccessibleFormField Component
 * WCAG AA compliant form field with proper labeling and error handling
 */
import React, { forwardRef } from 'react';
import { useAccessibility } from '@hooks/useAccessibility';
export const AccessibleFormField = forwardRef(({ id, label, error, hint, required = false, disabled = false, children, className, }, ref) => {
    const { generateId } = useAccessibility();
    const fieldId = id || generateId('field');
    const errorId = generateId('error');
    const hintId = hint ? generateId('hint') : undefined;
    const describedBy = [error && errorId, hintId].filter(Boolean).join(' ');
    return (_jsxs("div", { ref: ref, className: `mb-6 ${className}`, children: [_jsxs("label", { htmlFor: fieldId, className: "block text-sm font-medium text-gray-900 dark:text-white mb-2", children: [label, required && (_jsx("span", { className: "text-red-600 dark:text-red-400 ml-1", "aria-label": "required", children: "*" }))] }), hint && (_jsx("p", { id: hintId, className: "text-xs text-gray-600 dark:text-gray-400 mb-2", children: hint })), React.cloneElement(children, {
                id: fieldId,
                disabled,
                'aria-invalid': !!error,
                'aria-describedby': describedBy || undefined,
                'aria-required': required,
            }), error && (_jsxs("p", { id: errorId, className: "text-sm text-red-600 dark:text-red-400 mt-2", role: "alert", children: [_jsx("span", { className: "sr-only", children: "Error: " }), error] }))] }));
});
AccessibleFormField.displayName = 'AccessibleFormField';
//# sourceMappingURL=AccessibleFormField.js.map