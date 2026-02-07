import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Aid Detail Page
 * View comprehensive aid information
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@hooks/useNotification';
import { aidService } from '@services/aid.service';
import { Spinner } from '@components/Spinner';
import { Card } from '@components/Card';
import { Badge } from '@components/Badge';
import { Button } from '@components/Button';
import Header from '@components/Header';
const AidDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { success, error } = useToast();
    const [aid, setAid] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const fetchAid = async () => {
            try {
                setLoading(true);
                // Mock aid for now - in real app would fetch by ID
                setAid({
                    id: id || '1',
                    familyId: '',
                    type: 'FOOD',
                    quantity: 100,
                    unit: 'kg',
                    description: 'Sample aid',
                    addedAt: new Date().toISOString(),
                });
            }
            catch (err) {
                error('Error loading aid');
                navigate('/aid');
            }
            finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchAid();
        }
    }, [id, user, navigate, error]);
    const handleDelete = async () => {
        if (!aid || !confirm('Delete this aid?'))
            return;
        try {
            const response = await aidService.deleteAid(aid.id);
            if (response.success) {
                success('Aid deleted');
                navigate('/aid');
            }
            else {
                error('Failed to delete aid');
            }
        }
        catch (err) {
            error('Error deleting aid');
        }
    };
    if (loading) {
        return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, {}), _jsx("div", { className: "py-8 px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "max-w-7xl mx-auto", children: _jsx(Spinner, {}) }) })] }));
    }
    if (!aid) {
        return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, {}), _jsx("div", { className: "py-8 px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "max-w-7xl mx-auto", children: _jsxs(Card, { bordered: true, className: "p-8 text-center", children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: "Aid not found" }), _jsx(Button, { onClick: () => navigate('/aid'), children: "Back to Aid" })] }) }) })] }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, {}), _jsx("div", { className: "py-8 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-6 flex items-center justify-between", children: [_jsx("button", { onClick: () => navigate('/aid'), className: "text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300", children: "\u2190 Back to Aid" }), _jsxs("div", { className: "flex gap-3", children: [_jsx(Button, { onClick: () => navigate(`/aid/${aid.id}/edit`), variant: "ghost", children: "Edit" }), _jsx(Button, { onClick: handleDelete, className: "bg-danger hover:bg-danger-600", children: "Delete" })] })] }), _jsxs(Card, { bordered: true, className: "p-8 mb-6", children: [_jsx("div", { className: "mb-6", children: _jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: aid.type }), _jsxs("p", { className: "text-gray-600 dark:text-gray-400", children: ["Aid ID: ", aid.id] })] }), _jsx(Badge, { variant: "success", children: "Distributed" })] }) }), _jsxs("div", { className: "grid md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "p-4 rounded-lg bg-gray-50 dark:bg-gray-800", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Quantity" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: aid.quantity })] }), _jsxs("div", { className: "p-4 rounded-lg bg-gray-50 dark:bg-gray-800", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Unit" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: aid.unit })] }), _jsxs("div", { className: "p-4 rounded-lg bg-gray-50 dark:bg-gray-800", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Type" }), _jsx("p", { className: "text-lg font-bold text-gray-900 dark:text-white capitalize", children: aid.type?.toLowerCase() })] }), _jsxs("div", { className: "p-4 rounded-lg bg-gray-50 dark:bg-gray-800", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Date Added" }), _jsx("p", { className: "text-lg font-bold text-gray-900 dark:text-white", children: new Date(aid.addedAt || '').toLocaleDateString() })] })] })] }), _jsxs(Card, { bordered: true, className: "p-8 mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-6", children: "Aid Information" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Aid Type" }), _jsx("p", { className: "text-gray-900 dark:text-white text-lg capitalize", children: aid.type?.toLowerCase() })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Quantity" }), _jsxs("p", { className: "text-gray-900 dark:text-white", children: [aid.quantity, " ", aid.unit] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Description" }), _jsx("p", { className: "text-gray-900 dark:text-white", children: aid.description || 'No description provided' })] }), _jsxs("div", { className: "pt-4 border-t border-gray-200 dark:border-gray-700", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Added Date" }), _jsx("p", { className: "text-gray-900 dark:text-white", children: new Date(aid.addedAt || '').toLocaleString() })] })] })] }), _jsxs(Card, { bordered: true, className: "p-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-6", children: "Details" }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20", children: [_jsx("p", { className: "text-sm text-primary-600 dark:text-primary-400 mb-1", children: "Total Quantity" }), _jsx("p", { className: "text-3xl font-bold text-primary-900 dark:text-primary-100", children: aid.quantity })] }), _jsxs("div", { className: "p-4 rounded-lg bg-success-50 dark:bg-success-900/20", children: [_jsx("p", { className: "text-sm text-success-600 dark:text-success-400 mb-1", children: "Unit Type" }), _jsx("p", { className: "text-3xl font-bold text-success-900 dark:text-success-100", children: aid.unit })] }), _jsxs("div", { className: "p-4 rounded-lg bg-info-50 dark:bg-info-900/20", children: [_jsx("p", { className: "text-sm text-info-600 dark:text-info-400 mb-1", children: "Aid Type" }), _jsx("p", { className: "text-3xl font-bold text-info-900 dark:text-info-100 capitalize", children: aid.type?.toLowerCase() })] })] })] })] }) })] }));
};
export default AidDetailPage;
//# sourceMappingURL=AidDetailPage.js.map