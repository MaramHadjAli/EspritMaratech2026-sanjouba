import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@hooks/useNotification';
import Header from '@components/Header';
import { PasswordInput } from '@components/PasswordInput';
import { Button } from '@components/Button';
import { Card } from '@components/Card';
export const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();
    const { register, handleSubmit, watch, formState: { errors }, } = useForm({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });
    const [submitting, setSubmitting] = useState(false);
    const newPassword = watch('newPassword');
    if (!user) {
        navigate('/login');
        return null;
    }
    const onSubmit = async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        try {
            setSubmitting(true);
            // Mock API call - would be:
            // await userService.changePassword(user.id, {
            //   currentPassword: data.currentPassword,
            //   newPassword: data.newPassword,
            // })
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));
            toast.success('Password changed successfully');
            setTimeout(() => navigate('/settings'), 1000);
        }
        catch (err) {
            toast.error(err.message || 'Error changing password');
            console.error(err);
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, {}), _jsx("main", { className: "max-w-2xl mx-auto px-4 py-8", children: _jsxs("div", { children: [_jsx("div", { className: "mb-8", children: _jsx("button", { onClick: () => navigate('/settings'), className: "text-primary-600 dark:text-primary-400 hover:underline text-sm", children: "\u2190 Back to Settings" }) }), _jsxs(Card, { bordered: true, className: "p-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: "Change Password" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-8", children: "Update your password to keep your account secure" }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [_jsx(PasswordInput, { label: "Current Password", ...register('currentPassword', {
                                                required: 'Current password is required',
                                                minLength: {
                                                    value: 8,
                                                    message: 'Password must be at least 8 characters',
                                                },
                                            }), error: errors.currentPassword?.message, placeholder: "Enter your current password" }), _jsx("div", { className: "p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800", children: _jsx("p", { className: "text-sm text-yellow-800 dark:text-yellow-200", children: "Your current password is required to confirm this change for security reasons." }) }), _jsx("div", { className: "border-t border-gray-200 dark:border-gray-700" }), _jsx(PasswordInput, { label: "New Password", ...register('newPassword', {
                                                required: 'New password is required',
                                                minLength: {
                                                    value: 8,
                                                    message: 'Password must be at least 8 characters',
                                                },
                                                validate: {
                                                    uppercase: (value) => /[A-Z]/.test(value) ||
                                                        'Password must contain at least one uppercase letter',
                                                    lowercase: (value) => /[a-z]/.test(value) ||
                                                        'Password must contain at least one lowercase letter',
                                                    number: (value) => /\d/.test(value) ||
                                                        'Password must contain at least one number',
                                                    special: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                                                        'Password must contain at least one special character',
                                                },
                                            }), error: errors.newPassword?.message, placeholder: "Enter your new password" }), _jsxs("div", { className: "p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 dark:text-white mb-3", children: "Password Requirements:" }), _jsxs("ul", { className: "space-y-2 text-sm", children: [_jsxs("li", { className: `flex items-center ${newPassword?.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`, children: [_jsx("span", { className: "mr-2", children: "\u2713" }), "At least 8 characters"] }), _jsxs("li", { className: `flex items-center ${/[A-Z]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`, children: [_jsx("span", { className: "mr-2", children: "\u2713" }), "One uppercase letter"] }), _jsxs("li", { className: `flex items-center ${/[a-z]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`, children: [_jsx("span", { className: "mr-2", children: "\u2713" }), "One lowercase letter"] }), _jsxs("li", { className: `flex items-center ${/\d/.test(newPassword) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`, children: [_jsx("span", { className: "mr-2", children: "\u2713" }), "One number"] }), _jsxs("li", { className: `flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`, children: [_jsx("span", { className: "mr-2", children: "\u2713" }), "One special character"] })] })] }), _jsx(PasswordInput, { label: "Confirm New Password", ...register('confirmPassword', {
                                                required: 'Please confirm your new password',
                                                validate: (value) => value === newPassword || 'Passwords do not match',
                                            }), error: errors.confirmPassword?.message, placeholder: "Re-enter your new password" }), _jsxs("div", { className: "flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700", children: [_jsx(Button, { type: "submit", disabled: submitting, className: "flex-1", children: submitting ? 'Updating...' : 'Update Password' }), _jsx(Button, { type: "button", variant: "secondary", onClick: () => navigate('/settings'), disabled: submitting, className: "flex-1", children: "Cancel" })] })] }), _jsxs("div", { className: "mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800", children: [_jsx("h4", { className: "font-semibold text-blue-900 dark:text-blue-100 mb-3", children: "Security Tips:" }), _jsxs("ul", { className: "text-sm text-blue-800 dark:text-blue-200 space-y-2", children: [_jsx("li", { children: "\u2022 Use a password you don't use on other websites" }), _jsx("li", { children: "\u2022 Avoid easily guessable information like birthdays" }), _jsx("li", { children: "\u2022 Consider using a password manager for complex passwords" }), _jsx("li", { children: "\u2022 Change your password regularly for better security" })] })] })] })] }) })] }));
};
//# sourceMappingURL=ChangePasswordPage.js.map