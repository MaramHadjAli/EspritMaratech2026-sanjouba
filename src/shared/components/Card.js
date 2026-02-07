import { jsx as _jsx } from "react/jsx-runtime";
import clsx from 'clsx';
export const Card = ({ bordered = true, hoverable = false, className, children, ...props }) => {
    return (_jsx("div", { className: clsx('rounded-lg bg-white dark:bg-gray-800 p-4', bordered && 'border border-gray-200 dark:border-gray-700', hoverable && 'hover:shadow-md transition-shadow cursor-pointer', 'shadow-sm', className), ...props, children: children }));
};
export default Card;
//# sourceMappingURL=Card.js.map