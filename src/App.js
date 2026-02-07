import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@contexts/AuthContext';
import { ThemeProvider } from '@contexts/ThemeContext';
import { LanguageProvider } from '@contexts/LanguageContext';
import { NotificationProvider } from '@contexts/NotificationContext';
import { useAuth } from '@hooks/useAuth';
import LoginPage from '@features/auth/LoginPage';
import AddEmployeePage from '@features/auth/AddEmployeePage';
import LandingPage from '@features/landing/LandingPage';
import HomePage from '@features/home/HomePage';
import DashboardPage from '@features/dashboard/DashboardPage';
import VisitsPage from '@features/visits/VisitsPage';
import VisitDetailPage from '@features/visits/VisitDetailPage';
import CreateEditVisitPage from '@features/visits/CreateEditVisitPage';
import FamiliesPage from '@features/families/FamiliesPage';
import FamilyDetailPage from '@features/families/FamilyDetailPage';
import CreateEditFamilyPage from '@features/families/CreateEditFamilyPage';
import AidPage from '@features/aid/AidPage';
import AidDetailPage from '@features/aid/AidDetailPage';
import CreateEditAidPage from '@features/aid/CreateEditAidPage';
import SettingsPage from '@features/settings/SettingsPage';
import HistoryPage from '@features/history/HistoryPage';
import { ProfileEditPage } from '@features/profile/ProfileEditPage';
import { ChangePasswordPage } from '@features/profile/ChangePasswordPage';
import NotFound from './pages/NotFound';
import ErrorBoundary from './pages/ErrorBoundary';
import Toast from '@components/Toast';
import Layout from '@core/layout/Layout';
// Protected route wrapper
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
// Protected admin-only route wrapper
const ProtectedAdminRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (user?.role !== 'ADMIN') {
        return _jsx(Navigate, { to: "/home", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
const AppRoutes = () => {
    const { isAuthenticated } = useAuth();
    return (_jsx(Routes, { children: isAuthenticated ? (
        // Authenticated routes
        _jsxs(_Fragment, { children: [_jsx(Route, { path: "/home", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/history", element: _jsx(HistoryPage, {}) }), _jsx(Route, { path: "/settings", element: _jsx(SettingsPage, {}) }), _jsx(Route, { path: "/profile/edit", element: _jsx(ProfileEditPage, {}) }), _jsx(Route, { path: "/profile/change-password", element: _jsx(ChangePasswordPage, {}) }), _jsx(Route, { path: "/employees/add", element: _jsx(ProtectedAdminRoute, { children: _jsx(AddEmployeePage, {}) }) }), _jsx(Route, { path: "/visits", element: _jsx(VisitsPage, {}) }), _jsx(Route, { path: "/visits/create", element: _jsx(CreateEditVisitPage, {}) }), _jsx(Route, { path: "/visits/:id", element: _jsx(VisitDetailPage, {}) }), _jsx(Route, { path: "/visits/:id/edit", element: _jsx(CreateEditVisitPage, {}) }), _jsx(Route, { path: "/families", element: _jsx(FamiliesPage, {}) }), _jsx(Route, { path: "/families/add", element: _jsx(CreateEditFamilyPage, {}) }), _jsx(Route, { path: "/families/:id", element: _jsx(FamilyDetailPage, {}) }), _jsx(Route, { path: "/families/:id/edit", element: _jsx(CreateEditFamilyPage, {}) }), _jsx(Route, { path: "/aid", element: _jsx(AidPage, {}) }), _jsx(Route, { path: "/aid/add", element: _jsx(CreateEditAidPage, {}) }), _jsx(Route, { path: "/aid/:id", element: _jsx(AidDetailPage, {}) }), _jsx(Route, { path: "/aid/:id/edit", element: _jsx(CreateEditAidPage, {}) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/home", replace: true }) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] })) : (
        // Public routes
        _jsxs(_Fragment, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] })) }));
};
const AppRoutes = () => (_jsxs(Routes, { children: [_jsxs(Route, { element: _jsx(ProtectedRoute, { children: _jsx(Layout, {}) }), children: [_jsx(Route, { path: "/home", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/history", element: _jsx(HistoryPage, {}) }), _jsx(Route, { path: "/settings", element: _jsx(SettingsPage, {}) }), _jsx(Route, { path: "/profile/edit", element: _jsx(ProfileEditPage, {}) }), _jsx(Route, { path: "/profile/change-password", element: _jsx(ChangePasswordPage, {}) }), _jsx(Route, { path: "/visits", element: _jsx(VisitsPage, {}) }), _jsx(Route, { path: "/visits/create", element: _jsx(CreateEditVisitPage, {}) }), _jsx(Route, { path: "/visits/:id", element: _jsx(VisitDetailPage, {}) }), _jsx(Route, { path: "/visits/:id/edit", element: _jsx(CreateEditVisitPage, {}) }), _jsx(Route, { path: "/families", element: _jsx(FamiliesPage, {}) }), _jsx(Route, { path: "/families/add", element: _jsx(CreateEditFamilyPage, {}) }), _jsx(Route, { path: "/families/:id", element: _jsx(FamilyDetailPage, {}) }), _jsx(Route, { path: "/families/:id/edit", element: _jsx(CreateEditFamilyPage, {}) }), _jsx(Route, { path: "/aid", element: _jsx(AidPage, {}) }), _jsx(Route, { path: "/aid/add", element: _jsx(CreateEditAidPage, {}) }), _jsx(Route, { path: "/aid/:id", element: _jsx(AidDetailPage, {}) }), _jsx(Route, { path: "/aid/:id/edit", element: _jsx(CreateEditAidPage, {}) }), _jsx(Route, { path: "/employees/add", element: _jsx(ProtectedAdminRoute, { children: _jsx(AddEmployeePage, {}) }) })] }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: "/", element: _jsx(LandingOrRedirect, {}) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }));
function App() {
    return (_jsx(ErrorBoundary, { children: _jsx(ThemeProvider, { children: _jsx(LanguageProvider, { children: _jsx(AuthProvider, { children: _jsx(NotificationProvider, { children: _jsxs(Router, { children: [_jsx(AppRoutes, {}), _jsx(Toast, {})] }) }) }) }) }) }));
}
export default App;
//# sourceMappingURL=App.js.map