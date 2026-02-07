/**
 * Authentication API Service
 * Handles all auth-related API calls: login, signup, password reset, token refresh
 */
import { ApiResponse, User, SignupFormData, PasswordResetData } from '@types';
export declare const authService: {
    /**
     * Login user with email and password
     */
    login: (email: string, password: string) => Promise<ApiResponse<{
        token: string;
        refreshToken: string;
        user: User;
    }>>;
    /**
     * Register new user
     */
    signup: (data: SignupFormData) => Promise<ApiResponse<{
        token: string;
        refreshToken: string;
        user: User;
    }>>;
    /**
     * Request password reset via email or phone
     */
    requestPasswordReset: (contactMethod: "email" | "phone", value: string) => Promise<ApiResponse<{
        resetId: string;
    }>>;
    /**
     * Verify reset code and set new password
     */
    resetPassword: (data: PasswordResetData) => Promise<ApiResponse<{
        message: string;
    }>>;
    /**
     * Refresh access token
     */
    refreshToken: (refreshToken: string) => Promise<ApiResponse<{
        token: string;
        refreshToken: string;
    }>>;
    /**
     * Logout user
     */
    logout: () => Promise<ApiResponse<{
        message: string;
    }>>;
    /**
     * Get current user profile
     */
    getCurrentUser: () => Promise<ApiResponse<User>>;
    /**
     * Update user profile
     */
    updateProfile: (id: string, data: Partial<User>) => Promise<ApiResponse<User>>;
};
//# sourceMappingURL=auth.service.d.ts.map