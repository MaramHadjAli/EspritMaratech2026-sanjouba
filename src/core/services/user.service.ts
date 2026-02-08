/**
 * User Service
 * Handles user profile and account management API calls
 */

import axiosInstance from '../api/axiosInstance'
import { User, UpdateUserData, ChangePasswordData } from '@types'

class UserService {
  private baseUrl = '/api/users'

  /**
   * Get current user's active visit
   */
  async getCurrentVisit(): Promise<any> {
    const response = await axiosInstance.get('/user/me/current-visit')
    return response.data
  }

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<User> {
    // TODO: Implement with real API call
    // const response = await fetch(`${this.baseUrl}/${userId}`)
    // return response.json()
    return Promise.resolve({} as User)
  }

  /**
   * Update user profile
   */
  async updateUser(userId: string, data: UpdateUserData): Promise<User> {
    // TODO: Implement with real API call
    // const response = await fetch(`${this.baseUrl}/${userId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // })
    // return response.json()
    return Promise.resolve({} as User)
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: string,
    data: Omit<ChangePasswordData, 'confirmPassword'>
  ): Promise<{ message: string }> {
    // TODO: Implement with real API call
    // const response = await fetch(`${this.baseUrl}/${userId}/change-password`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // })
    // return response.json()
    return Promise.resolve({ message: 'Password changed successfully' })
  }

  /**
   * Upload user avatar/profile picture
   */
  async uploadAvatar(userId: string, file: File): Promise<{ url: string }> {
    // TODO: Implement with real API call using FormData
    // const formData = new FormData()
    // formData.append('file', file)
    // const response = await fetch(`${this.baseUrl}/${userId}/avatar`, {
    //   method: 'POST',
    //   body: formData
    // })
    // return response.json()
    return Promise.resolve({ url: '' })
  }

  /**
   * Search users by username
   */
  async searchUsernames(query: string): Promise<any> {
    const response = await axiosInstance.get('/user/employees/usernames', {
      params: { q: query },
    })
    return response.data
  }

  /**
   * Create employee (admin-only)
   * Uses POST /user endpoint with CreateUserDto
   */
  async createEmployee(data: {
    name: string
    email: string
    password: string
    phone?: string
  }): Promise<any> {
    const response = await axiosInstance.post('/user', data)
    return response.data
  }
}

export const userService = new UserService()
