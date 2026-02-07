import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Visit Detail Page
 * View comprehensive visit information
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@hooks/useNotification';
import { Spinner } from '@components/Spinner';
import { Card } from '@components/Card';
import { Badge } from '@components/Badge';
import { Button } from '@components/Button';
import Header from '@components/Header';
const VisitDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { success, error } = useToast();
    const [visit, setVisit] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const fetchVisit = async () => {
            try {
                setLoading(true);
                // Mock visit for now - in real app would fetch by ID
                const mockVisit = {
                    id: id || '1',
                    campaignName: 'Sample Campaign',
                    address: 'Sample Address',
                    description: 'Sample description',
                    personCount: 10,
                    familiesCount: 3,
                };
                setVisit(mockVisit);
            }
            catch (err) {
                error('Error loading visit');
                navigate('/visits');
            }
            finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchVisit();
        }
    }, [id, user, navigate, error]);
    const handleDelete = async () => {
        if (!visit || !confirm('Delete this visit?'))
            return;
        try {
            // Note: deleteVisit would be called here
            success('Visit deleted');
            navigate('/visits');
        }
        catch (err) {
            error('Error deleting visit');
        }
    };
    if (loading) {
        return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, {}), _jsx("div", { className: "py-8 px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "max-w-7xl mx-auto", children: _jsx(Spinner, {}) }) })] }));
    }
    if (!visit) {
        return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, {}), _jsx("div", { className: "py-8 px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "max-w-7xl mx-auto", children: _jsxs(Card, { bordered: true, className: "p-8 text-center", children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: "Visit not found" }), _jsx(Button, { onClick: () => navigate('/visits'), children: "Back to Visits" })] }) }) })] }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, {}), _jsx("div", { className: "py-8 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-6 flex items-center justify-between", children: [_jsx("button", { onClick: () => navigate('/visits'), className: "text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300", children: "\u2190 Back to Visits" }), _jsxs("div", { className: "flex gap-3", children: [_jsx(Button, { onClick: () => navigate(`/visits/${visit.id}/edit`), variant: "ghost", children: "Edit" }), _jsx(Button, { onClick: handleDelete, className: "bg-danger hover:bg-danger-600", children: "Delete" })] })] }), _jsxs(Card, { bordered: true, className: "p-8 mb-6", children: [_jsx("div", { className: "mb-6", children: _jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: visit.campaignName }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: visit.address })] }), _jsx(Badge, { variant: visit.status === 'ACTIVE'
                                                    ? 'success'
                                                    : visit.status === 'COMPLETED'
                                                        ? 'info'
                                                        : 'warning', children: visit.status })] }) }), _jsxs("div", { className: "grid md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "p-4 rounded-lg bg-gray-50 dark:bg-gray-800", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Families" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: visit.familiesCount || 0 })] }), _jsxs("div", { className: "p-4 rounded-lg bg-gray-50 dark:bg-gray-800", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "People" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: visit.personCount })] }), _jsxs("div", { className: "p-4 rounded-lg bg-gray-50 dark:bg-gray-800", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Date" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "N/A" })] }), _jsxs("div", { className: "p-4 rounded-lg bg-gray-50 dark:bg-gray-800", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Duration" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "N/A" })] })] })] }), _jsxs(Card, { bordered: true, className: "p-8 mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-6", children: "Details" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Campaign Name" }), _jsx("p", { className: "text-gray-900 dark:text-white", children: visit.campaignName })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Address" }), _jsx("p", { className: "text-gray-900 dark:text-white", children: visit.address })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Description" }), _jsx("p", { className: "text-gray-900 dark:text-white", children: visit.description || 'No description provided' })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Visit Date" }), _jsx("p", { className: "text-gray-900 dark:text-white", children: "N/A" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Location" }), _jsx("p", { className: "text-gray-900 dark:text-white", children: visit.address || 'Not specified' })] })] })] })] }), _jsxs(Card, { bordered: true, className: "p-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-6", children: "Statistics" }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20", children: [_jsx("p", { className: "text-sm text-primary-600 dark:text-primary-400 mb-1", children: "Total Families" }), _jsx("p", { className: "text-3xl font-bold text-primary-900 dark:text-primary-100", children: visit.familiesCount || 0 })] }), _jsxs("div", { className: "p-4 rounded-lg bg-success-50 dark:bg-success-900/20", children: [_jsx("p", { className: "text-sm text-success-600 dark:text-success-400 mb-1", children: "Total People" }), _jsx("p", { className: "text-3xl font-bold text-success-900 dark:text-success-100", children: visit.personCount })] }), _jsxs("div", { className: "p-4 rounded-lg bg-info-50 dark:bg-info-900/20", children: [_jsx("p", { className: "text-sm text-info-600 dark:text-info-400 mb-1", children: "Status" }), _jsx("p", { className: "text-3xl font-bold text-info-900 dark:text-info-100 capitalize", children: visit.status?.toLowerCase() })] })] })] })] }) })] }));
};
export default VisitDetailPage;
//# sourceMappingURL=VisitDetailPage.js.map