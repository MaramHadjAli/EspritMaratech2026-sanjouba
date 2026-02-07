import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
export const FormField = ({ label, error, helperText, required = false, children, className, }) => {
    return (_jsxs("div", { className: clsx('w-full flex flex-col gap-1.5', className), children: [_jsxs("label", { className: "text-sm font-medium text-gray-900 dark:text-white", children: [label, required && _jsx("span", { className: "text-danger ml-1", children: "*" })] }), children, error && (_jsx("p", { className: "text-xs text-danger font-medium", role: "alert", children: error })), helperText && !error && (_jsx("p", { className: "text-xs text-gray-600 dark:text-gray-400", children: helperText }))] }));
};
export default FormField;
//# sourceMappingURL=FormField.js.map