import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Button } from '@components/Button';
import { Card } from '@components/Card';
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "handleReset", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.setState({ hasError: false, error: undefined, errorInfo: undefined, errorId: undefined });
            }
        });
        Object.defineProperty(this, "handleGoHome", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                window.location.href = '/';
            }
        });
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        // Generate unique error ID for tracking
        const errorId = 'ERR_' + Date.now() + '_' + Math.random().toString(36).substring(7);
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error boundary caught:', error, errorInfo);
        }
        // Log to external error tracking service in production
        // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } })
        this.setState({
            errorInfo,
            errorId,
        });
    }
    render() {
        if (this.state.hasError) {
            return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8", children: _jsxs(Card, { bordered: true, className: "w-full max-w-md p-8", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4", children: _jsx("svg", { className: "w-8 h-8 text-red-600 dark:text-red-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: "Oops! Something went wrong" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-2", children: this.state.error?.message || 'An unexpected error occurred' }), this.state.errorId && (_jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-500 font-mono mb-6 p-2 bg-gray-100 dark:bg-gray-800 rounded", children: ["Error ID: ", this.state.errorId] }))] }), process.env.NODE_ENV === 'development' && this.state.errorInfo && (_jsxs("div", { className: "mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg", children: [_jsx("p", { className: "text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2", children: "Component Stack (Development Only):" }), _jsx("pre", { className: "text-xs text-yellow-800 dark:text-yellow-200 overflow-auto max-h-32 font-mono whitespace-pre-wrap break-words", children: this.state.errorInfo.componentStack })] })), _jsxs("div", { className: "mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg", children: [_jsx("p", { className: "text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2", children: "What you can try:" }), _jsxs("ul", { className: "text-sm text-blue-800 dark:text-blue-200 space-y-1", children: [_jsx("li", { children: "\u2022 Refresh the page" }), _jsx("li", { children: "\u2022 Clear your browser cache" }), _jsx("li", { children: "\u2022 Check your internet connection" }), _jsx("li", { children: "\u2022 Try again in a few moments" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx(Button, { onClick: this.handleReset, className: "w-full", children: "Try Again" }), _jsx(Button, { onClick: this.handleGoHome, variant: "secondary", className: "w-full", children: "Go Home" })] }), _jsx("div", { className: "mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center", children: _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Still having issues?", ' ', _jsx("a", { href: "mailto:support@omnia.org", className: "text-primary-600 dark:text-primary-400 hover:underline font-medium", children: "Contact support" })] }) })] }) }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map