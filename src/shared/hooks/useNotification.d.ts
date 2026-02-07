/**
 * useNotification Hook
 * Custom hook for accessing notification/toast functionality
 */
import { NotificationContextType } from '@types';
export declare const useNotification: () => NotificationContextType;
/**
 * Hook with convenience methods for specific toast types
 */
export declare const useToast: () => {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
};
//# sourceMappingURL=useNotification.d.ts.map