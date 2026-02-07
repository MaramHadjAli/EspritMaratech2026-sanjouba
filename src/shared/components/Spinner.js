import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
const SIZE_STYLES = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
};
const COLOR_STYLES = {
    primary: 'border-primary-500',
    white: 'border-white',
    gray: 'border-gray-400',
};
export const Spinner = ({ size = 'md', color = 'primary', label = 'Loading...', }) => {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center gap-2", children: [_jsx("div", { className: clsx('animate-spin rounded-full border-2 border-transparent', SIZE_STYLES[size], `border-r-${COLOR_STYLES[color]}`), role: "status", "aria-label": label, children: _jsx("span", { className: "sr-only", children: label }) }), label && _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-300", children: label })] }));
};
export default Spinner;
//# sourceMappingURL=Spinner.js.map