import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * History/Campaigns Page
 * View campaign history and statistics
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
const HistoryPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [visits, setVisits] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('COMPLETED');
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const fetchVisits = async () => {
            try {
                setLoading(true);
                const response = await visitService.getAllVisits(1, 100);
                setVisits(response.data?.items || []);
            }
            catch (error) {
                console.error('Failed to fetch campaigns:', error);
                toast.error('Failed to load campaign history');
            }
            finally {
                setLoading(false);
            }
        };
        fetchVisits();
    }, [user, navigate, toast]);
    const filteredVisits = visits.filter((visit) => {
        const matchesSearch = visit.campaignName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || visit.status === filterStatus;
        return matchesSearch && matchesStatus;
    });
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900", children: _jsx(Spinner, { size: "lg", label: t('common.loading') || 'Loading...' }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, {}), _jsx("div", { className: "py-8 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: "Campaign History" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "View all completed and past campaigns" })] }), _jsx(Card, { bordered: true, className: "p-6 mb-6", children: _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsx("input", { type: "text", placeholder: "Search campaigns...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" }), _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white", children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "COMPLETED", children: "Completed" }), _jsx("option", { value: "CANCELLED", children: "Cancelled" }), _jsx("option", { value: "ACTIVE", children: "Active" })] }), _jsx(Button, { variant: "ghost", onClick: () => {
                                            setSearchTerm('');
                                            setFilterStatus('all');
                                        }, children: "Clear Filters" })] }) }), _jsx("div", { className: "space-y-4", children: filteredVisits.length === 0 ? (_jsxs(Card, { bordered: true, className: "p-12 text-center", children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: "No campaigns found" }), _jsx(Button, { onClick: () => navigate('/visits'), children: "View Active Campaigns" })] })) : (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-transparent" }), filteredVisits.map((visit, idx) => (_jsxs("div", { className: "relative pl-24 pb-8", children: [_jsx("div", { className: "absolute left-2 top-2 w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold", children: idx + 1 }), _jsxs(Card, { bordered: true, className: "p-6 hover:shadow-lg transition-shadow", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: visit.campaignName }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: visit.description })] }), _jsx(Badge, { variant: visit.status === 'COMPLETED' ? 'success' :
                                                                    visit.status === 'CANCELLED' ? 'danger' :
                                                                        'info', children: visit.status })] }), _jsxs("div", { className: "grid md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "\uD83D\uDCC5 Date" }), _jsx("p", { children: visit.startTime })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "\uD83D\uDCCD Location" }), _jsx("p", { children: visit.address })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "\uD83D\uDC65 Participants" }), _jsxs("p", { children: [visit.personCount, " people"] })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66 Families" }), _jsxs("p", { children: [visit.familiesCount, " families"] })] })] }), _jsx("div", { className: "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700", children: _jsx(Button, { size: "sm", variant: "ghost", onClick: () => navigate(`/visits/${visit.id}`), children: "View Details" }) })] })] }, visit.id)))] })) })] }) })] }));
};
export default HistoryPage;
//# sourceMappingURL=HistoryPage.js.map