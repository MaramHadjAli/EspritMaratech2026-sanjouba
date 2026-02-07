import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@components/Button';
import { Badge } from '@components/Badge';
const LandingPage = () => {
    const { t } = useTranslation();
    const features = [
        {
            icon: '👥',
            title: 'Family Management',
            description: 'Track and manage family information efficiently',
        },
        {
            icon: '📍',
            title: 'Visit Tracking',
            description: 'Organize and track charitable visits with maps integration',
        },
        {
            icon: '💝',
            title: 'Aid Distribution',
            description: 'Distribute aid transparently and track impact',
        },
        {
            icon: '📊',
            title: 'Analytics Dashboard',
            description: 'Get insights with comprehensive statistics and charts',
        },
        {
            icon: '🗺️',
            title: 'Regional Coverage',
            description: 'Monitor coverage across all regions',
        },
        {
            icon: '🌍',
            title: 'Multilingual',
            description: 'Support for Arabic, French, and English',
        },
    ];
    const stats = [
        { number: '500+', label: 'Families Helped' },
        { number: '1000+', label: 'Visits Completed' },
        { number: '24', label: 'Active Regions' },
        { number: '95%', label: 'Satisfaction Rate' },
    ];
    return (_jsxs("div", { className: "min-h-screen bg-white dark:bg-gray-900", children: [_jsx(Header, {}), _jsx("section", { className: "relative px-6 py-20 sm:py-32 lg:px-8", children: _jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [_jsx(Badge, { variant: "info", className: "mb-4 inline-block", children: "\u2728 Charity Management Platform" }), _jsx("h1", { className: "text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl mb-6", children: "Make a Difference with OMNIA" }), _jsx("p", { className: "text-lg leading-8 text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto", children: "A comprehensive platform for managing charitable activities, tracking visits, distributing aid, and monitoring impact across your organization." }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [_jsx(Link, { to: "/register", children: _jsx(Button, { size: "lg", children: "Get Started Free" }) }), _jsx(Link, { to: "/login", children: _jsx(Button, { size: "lg", variant: "ghost", children: "Sign In" }) })] }), _jsxs("div", { className: "mt-16 relative", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-primary-500/20 to-blue-500/20 rounded-3xl blur-3xl" }), _jsx("img", { src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop", alt: "Team collaboration", className: "relative rounded-3xl shadow-2xl w-full" })] })] }) }), _jsx("section", { className: "py-16 px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-900", children: _jsx("div", { className: "mx-auto max-w-7xl", children: _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-8", children: stats.map((stat, idx) => (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold text-primary-600 dark:text-primary-400", children: stat.number }), _jsx("div", { className: "text-gray-600 dark:text-gray-400 mt-2", children: stat.label })] }, idx))) }) }) }), _jsx("section", { className: "py-20 px-6 lg:px-8", children: _jsxs("div", { className: "mx-auto max-w-7xl", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-4", children: "Powerful Features" }), _jsx("p", { className: "text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto", children: "Everything you need to manage charitable activities efficiently" })] }), _jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8", children: features.map((feature, idx) => (_jsxs("div", { className: "p-8 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors", children: [_jsx("div", { className: "text-4xl mb-4", children: feature.icon }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-2", children: feature.title }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: feature.description })] }, idx))) })] }) }), _jsx("section", { className: "py-20 px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-blue-600", children: _jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [_jsx("h2", { className: "text-3xl font-bold text-white mb-6", children: "Ready to make an impact?" }), _jsx("p", { className: "text-lg text-primary-100 mb-8", children: "Join thousands of organizations using OMNIA to improve their charitable work." }), _jsx(Link, { to: "/register", children: _jsx(Button, { size: "lg", className: "bg-white text-primary-600 hover:bg-gray-100", children: "Start Your 30-Day Free Trial" }) })] }) }), _jsx("footer", { className: "border-t border-gray-200 dark:border-gray-800 py-12 px-6 lg:px-8", children: _jsxs("div", { className: "mx-auto max-w-7xl", children: [_jsxs("div", { className: "grid md:grid-cols-4 gap-8 mb-8", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "Product" }), _jsxs("ul", { className: "space-y-2 text-gray-600 dark:text-gray-400 text-sm", children: [_jsx("li", { children: _jsx(Link, { to: "#", className: "hover:text-primary-500", children: "Features" }) }), _jsx("li", { children: _jsx(Link, { to: "#", className: "hover:text-primary-500", children: "Pricing" }) }), _jsx("li", { children: _jsx(Link, { to: "#", className: "hover:text-primary-500", children: "Security" }) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "Company" }), _jsxs("ul", { className: "space-y-2 text-gray-600 dark:text-gray-400 text-sm", children: [_jsx("li", { children: _jsx(Link, { to: "#", className: "hover:text-primary-500", children: "About" }) }), _jsx("li", { children: _jsx(Link, { to: "#", className: "hover:text-primary-500", children: "Contact" }) }), _jsx("li", { children: _jsx(Link, { to: "#", className: "hover:text-primary-500", children: "Blog" }) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "Legal" }), _jsxs("ul", { className: "space-y-2 text-gray-600 dark:text-gray-400 text-sm", children: [_jsx("li", { children: _jsx(Link, { to: "/privacy", className: "hover:text-primary-500", children: "Privacy" }) }), _jsx("li", { children: _jsx(Link, { to: "/terms", className: "hover:text-primary-500", children: "Terms" }) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "Connect" }), _jsxs("ul", { className: "space-y-2 text-gray-600 dark:text-gray-400 text-sm", children: [_jsx("li", { children: _jsx("a", { href: "#", className: "hover:text-primary-500", children: "Twitter" }) }), _jsx("li", { children: _jsx("a", { href: "#", className: "hover:text-primary-500", children: "LinkedIn" }) }), _jsx("li", { children: _jsx("a", { href: "#", className: "hover:text-primary-500", children: "GitHub" }) })] })] })] }), _jsxs("div", { className: "border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center", children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm", children: "\u00A9 2026 OMNIA. All rights reserved." }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm mt-4 md:mt-0", children: "Made with \u2764\uFE0F for charitable organizations" })] })] }) })] }));
};
export default LandingPage;
//# sourceMappingURL=LandingPage.js.map