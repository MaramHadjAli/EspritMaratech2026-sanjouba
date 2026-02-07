/**
 * Authentication API Service
 * Handles all auth-related API calls: login, signup, password reset, token refresh
 */
import axiosInstance from '../api/axiosInstance';
export const authService = {
    /**
     * Login user with email and password
     */
    login: async (email, password) => {
        const response = await axiosInstance.post('/auth/login', { email, password });
        return response.data;
    },
    /**
     * Register new user
     */
    signup: async (data) => {
        const response = await axiosInstance.post('/auth/signup', data);
        return response.data;
    },
    /**
     * Request password reset via email or phone
     */
    requestPasswordReset: async (contactMethod, value) => {
        const response = await axiosInstance.post('/auth/password-reset/request', {
            contactMethod,
            value,
        });
        return response.data;
    },
    /**
     * Verify reset code and set new password
     */
    resetPassword: async (data) => {
        const response = await axiosInstance.post('/auth/password-reset/confirm', data);
        return response.data;
    },
    /**
     * Refresh access token
     */
    refreshToken: async (refreshToken) => {
        const response = await axiosInstance.post('/auth/refresh', { refreshToken });
        return response.data;
    },
    /**
     * Logout user
     */
    logout: async () => {
        const response = await axiosInstance.post('/auth/logout');
        return response.data;
    },
    /**
     * Get current user profile
     */
    getCurrentUser: async () => {
        const response = await axiosInstance.get('/auth/me');
        return response.data;
    },
    /**
     * Update user profile
     */
    updateProfile: async (id, data) => {
        const response = await axiosInstance.put(`/auth/profile/${id}`, data);
        return response.data;
    },
};
//# sourceMappingURL=auth.service.js.map