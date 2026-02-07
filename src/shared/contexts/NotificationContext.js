import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from 'react';
export const NotificationContext = createContext(undefined);
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const addNotification = useCallback((notification) => {
        const id = Math.random().toString(36).substring(2);
        const newNotification = { ...notification, id };
        setNotifications(prev => [...prev, newNotification]);
        // Auto-remove after duration (default 5 seconds)
        if (notification.duration !== 0) {
            setTimeout(() => {
                removeNotification(id);
            }, notification.duration || 5000);
        }
        return id;
    }, []);
    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);
    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);
    const value = {
        notifications,
        addNotification,
        removeNotification,
        clearAll,
    };
    return (_jsx(NotificationContext.Provider, { value: value, children: children }));
};
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
//# sourceMappingURL=NotificationContext.js.map