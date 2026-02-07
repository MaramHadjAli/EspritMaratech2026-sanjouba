import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@components/Button';
import { Card } from '@components/Card';
import Header from '@components/Header';
import { useAuth } from '@hooks/useAuth';
const NotFound = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const suggestedLinks = isAuthenticated ? [
        { label: 'Home', path: '/home' },
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Visits', path: '/visits' },
        { label: 'Settings', path: '/settings' },
    ] : [
        { label: 'Home', path: '/' },
        { label: 'Login', path: '/login' },
        { label: 'Register', path: '/register' },
    ];
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800", children: [isAuthenticated && _jsx(Header, {}), _jsx("div", { className: "flex items-center justify-center px-4 py-12 min-h-screen", children: _jsxs(Card, { bordered: true, className: "w-full max-w-md p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "text-7xl font-bold text-primary-500 dark:text-primary-400 mb-4", children: "404" }), _jsx("div", { className: "w-24 h-24 mx-auto mb-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center", children: _jsx("svg", { className: "w-12 h-12 text-primary-600 dark:text-primary-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) })] }), _jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center", children: t('errors.404') || 'Page Not Found' }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 text-center mb-8", children: "The page you're looking for doesn't exist or has been moved. Let's get you back on track." }), _jsxs("div", { className: "mb-6", children: [_jsx("p", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-4", children: "Quick Links:" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: suggestedLinks.map((link) => (_jsx("button", { onClick: () => navigate(link.path), className: "px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors", children: link.label }, link.path))) })] }), _jsxs("div", { className: "space-y-3 mb-6", children: [_jsx(Link, { to: isAuthenticated ? '/home' : '/', className: "block", children: _jsx(Button, { className: "w-full", children: t('common.back') || 'Go Home' }) }), _jsx("button", { onClick: () => window.history.back(), className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium", children: "Go Back" })] }), _jsx("div", { className: "pt-6 border-t border-gray-200 dark:border-gray-700", children: _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400 text-center", children: ["Need help?", ' ', _jsx("a", { href: "mailto:support@omnia.org", className: "text-primary-600 dark:text-primary-400 hover:underline font-medium", children: "Contact support" })] }) })] }) })] }));
};
export default NotFound;
//# sourceMappingURL=NotFound.js.map