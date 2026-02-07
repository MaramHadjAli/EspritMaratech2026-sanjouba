import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Login Page - OMNIA Charity Tracking
 * Handles user authentication with email/password
 * Responsive, accessible (WCAG AA), supports dark mode and multiple languages
 */
import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@hooks/useTheme';
import { validateEmail } from '@utils/validators';
import { FormField } from '@components/FormField';
import { Button } from '@components/Button';
import { PasswordInput } from '@components/PasswordInput';
import { TextInput } from '@components/TextInput';
import { CheckboxInput } from '@components/CheckboxInput';
const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login, isLoading } = useAuth();
    const { isDarkMode } = useTheme();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    // Validate form
    const validateForm = useCallback(() => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = t('auth.email') + ' ' + t('common.required');
        }
        else if (!validateEmail(formData.email)) {
            newErrors.email = t('auth.invalidEmail');
        }
        if (!formData.password) {
            newErrors.password = t('auth.password') + ' ' + t('common.required');
        }
        else if (formData.password.length < 6) {
            newErrors.password = t('auth.password') + ' ' + t('common.required');
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, t]);
    // Handle input change
    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.currentTarget;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined,
            }));
        }
    }, [errors]);
    // Handle form submission
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setSubmitError(null);
        if (!validateForm()) {
            return;
        }
        try {
            await login(formData.email, formData.password);
            if (formData.rememberMe) {
                localStorage.setItem('rememberEmail', formData.email);
            }
            else {
                localStorage.removeItem('rememberEmail');
            }
            navigate('/home');
        }
        catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || t('auth.invalidCredentials');
            setSubmitError(errorMessage);
        }
    }, [formData, validateForm, login, navigate, t]);
    // Handle enter key
    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSubmit(e);
        }
    }, [handleSubmit, isLoading]);
    return (_jsxs("div", { className: "min-h-screen w-full flex items-center justify-center px-4 py-8", style: {
            backgroundImage: isDarkMode
                ? "url('/images/backgrounds/bg-dark.png')"
                : "url('/images/backgrounds/bg-light.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }, children: [_jsx("a", { href: "#login-form", className: "sr-only focus:not-sr-only", children: t('common.skipToContent') || 'Aller au formulaire de connexion' }), _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6", children: [_jsxs("div", { className: "text-center space-y-2", children: [_jsx("img", { src: isDarkMode ? '/images/icons/logo-dark.png' : '/images/icons/logo-light.png', alt: t('common.appName'), className: "h-12 mx-auto" }), _jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: t('auth.login') }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: t('common.tagline') })] }), submitError && (_jsx("div", { role: "alert", className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4", "aria-live": "polite", "aria-atomic": "true", children: _jsx("p", { className: "text-sm text-red-800 dark:text-red-200", children: submitError }) })), _jsxs("form", { id: "login-form", onSubmit: handleSubmit, onKeyPress: handleKeyPress, className: "space-y-4", noValidate: true, children: [_jsx(FormField, { label: t('auth.email'), error: errors.email, required: true, children: _jsx(TextInput, { type: "email", name: "email", value: formData.email, onChange: handleInputChange, placeholder: "exemple@omnia.fr", disabled: isLoading, "aria-required": "true", "aria-invalid": !!errors.email, "aria-describedby": errors.email ? 'email-error' : undefined }) }), _jsx(FormField, { label: t('auth.password'), error: errors.password, required: true, children: _jsx(PasswordInput, { name: "password", value: formData.password, onChange: handleInputChange, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", disabled: isLoading, showPassword: showPassword, onToggleShowPassword: () => setShowPassword(!showPassword), "aria-required": "true", "aria-invalid": !!errors.password, "aria-describedby": errors.password ? 'password-error' : undefined }) }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(CheckboxInput, { id: "remember-me", name: "rememberMe", label: t('auth.rememberMe'), checked: formData.rememberMe, onChange: handleInputChange, disabled: isLoading }), _jsx(Link, { to: "/auth/forgot-password", className: "text-sm text-primary-600 dark:text-primary-400 hover:underline focus:outline-2 focus:outline-offset-2 focus:outline-primary-500", "aria-label": t('auth.forgotPassword'), children: t('auth.forgotPassword') })] }), _jsx(Button, { type: "submit", variant: "primary", fullWidth: true, isLoading: isLoading, disabled: isLoading, size: "lg", "aria-busy": isLoading, children: isLoading ? t('common.loading') : t('auth.login') })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-gray-300 dark:border-gray-600" }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400", children: t('common.or') || 'ou' }) })] }), _jsxs("div", { className: "text-center text-sm text-gray-600 dark:text-gray-400", children: [_jsxs("span", { children: [t('auth.dontHaveAccount'), " "] }), _jsx(Link, { to: "/auth/signup", className: "text-primary-600 dark:text-primary-400 font-semibold hover:underline focus:outline-2 focus:outline-offset-2 focus:outline-primary-500", children: t('auth.signup') })] })] }), _jsx("div", { className: "mt-6 text-center text-xs text-gray-500 dark:text-gray-400", children: _jsxs("p", { children: [t('common.secureConnection') || 'Connexion sécurisée', " \u2022 ", t('common.privacyPolicy') || 'Politique de confidentialité'] }) })] })] }));
};
export default LoginPage;
//# sourceMappingURL=LoginPage.js.map