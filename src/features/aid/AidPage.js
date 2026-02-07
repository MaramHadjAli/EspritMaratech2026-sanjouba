import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Aid Management Page
 * Manage aid distribution with tabbed interface
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@hooks/useNotification';
import { Button } from '@components/Button';
import { Card } from '@components/Card';
import { Badge } from '@components/Badge';
import { Spinner } from '@components/Spinner';
import Header from '@components/Header';
import { FormField } from '@components/FormField';
import { TextInput } from '@components/TextInput';
import { aidService } from '@core/services/aid.service';
import { familyService } from '@core/services/family.service';
const AidPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('list');
    const [loading, setLoading] = useState(true);
    const [aids, setAids] = useState([]);
    const [families, setFamilies] = useState([]);
    const [formData, setFormData] = useState({
        familyId: '',
        aidType: 'CASH',
        quantity: 1,
        amount: 0,
        description: '',
    });
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch aids
                const aidsResponse = await aidService.getAllAids(1, 50);
                setAids(aidsResponse.data?.items || []);
                // Fetch families
                const familiesResponse = await familyService.getAllFamilies(1, 100);
                setFamilies(familiesResponse.data?.items || []);
            }
            catch (error) {
                console.error('Failed to fetch data:', error);
                toast.error('Failed to load data');
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, navigate, toast]);
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'quantity' || name === 'amount' ? parseFloat(value) : value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.familyId)
            newErrors.familyId = 'Family is required';
        if (!formData.aidType)
            newErrors.aidType = 'Aid type is required';
        if (formData.quantity <= 0)
            newErrors.quantity = 'Quantity must be greater than 0';
        if (formData.amount <= 0)
            newErrors.amount = 'Amount must be greater than 0';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleAddAid = async (e) => {
        e.preventDefault();
        if (!validateForm())
            return;
        try {
            await aidService.createAid({
                familyId: formData.familyId,
                type: formData.aidType,
                quantity: formData.quantity,
                unit: formData.aidType,
                description: formData.description,
            });
            toast.success('Aid added successfully!');
            setFormData({
                familyId: '',
                aidType: 'CASH',
                quantity: 1,
                amount: 0,
                description: '',
            });
            setActiveTab('list');
        }
        catch (error) {
            console.error('Failed to add aid:', error);
            toast.error('Failed to add aid');
        }
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900", children: _jsx(Spinner, { size: "lg", label: t('common.loading') || 'Loading...' }) }));
    }
    const tabs = [
        { id: 'list', label: 'Aid Distribution' },
        { id: 'add', label: 'Add Aid' },
        { id: 'statistics', label: 'Statistics' },
    ];
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, {}), _jsx("div", { className: "py-8 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: "Aid Management" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Manage and track aid distribution" })] }), _jsx(Card, { bordered: true, className: "mb-6", children: _jsx("div", { className: "flex overflow-x-auto", children: tabs.map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab.id), className: `px-6 py-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`, children: tab.label }, tab.id))) }) }), activeTab === 'list' && (_jsx("div", { className: "space-y-4", children: aids.length === 0 ? (_jsxs(Card, { bordered: true, className: "p-12 text-center", children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: "No aid distribution records yet" }), _jsx(Button, { onClick: () => setActiveTab('add'), children: "Add First Aid Distribution" })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-100 dark:bg-gray-800", children: [_jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white", children: "Date" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white", children: "Type" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white", children: "Amount" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white", children: "Quantity" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white", children: "Status" })] }) }), _jsx("tbody", { children: aids.map((aid) => (_jsxs("tr", { className: "border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800", children: [_jsx("td", { className: "px-6 py-3 text-gray-900 dark:text-white", children: aid.addedAt || 'N/A' }), _jsx("td", { className: "px-6 py-3 text-gray-900 dark:text-white", children: aid.type }), _jsx("td", { className: "px-6 py-3 text-gray-900 dark:text-white", children: aid.unit }), _jsx("td", { className: "px-6 py-3 text-gray-900 dark:text-white", children: aid.quantity }), _jsx("td", { className: "px-6 py-3", children: _jsx(Badge, { variant: "success", children: "Distributed" }) })] }, aid.id))) })] }) })) })), activeTab === 'add' && (_jsxs(Card, { bordered: true, className: "p-8 max-w-2xl", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-6", children: "Add New Aid Distribution" }), Object.keys(errors).length > 0 && (_jsx("div", { className: "mb-6 p-4 rounded-lg bg-danger-50 dark:bg-danger-900 border border-danger-200 dark:border-danger-800", children: _jsx("p", { className: "text-sm text-danger font-medium", children: "Please fix the errors below" }) })), _jsxs("form", { onSubmit: handleAddAid, className: "space-y-6", children: [_jsx(FormField, { label: "Family", error: errors.familyId, required: true, children: _jsxs("select", { name: "familyId", value: formData.familyId, onChange: handleFormChange, className: "w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white", children: [_jsx("option", { value: "", children: "Select a family" }), families.map((family) => (_jsxs("option", { value: family.id, children: [family.headOfFamily, " - ", family.familySize] }, family.id)))] }) }), _jsx(FormField, { label: "Aid Type", error: errors.aidType, required: true, children: _jsxs("select", { name: "aidType", value: formData.aidType, onChange: handleFormChange, className: "w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white", children: [_jsx("option", { value: "CASH", children: "Cash" }), _jsx("option", { value: "FOOD", children: "Food" }), _jsx("option", { value: "CLOTHING", children: "Clothing" }), _jsx("option", { value: "MEDICAL", children: "Medical" }), _jsx("option", { value: "EDUCATION", children: "Education" })] }) }), _jsx(FormField, { label: "Amount (TND)", error: errors.amount, required: true, children: _jsx(TextInput, { name: "amount", type: "number", value: formData.amount, onChange: handleFormChange, placeholder: "0.00" }) }), _jsx(FormField, { label: "Quantity", error: errors.quantity, required: true, children: _jsx(TextInput, { name: "quantity", type: "number", value: formData.quantity, onChange: handleFormChange, placeholder: "1" }) }), _jsx(FormField, { label: "Description", error: errors.description, children: _jsx(TextInput, { name: "description", value: formData.description, onChange: handleFormChange, placeholder: "Additional notes..." }) }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx(Button, { type: "submit", fullWidth: true, children: "Add Aid" }), _jsx(Button, { type: "button", variant: "ghost", fullWidth: true, onClick: () => setActiveTab('list'), children: "Cancel" })] })] })] })), activeTab === 'statistics' && (_jsxs("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsxs(Card, { bordered: true, className: "p-6", children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm font-medium", children: "Total Aids Distributed" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 dark:text-white mt-2", children: aids.length })] }), _jsxs(Card, { bordered: true, className: "p-6", children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm font-medium", children: "Total Amount (TND)" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 dark:text-white mt-2", children: aids.reduce((sum, aid) => sum + (aid.quantity || 0), 0).toLocaleString() })] }), _jsxs(Card, { bordered: true, className: "p-6", children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm font-medium", children: "Families Helped" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 dark:text-white mt-2", children: new Set(aids.map((a) => a.familyId)).size })] }), _jsxs(Card, { bordered: true, className: "p-6 md:col-span-2 lg:col-span-3", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: "Top Aid Types" }), _jsx("div", { className: "space-y-2", children: ['CASH', 'FOOD', 'CLOTHING', 'MEDICAL', 'EDUCATION'].map((type) => {
                                                const count = aids.filter((a) => a.type === type).length;
                                                return (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: type }), _jsxs("span", { className: "font-semibold text-gray-900 dark:text-white", children: [count, " (", Math.round((count / aids.length) * 100), "%)"] })] }, type));
                                            }) })] })] }))] }) })] }));
};
export default AidPage;
//# sourceMappingURL=AidPage.js.map