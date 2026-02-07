import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './Layout.css';
export default function Layout() {
    const [darkMode, setDarkMode] = React.useState(false);
    React.useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark-mode');
        }
        else {
            document.documentElement.classList.remove('dark-mode');
        }
    }, [darkMode]);
    return (_jsxs("div", { className: "layout", children: [_jsxs("header", { className: "app-header", role: "banner", children: [_jsx("h1", { children: "\uD83E\uDD1D OMNIA Charity Tracking" }), _jsx("nav", { className: "main-nav", role: "navigation", "aria-label": "Navigation principale", children: _jsxs("ul", { children: [_jsx("li", { children: _jsx(Link, { to: "/dashboard", className: "nav-link", children: "Tableau de bord" }) }), _jsx("li", { children: _jsx(Link, { to: "/families", className: "nav-link", children: "Familles" }) }), _jsx("li", { children: _jsx(Link, { to: "/visits", className: "nav-link", children: "Visites" }) })] }) }), _jsx("button", { onClick: () => setDarkMode(!darkMode), "aria-label": `Activer ${darkMode ? 'le mode' : 'le mode sombre'}`, className: "dark-mode-btn", children: darkMode ? '☀️' : '🌙' })] }), _jsx("main", { className: "app-main", role: "main", children: _jsx(Outlet, {}) }), _jsx("a", { href: "#app-main", className: "skip-link", children: "Aller au contenu principal" })] }));
}
//# sourceMappingURL=Layout.js.map