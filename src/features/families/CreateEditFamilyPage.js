import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Create/Edit Family Page
 * Create new or edit existing family
 */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@hooks/useNotification';
import { familyService } from '@services/family.service';
import { Card } from '@components/Card';
import { FormField } from '@components/FormField';
import { Button } from '@components/Button';
import Header from '@components/Header';
const CreateEditFamilyPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { success, error } = useToast();
    const { register, handleSubmit, formState: { errors }, } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            familySize: 1,
        },
    });
    const [submitting, setSubmitting] = useState(false);
    const isEditing = !!id;
    if (!user) {
        navigate('/login');
        return null;
    }
    const onSubmit = async (data) => {
        try {
            setSubmitting(true);
            if (isEditing) {
                const response = await familyService.updateFamily(id, data);
                if (response.success) {
                    success('Family updated successfully');
                    navigate(`/families/${id}`);
                }
                else {
                    error('Failed to update family');
                }
            }
            else {
                const response = await familyService.createFamily(data);
                if (response.success) {
                    success('Family created successfully');
                    navigate('/families');
                }
                else {
                    error('Failed to create family');
                }
            }
        }
        catch (err) {
            error('An error occurred');
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, {}), _jsx("div", { className: "py-8 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsx("button", { onClick: () => navigate(isEditing ? `/families/${id}` : '/families'), className: "mb-6 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300", children: "\u2190 Back" }), _jsxs(Card, { bordered: true, className: "p-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: isEditing ? 'Edit Family' : 'Add New Family' }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-8", children: isEditing
                                        ? 'Update the family information'
                                        : 'Fill in the details to register a new family' }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [_jsx(FormField, { label: "First Name", error: errors.firstName?.message, children: _jsx("input", { ...register('firstName', {
                                                    required: 'First name is required',
                                                }), type: "text", placeholder: "Enter first name", className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" }) }), _jsx(FormField, { label: "Last Name", error: errors.lastName?.message, children: _jsx("input", { ...register('lastName', {
                                                    required: 'Last name is required',
                                                }), type: "text", placeholder: "Enter last name", className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" }) }), _jsx(FormField, { label: "Family Size", error: errors.familySize?.message, children: _jsx("input", { ...register('familySize', {
                                                    required: 'Family size is required',
                                                    valueAsNumber: true,
                                                    min: { value: 1, message: 'Must be at least 1' },
                                                }), type: "number", placeholder: "Enter total family size", className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" }) }), _jsx(FormField, { label: "Phone Number", error: errors.phoneNumber?.message, children: _jsx("input", { ...register('phoneNumber'), type: "tel", placeholder: "+216 XX XXX XXX", className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" }) }), _jsx(FormField, { label: "Address", error: errors.address?.message, children: _jsx("input", { ...register('address'), type: "text", placeholder: "Enter address", className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" }) }), _jsxs("div", { className: "flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700", children: [_jsx(Button, { type: "button", onClick: () => navigate(isEditing ? `/families/${id}` : '/families'), variant: "ghost", children: "Cancel" }), _jsx(Button, { type: "submit", disabled: submitting, children: submitting ? 'Saving...' : isEditing ? 'Update Family' : 'Add Family' })] })] })] })] }) })] }));
};
export default CreateEditFamilyPage;
//# sourceMappingURL=CreateEditFamilyPage.js.map