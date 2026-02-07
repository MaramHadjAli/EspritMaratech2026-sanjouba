import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * CheckboxInput Component
 * Custom styled checkbox with accessibility and dark mode support
 */
import React from 'react';
import clsx from 'clsx';
export const CheckboxInput = React.forwardRef(({ label, id, ...props }, ref) => {
    return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { ref: ref, type: "checkbox", id: id, className: clsx('w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600', 'accent-primary-500 dark:accent-primary-400', 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500', 'cursor-pointer transition-colors', 'disabled:cursor-not-allowed disabled:opacity-50'), ...props }), label && (_jsx("label", { htmlFor: id, className: "text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none hover:text-gray-900 dark:hover:text-gray-100", children: label }))] }));
});
CheckboxInput.displayName = 'CheckboxInput';
//# sourceMappingURL=CheckboxInput.js.map