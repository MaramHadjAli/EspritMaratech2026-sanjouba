import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * SelectInput Component
 * Dropdown select field with accessible options
 */
import React from 'react';
import clsx from 'clsx';
export const SelectInput = React.forwardRef(({ label, error, options, placeholder, className, ...props }, ref) => {
    return (_jsxs("div", { className: "w-full", children: [label && (_jsx("label", { className: "block text-sm font-medium text-gray-900 dark:text-white mb-2", children: label })), _jsxs("select", { ref: ref, className: clsx('w-full px-3 py-2.5 rounded-lg border transition-colors', 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white', 'border-gray-300 dark:border-gray-600', 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent', error && 'border-danger focus:ring-danger', 'disabled:opacity-50 disabled:cursor-not-allowed', className), "aria-invalid": !!error, "aria-describedby": error ? `${props.id}-error` : undefined, ...props, children: [placeholder && (_jsx("option", { value: "", disabled: true, children: placeholder })), options.map((option) => (_jsx("option", { value: option.value, disabled: option.disabled, children: option.label }, option.value)))] }), error && (_jsx("p", { id: `${props.id}-error`, className: "mt-1 text-sm text-danger font-medium", role: "alert", children: error }))] }));
});
SelectInput.displayName = 'SelectInput';
export default SelectInput;
//# sourceMappingURL=SelectInput.js.map