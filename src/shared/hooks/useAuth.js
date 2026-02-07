/**
 * useAuth Hook
 * Custom hook for accessing auth context and functions
 */
import { useContext } from 'react';
import { AuthContext } from '@contexts/AuthContext';
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
// Additional auth-related hooks
export const useIsAuthenticated = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated;
};
export const useCurrentUser = () => {
    const { user } = useAuth();
    return user;
};
export const useIsAdmin = () => {
    const { user } = useAuth();
    return user?.role === 'ADMIN';
};
export const useIsEmployee = () => {
    const { user } = useAuth();
    return user?.role === 'EMPLOYEE' || user?.role === 'ADMIN';
};
//# sourceMappingURL=useAuth.js.map