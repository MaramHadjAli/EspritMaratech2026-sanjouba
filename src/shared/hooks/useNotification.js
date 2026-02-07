/**
 * useNotification Hook
 * Custom hook for accessing notification/toast functionality
 */
import { useContext } from 'react';
import { NotificationContext } from '@contexts/NotificationContext';
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
/**
 * Hook with convenience methods for specific toast types
 */
export const useToast = () => {
    const { addNotification } = useNotification();
    return {
        success: (message, duration) => {
            addNotification({ message, type: 'success', duration });
        },
        error: (message, duration) => {
            addNotification({ message, type: 'error', duration });
        },
        info: (message, duration) => {
            addNotification({ message, type: 'info', duration });
        },
        warning: (message, duration) => {
            addNotification({ message, type: 'warning', duration });
        },
    };
};
//# sourceMappingURL=useNotification.js.map