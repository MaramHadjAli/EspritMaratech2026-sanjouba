import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Home Page
 * Main dashboard for authenticated users
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@hooks/useAuth';
import { useNotification } from '@hooks/useNotification';
import { Button } from '@components/Button';
import { Card } from '@components/Card';
import { Badge } from '@components/Badge';
import { Spinner } from '@components/Spinner';
import Header from '@components/Header';
import { visitService } from '@core/services/visit.service';
import { dashboardService } from '@core/services/dashboard.service';
const HomePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalFamilies: 0,
        totalVisits: 0,
        totalAidDistributed: 0,
        totalRegions: 0,
    });
    const [upcomingVisits, setUpcomingVisits] = useState([]);
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch dashboard stats
                const dashboardData = await dashboardService.getDashboardStats({});
                setStats({
                    totalFamilies: dashboardData.data?.totalFamilies || 0,
                    totalVisits: dashboardData.data?.totalVisits || 0,
                    totalAidDistributed: dashboardData.data?.totalAidsDistributed || 0,
                    totalRegions: dashboardData.data?.totalRegions || 0,
                });
                // Fetch upcoming visits
                const visitsData = await visitService.getUpcomingVisits();
                const mappedVisits = (visitsData.data?.slice(0, 5) || []).map(visit => ({
                    id: visit.id,
                    title: visit.campaignName || 'Visit',
                    date: visit.startTime || new Date().toISOString(),
                    location: visit.address || 'N/A',
                    participants: visit.members?.length || visit.personCount || 0,
                    status: visit.status || 'ACTIVE',
                }));
                setUpcomingVisits(mappedVisits);
            }
            catch (error) {
                console.error('Failed to fetch data:', error);
                addNotification({ type: 'error', message: 'Failed to load dashboard data' });
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, navigate, addNotification]);
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900", children: _jsx(Spinner, { size: "lg", label: t('common.loading') || 'Loading...' }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, {}), _jsx("div", { className: "py-8 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: ["Welcome back, ", user?.fullName || user?.name || 'User', "!"] }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Here's what's happening with your charitable work today." })] }), _jsxs("div", { className: "grid md:grid-cols-4 gap-4 mb-8", children: [_jsx(Button, { onClick: () => navigate('/visits/create'), className: "flex items-center justify-center gap-2", children: "\uD83D\uDCCD Create Visit" }), _jsx(Button, { onClick: () => navigate('/aid/add'), variant: "ghost", className: "flex items-center justify-center gap-2", children: "\uD83D\uDC9D Add Aid" }), _jsx(Button, { onClick: () => navigate('/families/add'), variant: "ghost", className: "flex items-center justify-center gap-2", children: "\uD83D\uDC65 Add Family" }), _jsx(Button, { onClick: () => navigate('/dashboard'), variant: "ghost", className: "flex items-center justify-center gap-2", children: "\uD83D\uDCCA View Dashboard" })] }), _jsxs("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [_jsx(Card, { bordered: true, className: "p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm font-medium", children: "Families Supported" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 dark:text-white mt-2", children: stats.totalFamilies.toLocaleString() })] }), _jsx("div", { className: "text-4xl", children: "\uD83D\uDC65" })] }) }), _jsx(Card, { bordered: true, className: "p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm font-medium", children: "Visits Completed" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 dark:text-white mt-2", children: stats.totalVisits.toLocaleString() })] }), _jsx("div", { className: "text-4xl", children: "\uD83D\uDCCD" })] }) }), _jsx(Card, { bordered: true, className: "p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm font-medium", children: "Aid Distributed (TND)" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 dark:text-white mt-2", children: stats.totalAidDistributed.toLocaleString() })] }), _jsx("div", { className: "text-4xl", children: "\uD83D\uDC9D" })] }) }), _jsx(Card, { bordered: true, className: "p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm font-medium", children: "Active Regions" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 dark:text-white mt-2", children: stats.totalRegions })] }), _jsx("div", { className: "text-4xl", children: "\uD83D\uDDFA\uFE0F" })] }) })] }), _jsxs(Card, { bordered: true, className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "Upcoming Visits" }), _jsx(Button, { onClick: () => navigate('/visits'), size: "sm", variant: "ghost", children: "View All \u2192" })] }), upcomingVisits.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: "No upcoming visits scheduled" }), _jsx(Button, { onClick: () => navigate('/visits/create'), children: "Schedule a Visit" })] })) : (_jsx("div", { className: "space-y-4", children: upcomingVisits.map((visit) => (_jsxs("div", { className: "flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white", children: visit.title }), _jsxs("div", { className: "flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400", children: [_jsxs("span", { children: ["\uD83D\uDCC5 ", visit.date] }), _jsxs("span", { children: ["\uD83D\uDCCD ", visit.location] }), _jsxs("span", { children: ["\uD83D\uDC65 ", visit.participants, " participants"] })] })] }), _jsx("div", { className: "ml-4", children: _jsx(Badge, { variant: "success", children: visit.status }) })] }, visit.id))) }))] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-8 mt-8", children: [_jsxs(Card, { bordered: true, className: "p-6", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 dark:text-white mb-4", children: "My Tasks" }), _jsx("div", { className: "space-y-3", children: [
                                                { title: 'Review pending aid requests', completed: false },
                                                { title: 'Update family information', completed: true },
                                                { title: 'Schedule region visit', completed: false },
                                            ].map((task, idx) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { type: "checkbox", checked: task.completed, readOnly: true, className: "w-5 h-5 rounded" }), _jsx("span", { className: `${task.completed
                                                            ? 'line-through text-gray-400'
                                                            : 'text-gray-900 dark:text-white'}`, children: task.title })] }, idx))) })] }), _jsxs(Card, { bordered: true, className: "p-6", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 dark:text-white mb-4", children: "Team News" }), _jsxs("div", { className: "space-y-3 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900 dark:text-white", children: "New volunteer joined!" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "5 minutes ago" })] }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900 dark:text-white", children: "25 families received aid" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "2 hours ago" })] }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900 dark:text-white", children: "North region visit completed" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Yesterday" })] })] })] })] })] }) })] }));
};
export default HomePage;
//# sourceMappingURL=HomePage.js.map