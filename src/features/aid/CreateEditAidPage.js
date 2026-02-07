import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Create/Edit Aid Page
 * Create new or edit existing aid
 */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@hooks/useNotification';
import { aidService } from '@services/aid.service';
import { Card } from '@components/Card';
import { FormField } from '@components/FormField';
import { Button } from '@components/Button';
import Header from '@components/Header';
const CreateEditAidPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { success, error } = useToast();
    const { register, handleSubmit, formState: { errors }, } = useForm({
        defaultValues: {
            type: 'FOOD',
            description: '',
            quantity: 1,
        },
    });
    const [submitting, setSubmitting] = useState(false);
    const isEditing = !!id;
    const aidCategories = [
        'FOOD',
        'MEDICAL',
        'EDUCATIONAL',
        'CLOTHING',
        'SHELTER',
        'OTHER',
    ];
    if (!user) {
        navigate('/login');
        return null;
    }
    const onSubmit = async (data) => {
        try {
            setSubmitting(true);
            if (isEditing) {
                const response = await aidService.updateAid(id, data);
                if (response.success) {
                    success('Aid updated successfully');
                    navigate(`/aid/${id}`);
                }
                else {
                    error('Failed to update aid');
                }
            }
            else {
                const response = await aidService.createAid(data);
                if (response.success) {
                    success('Aid created successfully');
                    navigate('/aid');
                }
                else {
                    error('Failed to create aid');
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
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, {}), _jsx("div", { className: "py-8 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsx("button", { onClick: () => navigate(isEditing ? `/aid/${id}` : '/aid'), className: "mb-6 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300", children: "\u2190 Back" }), _jsxs(Card, { bordered: true, className: "p-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: isEditing ? 'Edit Aid' : 'Add New Aid' }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-8", children: isEditing
                                        ? 'Update the aid information'
                                        : 'Fill in the details to add new aid' }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [_jsx(FormField, { label: "Aid Type", error: errors.type?.message, children: _jsxs("select", { ...register('type', {
                                                    required: 'Aid type is required',
                                                }), className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "Select aid category" }), aidCategories.map((cat) => (_jsx("option", { value: cat, children: cat }, cat)))] }) }), _jsx(FormField, { label: "Quantity", error: errors.quantity?.message, children: _jsx("input", { ...register('quantity', {
                                                    required: 'Quantity is required',
                                                    valueAsNumber: true,
                                                    min: { value: 1, message: 'Must be at least 1' },
                                                }), type: "number", placeholder: "Enter quantity", step: "0.01", className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" }) }), _jsx(FormField, { label: "Description", error: errors.description?.message, children: _jsx("textarea", { ...register('description'), placeholder: "Enter description", rows: 4, className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" }) }), _jsxs("div", { className: "flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700", children: [_jsx(Button, { type: "button", onClick: () => navigate(isEditing ? `/aid/${id}` : '/aid'), variant: "ghost", children: "Cancel" }), _jsx(Button, { type: "submit", disabled: submitting, children: submitting ? 'Saving...' : isEditing ? 'Update Aid' : 'Add Aid' })] })] })] })] }) })] }));
};
export default CreateEditAidPage;
//# sourceMappingURL=CreateEditAidPage.js.map