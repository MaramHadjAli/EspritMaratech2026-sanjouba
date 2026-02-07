import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Create/Edit Visit Page
 * Create new or edit existing visit
 */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@hooks/useNotification';
import { visitService } from '@services/visit.service';
import { Card } from '@components/Card';
import { FormField } from '@components/FormField';
import { Button } from '@components/Button';
import Header from '@components/Header';
const CreateEditVisitPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { success, error } = useToast();
    const { register, handleSubmit, formState: { errors }, } = useForm({
        defaultValues: {
            campaignName: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            location: { latitude: 0, longitude: 0 },
            address: '',
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
                const response = await visitService.updateVisit(id, data);
                if (response.success) {
                    success('Visit updated successfully');
                    navigate(`/visits/${id}`);
                }
                else {
                    error('Failed to update visit');
                }
            }
            else {
                const response = await visitService.createVisit(data);
                if (response.success) {
                    success('Visit created successfully');
                    navigate('/visits');
                }
                else {
                    error('Failed to create visit');
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
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, {}), _jsx("div", { className: "py-8 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsx("button", { onClick: () => navigate(isEditing ? `/visits/${id}` : '/visits'), className: "mb-6 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300", children: "\u2190 Back" }), _jsxs(Card, { bordered: true, className: "p-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: isEditing ? 'Edit Visit' : 'Create New Visit' }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-8", children: isEditing
                                        ? 'Update the visit information'
                                        : 'Fill in the details to create a new visit' }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [_jsx(FormField, { label: "Campaign Name", error: errors.campaignName?.message, children: _jsx("input", { ...register('campaignName', {
                                                    required: 'Campaign name is required',
                                                }), type: "text", placeholder: "Enter campaign name", className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" }) }), _jsx(FormField, { label: "Address", error: errors.address?.message, children: _jsx("input", { ...register('address', {
                                                    required: 'Address is required',
                                                }), type: "text", placeholder: "Enter address", className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" }) }), _jsx(FormField, { label: "Description", error: errors.description?.message, children: _jsx("textarea", { ...register('description'), placeholder: "Enter description", rows: 4, className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" }) }), _jsx(FormField, { label: "Visit Date", error: errors.date?.message, children: _jsx("input", { ...register('date'), type: "date", className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" }) }), _jsxs("div", { className: "flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700", children: [_jsx(Button, { type: "button", onClick: () => navigate(isEditing ? `/visits/${id}` : '/visits'), variant: "ghost", children: "Cancel" }), _jsx(Button, { type: "submit", disabled: submitting, children: submitting ? 'Saving...' : isEditing ? 'Update Visit' : 'Create Visit' })] })] })] })] }) })] }));
};
export default CreateEditVisitPage;
//# sourceMappingURL=CreateEditVisitPage.js.map