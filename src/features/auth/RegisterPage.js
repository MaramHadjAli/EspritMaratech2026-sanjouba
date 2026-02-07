import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Register Page
 * Multi-step registration form with email verification
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@hooks/useNotification';
import { Button } from '@components/Button';
import { TextInput } from '@components/TextInput';
import { PasswordInput } from '@components/PasswordInput';
import { FormField } from '@components/FormField';
import { Card } from '@components/Card';
const RegisterPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { signup } = useAuth();
    const toast = useToast();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        location: '',
        agreeToTerms: false,
    });
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const checked = e.target.checked;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };
    const validateStep = (stepNum) => {
        const newErrors = {};
        switch (stepNum) {
            case 1:
                if (!formData.firstName.trim()) {
                    newErrors.firstName = 'First name is required';
                }
                if (!formData.lastName.trim()) {
                    newErrors.lastName = 'Last name is required';
                }
                break;
            case 2:
                if (!formData.email) {
                    newErrors.email = 'Email is required';
                }
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    newErrors.email = 'Invalid email format';
                }
                if (!formData.phoneNumber) {
                    newErrors.phoneNumber = 'Phone is required';
                }
                break;
            case 3:
                if (!formData.password) {
                    newErrors.password = 'Password is required';
                }
                else if (formData.password.length < 8) {
                    newErrors.password = 'Password must be at least 8 characters';
                }
                if (formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'Passwords do not match';
                }
                if (!formData.agreeToTerms) {
                    newErrors.agreeToTerms = 'You must agree to the terms';
                }
                break;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleNext = () => {
        if (validateStep(step)) {
            setStep((prev) => (prev + 1));
        }
    };
    const handlePrevious = () => {
        setStep((prev) => (prev - 1));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(3)) {
            return;
        }
        try {
            await signup({
                firstName: formData.firstName,
                lastName: formData.lastName,
                fullName: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                dateOfBirth: formData.dateOfBirth,
                location: formData.location,
            });
            toast.success('Account created successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        }
        catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            setErrors({
                submit: error.response?.data?.message || 'Registration failed. Please try again.',
            });
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4 py-8", children: _jsxs(Card, { className: "w-full max-w-md", bordered: true, children: [_jsx("div", { className: "flex justify-center mb-8", children: _jsx("div", { className: "w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-xl", children: "O" }) }) }), _jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white text-center mb-2", children: "Create Account" }), _jsx("div", { className: "flex justify-between mb-8", children: [1, 2, 3].map((s) => (_jsxs("div", { className: "flex flex-col items-center flex-1", children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`, children: s }), _jsx("span", { className: "text-xs mt-2 text-gray-600 dark:text-gray-400", children: s === 1 ? 'Personal' : s === 2 ? 'Contact' : 'Security' })] }, s))) }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [errors.submit && (_jsx("div", { className: "p-3 rounded-lg bg-danger-50 dark:bg-danger-900 border border-danger-200 dark:border-danger-800", children: _jsx("p", { className: "text-sm text-danger font-medium", children: errors.submit }) })), step === 1 && (_jsxs(_Fragment, { children: [_jsx(FormField, { label: "First Name", error: errors.firstName, required: true, children: _jsx(TextInput, { name: "firstName", value: formData.firstName, onChange: handleChange, placeholder: "John" }) }), _jsx(FormField, { label: "Last Name", error: errors.lastName, required: true, children: _jsx(TextInput, { name: "lastName", value: formData.lastName, onChange: handleChange, placeholder: "Doe" }) })] })), step === 2 && (_jsxs(_Fragment, { children: [_jsx(FormField, { label: "Email", error: errors.email, required: true, children: _jsx(TextInput, { name: "email", type: "email", value: formData.email, onChange: handleChange, placeholder: "your@email.com" }) }), _jsx(FormField, { label: "Phone", error: errors.phoneNumber, required: true, children: _jsx(TextInput, { name: "phoneNumber", type: "tel", value: formData.phoneNumber, onChange: handleChange, placeholder: "+216 XX XXX XXX" }) })] })), step === 3 && (_jsxs(_Fragment, { children: [_jsx(FormField, { label: "Password", error: errors.password, required: true, children: _jsx(PasswordInput, { name: "password", value: formData.password, onChange: handleChange }) }), _jsx(FormField, { label: "Confirm Password", error: errors.confirmPassword, required: true, children: _jsx(PasswordInput, { name: "confirmPassword", value: formData.confirmPassword, onChange: handleChange }) }), _jsxs("div", { className: "flex items-start", children: [_jsx("input", { type: "checkbox", name: "agreeToTerms", checked: formData.agreeToTerms, onChange: handleChange, className: "mt-1 mr-2", id: "terms" }), _jsxs("label", { htmlFor: "terms", className: "text-sm text-gray-600 dark:text-gray-400", children: ["I agree to the", ' ', _jsx(Link, { to: "/terms", className: "text-primary-500 hover:underline", children: "Terms of Service" }), ' ', "and", ' ', _jsx(Link, { to: "/privacy", className: "text-primary-500 hover:underline", children: "Privacy Policy" })] })] })] })), _jsxs("div", { className: "flex gap-3 pt-4", children: [step > 1 && (_jsx(Button, { type: "button", variant: "ghost", fullWidth: true, onClick: handlePrevious, children: "Previous" })), step < 3 && (_jsx(Button, { type: "button", fullWidth: true, onClick: handleNext, children: "Next" })), step === 3 && (_jsx(Button, { type: "submit", fullWidth: true, children: "Create Account" }))] })] }), _jsx("div", { className: "mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center", children: _jsxs("p", { className: "text-gray-600 dark:text-gray-400 text-sm", children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "text-primary-500 hover:text-primary-600 font-medium transition-colors", children: "Sign in" })] }) })] }) }));
};
export default RegisterPage;
//# sourceMappingURL=RegisterPage.js.map