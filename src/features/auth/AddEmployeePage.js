import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Add Employee Page
 * Admin-only page for adding new employees to the system
 * Employees are created with admin-provided credentials (no self-signup)
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@hooks/useAuth';
import { useNotification } from '@hooks/useNotification';
import { Button } from '@components/Button';
import { TextInput } from '@components/TextInput';
import { PasswordInput } from '@components/PasswordInput';
import { FormField } from '@components/FormField';
import { Card } from '@components/Card';
const AddEmployeePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { signup, user } = useAuth();
    const { addNotification } = useNotification();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    // Check if user is admin
    if (user?.role !== 'ADMIN') {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4", children: _jsx(Card, { className: "w-full max-w-md", bordered: true, children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-4", children: t('common.unauthorized') }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-6", children: t('auth.adminOnlyAccess') }), _jsx(Button, { onClick: () => navigate('/home'), fullWidth: true, children: t('common.back') })] }) }) }));
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
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
                    newErrors.firstName = t('validation.firstNameRequired');
                }
                if (!formData.lastName.trim()) {
                    newErrors.lastName = t('validation.lastNameRequired');
                }
                break;
            case 2:
                if (!formData.email) {
                    newErrors.email = t('validation.emailRequired');
                }
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    newErrors.email = t('validation.invalidEmail');
                }
                if (!formData.phoneNumber) {
                    newErrors.phoneNumber = t('validation.phoneRequired');
                }
                break;
            case 3:
                if (!formData.password) {
                    newErrors.password = t('validation.passwordRequired');
                }
                else if (formData.password.length < 8) {
                    newErrors.password = t('validation.passwordTooShort');
                }
                if (formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = t('validation.passwordMismatch');
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
                dateOfBirth: '',
                location: '',
            });
            addNotification({
                type: 'success',
                message: t('auth.employeeAddedSuccess'),
                duration: 3000,
            });
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                password: '',
                confirmPassword: '',
            });
            setStep(1);
            setTimeout(() => navigate('/home'), 2000);
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || t('auth.registrationFailed');
            addNotification({
                type: 'error',
                message: errorMessage,
                duration: 5000,
            });
            setErrors({
                submit: errorMessage,
            });
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4 py-8", children: _jsxs(Card, { className: "w-full max-w-md", bordered: true, children: [_jsx("div", { className: "flex justify-center mb-8", children: _jsx("div", { className: "w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-xl", children: "O" }) }) }), _jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white text-center mb-2", children: t('auth.addEmployee') }), _jsx("p", { className: "text-center text-sm text-gray-600 dark:text-gray-400 mb-8", children: t('auth.addEmployeeDescription') }), _jsx("div", { className: "flex justify-between mb-8", children: [1, 2, 3].map((s) => (_jsxs("div", { className: "flex flex-col items-center flex-1", children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`, children: s }), _jsx("span", { className: "text-xs mt-2 text-gray-600 dark:text-gray-400", children: s === 1 ? t('auth.stepPersonal') : s === 2 ? t('auth.stepContact') : t('auth.stepSecurity') })] }, s))) }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [errors.submit && (_jsx("div", { className: "p-3 rounded-lg bg-danger-50 dark:bg-danger-900 border border-danger-200 dark:border-danger-800", children: _jsx("p", { className: "text-sm text-danger font-medium", children: errors.submit }) })), step === 1 && (_jsxs(_Fragment, { children: [_jsx(FormField, { label: t('auth.firstName'), error: errors.firstName, required: true, children: _jsx(TextInput, { name: "firstName", value: formData.firstName, onChange: handleChange, placeholder: t('auth.firstNamePlaceholder') }) }), _jsx(FormField, { label: t('auth.lastName'), error: errors.lastName, required: true, children: _jsx(TextInput, { name: "lastName", value: formData.lastName, onChange: handleChange, placeholder: t('auth.lastNamePlaceholder') }) })] })), step === 2 && (_jsxs(_Fragment, { children: [_jsx(FormField, { label: t('auth.email'), error: errors.email, required: true, children: _jsx(TextInput, { name: "email", type: "email", value: formData.email, onChange: handleChange, placeholder: t('auth.emailPlaceholder') }) }), _jsx(FormField, { label: t('auth.phone'), error: errors.phoneNumber, required: true, children: _jsx(TextInput, { name: "phoneNumber", type: "tel", value: formData.phoneNumber, onChange: handleChange, placeholder: t('auth.phonePlaceholder') }) })] })), step === 3 && (_jsxs(_Fragment, { children: [_jsx(FormField, { label: t('auth.password'), error: errors.password, required: true, children: _jsx(PasswordInput, { name: "password", value: formData.password, onChange: handleChange }) }), _jsx(FormField, { label: t('auth.confirmPassword'), error: errors.confirmPassword, required: true, children: _jsx(PasswordInput, { name: "confirmPassword", value: formData.confirmPassword, onChange: handleChange }) })] })), _jsxs("div", { className: "flex gap-3 pt-4", children: [step > 1 && (_jsx(Button, { type: "button", variant: "ghost", fullWidth: true, onClick: handlePrevious, children: t('common.previous') })), step < 3 && (_jsx(Button, { type: "button", fullWidth: true, onClick: handleNext, children: t('common.next') })), step === 3 && (_jsx(Button, { type: "submit", fullWidth: true, children: t('auth.addEmployee') }))] })] }), _jsx("div", { className: "mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center", children: _jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm", children: _jsx(Link, { to: "/home", className: "text-primary-500 hover:text-primary-600 font-medium transition-colors", children: t('common.back') }) }) })] }) }));
};
export default AddEmployeePage;
//# sourceMappingURL=AddEmployeePage.js.map