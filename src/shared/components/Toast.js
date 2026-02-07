import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNotification } from '@hooks/useNotification';
import clsx from 'clsx';
const Toast = () => {
    const { notifications } = useNotification();
    return (_jsx("div", { className: "fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm", role: "status", "aria-live": "polite", "aria-atomic": "true", children: notifications.map((notification) => (_jsx(ToastItem, { notification: notification }, notification.id))) }));
};
const ToastItem = ({ notification }) => {
    const { removeNotification } = useNotification();
    const bgColor = {
        success: 'bg-success',
        error: 'bg-danger',
        warning: 'bg-warning',
        info: 'bg-info',
    };
    const icon = {
        success: _jsx(CheckIcon, { className: "w-5 h-5" }),
        error: _jsx(XIcon, { className: "w-5 h-5" }),
        warning: _jsx(AlertIcon, { className: "w-5 h-5" }),
        info: _jsx(InfoIcon, { className: "w-5 h-5" }),
    };
    return (_jsxs("div", { className: clsx('flex items-center gap-3 px-4 py-3 rounded-lg text-white shadow-lg', 'animate-slide-up', bgColor[notification.type] || 'bg-info'), children: [icon[notification.type] || icon.info, _jsx("div", { className: "flex-1", children: _jsx("p", { className: "font-medium", children: notification.message }) }), notification.action && (_jsx("button", { onClick: () => {
                    notification.action?.callback();
                    removeNotification(notification.id);
                }, className: "font-medium underline hover:opacity-80 transition-opacity", children: notification.action.label })), _jsx("button", { onClick: () => removeNotification(notification.id), "aria-label": "Close notification", className: "hover:opacity-80 transition-opacity", children: _jsx(XIcon, { className: "w-4 h-4" }) })] }));
};
// Icons
const CheckIcon = (props) => (_jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", ...props, children: _jsx("polyline", { points: "20 6 9 17 4 12" }) }));
const XIcon = (props) => (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", ...props, children: [_jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), _jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })] }));
const AlertIcon = (props) => (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", ...props, children: [_jsx("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z" }), _jsx("line", { x1: "12", y1: "9", x2: "12", y2: "13" }), _jsx("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })] }));
const InfoIcon = (props) => (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", ...props, children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("line", { x1: "12", y1: "16", x2: "12", y2: "12" }), _jsx("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })] }));
export default Toast;
//# sourceMappingURL=Toast.js.map