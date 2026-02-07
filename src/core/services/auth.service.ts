/**
 * Authentication API Service
 * Handles all auth-related API calls: login, signup, password reset, token refresh
 */

import axiosInstance from '../api/axiosInstance'
import { ApiResponse, User, SignupFormData, PasswordResetData } from '@types'

export const authService = {
  /**
   * Login user with email and password
   */
  login: async (email: string, password: string): Promise<ApiResponse<{ token: string; refreshToken: string; user: User }>> => {
    const response = await axiosInstance.post('/auth/login', { email, password })
    return response.data
  },

  /**
   * Register new user
   */
  signup: async (data: SignupFormData): Promise<ApiResponse<{ token: string; refreshToken: string; user: User }>> => {
    const response = await axiosInstance.post('/auth/signup', data)
    return response.data
  },

  /**
   * Request password reset via email or phone
   */
  requestPasswordReset: async (contactMethod: 'email' | 'phone', value: string): Promise<ApiResponse<{ resetId: string }>> => {
    const response = await axiosInstance.post('/auth/password-reset/request', {
      contactMethod,
      value,
    })
    return response.data
  },

  /**
   * Verify reset code and set new password
   */
  resetPassword: async (data: PasswordResetData): Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosInstance.post('/auth/password-reset/confirm', data)
    return response.data
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken: string }>> => {
    const response = await axiosInstance.post('/auth/refresh', { refreshToken })
    return response.data
  },

  /**
   * Logout user
   */
  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosInstance.post('/auth/logout')
    return response.data
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get('/auth/me')
    return response.data
  },

  /**
   * Update user profile
   */
  updateProfile: async (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.put(`/auth/profile/${id}`, data)
    return response.data
  },
}
