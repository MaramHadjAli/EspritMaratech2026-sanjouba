/**
 * useAuth Hook
 * Custom hook for accessing auth context and functions
 */
import { AuthContextType } from '@types';
export declare const useAuth: () => AuthContextType;
export declare const useIsAuthenticated: () => boolean;
export declare const useCurrentUser: () => import("@types").User | null;
export declare const useIsAdmin: () => boolean;
export declare const useIsEmployee: () => boolean;
//# sourceMappingURL=useAuth.d.ts.map