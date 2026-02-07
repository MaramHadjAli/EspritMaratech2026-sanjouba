import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Families Page
 * Manage family records with CRUD operations
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
import { familyService } from '@core/services/family.service';
const FamiliesPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [families, setFamilies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRegion, setFilterRegion] = useState('all');
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const fetchFamilies = async () => {
            try {
                setLoading(true);
                const response = await familyService.getAllFamilies(1, 50, {});
                setFamilies(response.data?.items || []);
            }
            catch (error) {
                console.error('Failed to fetch families:', error);
                toast.error('Failed to load families');
            }
            finally {
                setLoading(false);
            }
        };
        fetchFamilies();
    }, [user, navigate, toast]);
    const filteredFamilies = families.filter((family) => {
        const matchesSearch = family.headOfFamily?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            family.firstName?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900", children: _jsx(Spinner, { size: "lg", label: t('common.loading') || 'Loading...' }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, {}), _jsx("div", { className: "py-8 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: "Families" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Manage and track all family records" })] }), _jsx(Button, { onClick: () => navigate('/families/add'), children: "Add New Family" })] }), _jsx(Card, { bordered: true, className: "p-6 mb-6", children: _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsx("input", { type: "text", placeholder: "Search families...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" }), _jsxs("select", { value: filterRegion, onChange: (e) => setFilterRegion(e.target.value), className: "px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white", children: [_jsx("option", { value: "all", children: "All Regions" }), _jsx("option", { value: "north", children: "North" }), _jsx("option", { value: "south", children: "South" }), _jsx("option", { value: "east", children: "East" }), _jsx("option", { value: "west", children: "West" }), _jsx("option", { value: "center", children: "Center" })] }), _jsx(Button, { variant: "ghost", onClick: () => {
                                            setSearchTerm('');
                                            setFilterRegion('all');
                                        }, children: "Clear Filters" })] }) }), _jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredFamilies.length === 0 ? (_jsxs(Card, { bordered: true, className: "p-12 text-center md:col-span-2 lg:col-span-3", children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: searchTerm || filterRegion !== 'all' ? 'No families found' : 'No families yet' }), _jsx(Button, { onClick: () => navigate('/families/add'), children: "Add First Family" })] })) : (filteredFamilies.map((family) => (_jsxs(Card, { bordered: true, className: "p-6 hover:shadow-lg transition-shadow cursor-pointer", onClick: () => navigate(`/families/${family.id}`), children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: family.headOfFamily }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: [family.familySize, " members"] })] }), _jsxs(Badge, { variant: "info", children: ["Size: ", family.numberOfMembers] })] }), _jsxs("p", { className: "text-gray-600 dark:text-gray-400", children: ["\uD83D\uDCCD ", family.address] }), _jsxs("p", { className: "text-gray-600 dark:text-gray-400", children: ["\uD83D\uDCF1 ", family.phoneNumber] }), _jsxs("div", { className: "flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700", children: [_jsx(Button, { size: "sm", variant: "ghost", onClick: (e) => {
                                                    e.stopPropagation();
                                                    navigate(`/families/${family.id}/edit`);
                                                }, children: "Edit" }), _jsx(Button, { size: "sm", variant: "ghost", className: "text-danger", onClick: (e) => {
                                                    e.stopPropagation();
                                                    // TODO: Delete family
                                                }, children: "Delete" })] })] }, family.id)))) })] }) })] }));
};
export default FamiliesPage;
//# sourceMappingURL=FamiliesPage.js.map