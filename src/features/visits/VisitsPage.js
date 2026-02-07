import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Visits List Page
 * Display all visits with filters and search
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
import { visitService } from '@core/services/visit.service';
const VisitsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [visits, setVisits] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const fetchVisits = async () => {
            try {
                setLoading(true);
                const response = await visitService.getAllVisits(1, 50, {});
                setVisits(response.data?.items || []);
            }
            catch (error) {
                console.error('Failed to fetch visits:', error);
                toast.error('Failed to load visits');
            }
            finally {
                setLoading(false);
            }
        };
        fetchVisits();
    }, [user, navigate, toast]);
    const filteredVisits = visits.filter((visit) => {
        const matchesSearch = visit.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            visit.address?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || visit.status === filterStatus;
        return matchesSearch && matchesStatus;
    });
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900", children: _jsx(Spinner, { size: "lg", label: t('common.loading') || 'Loading...' }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, {}), _jsx("div", { className: "py-8 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: "All Visits" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Manage and track all charitable visits" })] }), _jsx(Button, { onClick: () => navigate('/visits/create'), children: "Create New Visit" })] }), _jsx(Card, { bordered: true, className: "p-6 mb-6", children: _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsx("input", { type: "text", placeholder: "Search visits...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" }), _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white", children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "ACTIVE", children: "Active" }), _jsx("option", { value: "COMPLETED", children: "Completed" }), _jsx("option", { value: "CANCELLED", children: "Cancelled" })] }), _jsx(Button, { variant: "ghost", onClick: () => {
                                            setSearchTerm('');
                                            setFilterStatus('all');
                                        }, children: "Clear Filters" })] }) }), _jsx("div", { className: "space-y-4", children: filteredVisits.length === 0 ? (_jsxs(Card, { bordered: true, className: "p-12 text-center", children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: searchTerm || filterStatus !== 'all' ? 'No visits found matching your filters' : 'No visits yet' }), _jsx(Button, { onClick: () => navigate('/visits/create'), children: "Create First Visit" })] })) : (filteredVisits.map((visit) => (_jsx(Card, { bordered: true, className: "p-6 hover:shadow-lg transition-shadow cursor-pointer", onClick: () => navigate(`/visits/${visit.id}`), children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2", children: visit.campaignName }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-3", children: visit.description }), _jsxs("div", { className: "flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400", children: [_jsxs("span", { children: ["\uD83D\uDCC5 ", visit.startTime] }), _jsxs("span", { children: ["\uD83D\uDCCD ", visit.address] }), _jsxs("span", { children: ["\uD83D\uDC65 ", visit.personCount, " participants"] })] })] }), _jsx(Badge, { variant: visit.status === 'COMPLETED' ? 'success' :
                                                visit.status === 'ACTIVE' ? 'success' :
                                                    'warning', children: visit.status })] }) }, visit.id)))) })] }) })] }));
};
export default VisitsPage;
//# sourceMappingURL=VisitsPage.js.map