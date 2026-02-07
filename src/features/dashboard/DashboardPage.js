import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Dashboard Page
 * Analytics and statistics overview
 */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@hooks/useNotification';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/Button';
import { Card } from '@components/Card';
import { Badge } from '@components/Badge';
import { Spinner } from '@components/Spinner';
import Header from '@components/Header';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardService } from '@core/services/dashboard.service';
const DashboardPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        totalFamilies: 0,
        totalVisits: 0,
        totalAidsDistributed: 0,
        totalRegions: 0,
        visitsEvolution: [],
        aidDistribution: [],
        regionalStats: [],
    });
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await dashboardService.getDashboardStats({});
                if (response.data) {
                    setData(response.data);
                }
            }
            catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                toast.error('Failed to load dashboard data');
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, navigate, toast]);
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900", children: _jsx(Spinner, { size: "lg", label: t('common.loading') || 'Loading...' }) }));
    }
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, {}), _jsx("div", { className: "py-8 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: "Analytics Dashboard" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Overview of your charitable activities and statistics" })] }), _jsxs("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [_jsx(Card, { bordered: true, className: "p-6", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm font-medium", children: "Total Families" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 dark:text-white mt-2", children: data.totalFamilies.toLocaleString() }), _jsx(Badge, { variant: "success", className: "mt-3", children: "\u2191 12% vs last month" })] }) }) }), _jsx(Card, { bordered: true, className: "p-6", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm font-medium", children: "Total Visits" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 dark:text-white mt-2", children: data.totalVisits.toLocaleString() }), _jsx(Badge, { variant: "success", className: "mt-3", children: "\u2191 8% vs last month" })] }) }) }), _jsx(Card, { bordered: true, className: "p-6", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm font-medium", children: "Aid Distributed (TND)" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 dark:text-white mt-2", children: data.totalAidsDistributed.toLocaleString() }), _jsx(Badge, { variant: "info", className: "mt-3", children: "~15K per region" })] }) }) }), _jsx(Card, { bordered: true, className: "p-6", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm font-medium", children: "Active Regions" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 dark:text-white mt-2", children: data.totalRegions }), _jsx(Badge, { variant: "warning", className: "mt-3", children: "2 regions pending" })] }) }) })] }), _jsxs("div", { className: "grid lg:grid-cols-2 gap-8 mb-8", children: [_jsxs(Card, { bordered: true, className: "p-6", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 dark:text-white mb-4", children: "Visits Evolution" }), data.visitsEvolution && data.visitsEvolution.length > 0 ? (_jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: data.visitsEvolution, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb" }), _jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "visits", stroke: "#3b82f6", strokeWidth: 2, name: "Visits" })] }) })) : (_jsx("div", { className: "h-300 flex items-center justify-center text-gray-500", children: "No data available" }))] }), _jsxs(Card, { bordered: true, className: "p-6", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 dark:text-white mb-4", children: "Aid Distribution by Type" }), data.aidDistribution && data.aidDistribution.length > 0 ? (_jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: data.aidDistribution, cx: "50%", cy: "50%", labelLine: false, label: ({ name, value }) => `${name}: ${value}`, outerRadius: 80, fill: "#8884d8", dataKey: "value", children: data.aidDistribution?.map((entry, index) => (_jsx(Cell, { fill: colors[index % colors.length] }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) })) : (_jsx("div", { className: "h-300 flex items-center justify-center text-gray-500", children: "No data available" }))] })] }), _jsxs(Card, { bordered: true, className: "p-6", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 dark:text-white mb-4", children: "Regional Statistics" }), data.regionalStats && data.regionalStats.length > 0 ? (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 dark:border-gray-700", children: [_jsx("th", { className: "text-left text-sm font-semibold text-gray-900 dark:text-white py-3", children: "Region" }), _jsx("th", { className: "text-left text-sm font-semibold text-gray-900 dark:text-white py-3", children: "Families" }), _jsx("th", { className: "text-left text-sm font-semibold text-gray-900 dark:text-white py-3", children: "Visits" }), _jsx("th", { className: "text-left text-sm font-semibold text-gray-900 dark:text-white py-3", children: "Status" })] }) }), _jsx("tbody", { children: data.regionalStats?.map((stat, idx) => (_jsxs("tr", { className: "border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800", children: [_jsx("td", { className: "py-3 text-gray-900 dark:text-white", children: stat.region }), _jsx("td", { className: "py-3 text-gray-600 dark:text-gray-400", children: stat.families.toLocaleString() }), _jsx("td", { className: "py-3 text-gray-600 dark:text-gray-400", children: stat.visits.toLocaleString() }), _jsx("td", { className: "py-3", children: _jsx(Badge, { variant: stat.visits > 50 ? 'success' : 'warning', children: stat.visits > 50 ? 'Active' : 'Pending' }) })] }, idx))) })] }) })) : (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No regional data available" }))] }), _jsxs("div", { className: "flex gap-4 mt-8", children: [_jsx(Button, { onClick: () => navigate('/visits'), children: "View All Visits" }), _jsx(Button, { variant: "ghost", onClick: () => navigate('/home'), children: "Back to Home" })] })] }) })] }));
};
export default DashboardPage;
//# sourceMappingURL=DashboardPage.js.map