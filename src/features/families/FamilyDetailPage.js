import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Family Detail Page
 * View comprehensive family information
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
const FamilyDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { success, error } = useToast();
    const [family, setFamily] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const fetchFamily = async () => {
            try {
                setLoading(true);
                // Mock family for now - in real app would fetch by ID
                const mockFamily = {
                    id: id || '1',
                    headOfFamily: 'Sample Family',
                    familySize: 5,
                    numberOfMembers: 4,
                    phoneNumber: '+216 99 999 999',
                    address: 'Sample Address',
                    firstName: 'Sample',
                    lastName: 'Family',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                setFamily(mockFamily);
            }
            catch (err) {
                error('Error loading family');
                navigate('/families');
            }
            finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchFamily();
        }
    }, [id, user, navigate, error]);
    const handleDelete = async () => {
        if (!family || !confirm('Delete this family?'))
            return;
        try {
            // deleteFamily would be called here
            success('Family deleted');
            navigate('/families');
        }
        catch (err) {
            error('Error deleting family');
        }
    };
    if (loading) {
        return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, {}), _jsx("div", { className: "py-8 px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "max-w-7xl mx-auto", children: _jsx(Spinner, {}) }) })] }));
    }
    if (!family) {
        return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, {}), _jsx("div", { className: "py-8 px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "max-w-7xl mx-auto", children: _jsxs(Card, { bordered: true, className: "p-8 text-center", children: [_jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: "Family not found" }), _jsx(Button, { onClick: () => navigate('/families'), children: "Back to Families" })] }) }) })] }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, {}), _jsx("div", { className: "py-8 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-6 flex items-center justify-between", children: [_jsx("button", { onClick: () => navigate('/families'), className: "text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300", children: "\u2190 Back to Families" }), _jsxs("div", { className: "flex gap-3", children: [_jsx(Button, { onClick: () => navigate(`/families/${family.id}/edit`), variant: "ghost", children: "Edit" }), _jsx(Button, { onClick: handleDelete, className: "bg-danger hover:bg-danger-600", children: "Delete" })] })] }), _jsxs(Card, { bordered: true, className: "p-8 mb-6", children: [_jsx("div", { className: "mb-6", children: _jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: family.headOfFamily }), _jsxs("p", { className: "text-gray-600 dark:text-gray-400", children: ["Family ID: ", family.id] })] }), _jsx(Badge, { variant: "success", children: "Active" })] }) }), _jsxs("div", { className: "grid md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "p-4 rounded-lg bg-gray-50 dark:bg-gray-800", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Family Size" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: family.familySize || 0 })] }), _jsxs("div", { className: "p-4 rounded-lg bg-gray-50 dark:bg-gray-800", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Members" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: family.numberOfMembers || 0 })] }), _jsxs("div", { className: "p-4 rounded-lg bg-gray-50 dark:bg-gray-800", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Phone" }), _jsx("p", { className: "text-lg font-bold text-gray-900 dark:text-white", children: family.phoneNumber || 'N/A' })] }), _jsxs("div", { className: "p-4 rounded-lg bg-gray-50 dark:bg-gray-800", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Status" }), _jsx("p", { className: "text-lg font-bold text-gray-900 dark:text-white", children: "Active" })] })] })] }), _jsxs(Card, { bordered: true, className: "p-8 mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-6", children: "Contact Information" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Head of Family" }), _jsx("p", { className: "text-gray-900 dark:text-white text-lg", children: family.headOfFamily })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Phone Number" }), _jsx("p", { className: "text-gray-900 dark:text-white", children: family.phoneNumber || 'Not provided' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Address" }), _jsx("p", { className: "text-gray-900 dark:text-white", children: family.address || 'Not provided' })] })] })] }), _jsxs(Card, { bordered: true, className: "p-8 mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-6", children: "Family Details" }), _jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Total Family Size" }), _jsxs("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: [family.familySize || 0, " people"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: "Number of Members" }), _jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: family.numberOfMembers || 0 })] })] }) })] }), _jsxs(Card, { bordered: true, className: "p-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-6", children: "Statistics" }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20", children: [_jsx("p", { className: "text-sm text-primary-600 dark:text-primary-400 mb-1", children: "Family Size" }), _jsx("p", { className: "text-3xl font-bold text-primary-900 dark:text-primary-100", children: family.familySize || 0 })] }), _jsxs("div", { className: "p-4 rounded-lg bg-success-50 dark:bg-success-900/20", children: [_jsx("p", { className: "text-sm text-success-600 dark:text-success-400 mb-1", children: "Members Registered" }), _jsx("p", { className: "text-3xl font-bold text-success-900 dark:text-success-100", children: family.numberOfMembers || 0 })] }), _jsxs("div", { className: "p-4 rounded-lg bg-info-50 dark:bg-info-900/20", children: [_jsx("p", { className: "text-sm text-info-600 dark:text-info-400 mb-1", children: "Status" }), _jsx("p", { className: "text-3xl font-bold text-info-900 dark:text-info-100", children: "Active" })] })] })] })] }) })] }));
};
export default FamilyDetailPage;
//# sourceMappingURL=FamilyDetailPage.js.map