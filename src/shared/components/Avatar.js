import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
const SIZE_STYLES = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
};
const VARIANT_STYLES = {
    primary: 'bg-primary-500 text-white',
    secondary: 'bg-secondary-500 text-white',
    danger: 'bg-danger text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    info: 'bg-info text-white',
};
const STATUS_SIZE = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
};
export const Avatar = ({ src, initials, size = 'md', shape = 'circle', variant = 'primary', online, className, alt = 'Avatar', ...props }) => {
    const sizeClass = SIZE_STYLES[size];
    const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-md';
    return (_jsxs("div", { className: "relative inline-block", children: [src ? (_jsx("img", { src: src, alt: alt, className: clsx(sizeClass, shapeClass, 'object-cover', className), ...props })) : (_jsx("div", { className: clsx(sizeClass, shapeClass, 'flex items-center justify-center font-bold', VARIANT_STYLES[variant], className), children: initials || '?' })), online !== undefined && (_jsx("div", { className: clsx('absolute bottom-0 right-0 rounded-full border-2 border-white', STATUS_SIZE[size], online ? 'bg-success' : 'bg-gray-400'), "aria-label": online ? 'Online' : 'Offline' }))] }));
};
export default Avatar;
//# sourceMappingURL=Avatar.js.map