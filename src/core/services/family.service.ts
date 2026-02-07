/**
 * Family API Service
 * Handles all family-related API calls: CRUD operations
 */

import axiosInstance from '../api/axiosInstance'
import { ApiResponse, Family, AddFamilyData, PaginatedResponse } from '@types'

export const familyService = {
  /**
   * Get all families with pagination and filters
   */
  getAllFamilies: async (page = 1, limit = 20, filters?: Record<string, any>): Promise<ApiResponse<PaginatedResponse<Family>>> => {
    const response = await axiosInstance.get('/families', {
      params: { page, limit, ...filters },
    })
    return response.data
  },

  /**
   * Get single family by ID
   */
  getFamilyById: async (id: string): Promise<ApiResponse<Family>> => {
    const response = await axiosInstance.get(`/families/${id}`)
    return response.data
  },

  /**
   * Create new family
   */
  createFamily: async (data: AddFamilyData): Promise<ApiResponse<Family>> => {
    const response = await axiosInstance.post('/families', data)
    return response.data
  },

  /**
   * Update existing family
   */
  updateFamily: async (id: string, data: Partial<Family>): Promise<ApiResponse<Family>> => {
    const response = await axiosInstance.put(`/families/${id}`, data)
    return response.data
  },

  /**
   * Delete/Archive family
   */
  deleteFamily: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosInstance.delete(`/families/${id}`)
    return response.data
  },

  /**
   * Search families by name, phone, or address
   */
  searchFamilies: async (query: string): Promise<ApiResponse<Family[]>> => {
    const response = await axiosInstance.get('/families/search', {
      params: { q: query },
    })
    return response.data
  },

  /**
   * Get families by region
   */
  getFamiliesByRegion: async (region: string): Promise<ApiResponse<Family[]>> => {
    const response = await axiosInstance.get(`/families/region/${region}`)
    return response.data
  },

  /**
   * Get family visit history
   */
  getFamilyVisitHistory: async (familyId: string): Promise<ApiResponse<any[]>> => {
    const response = await axiosInstance.get(`/families/${familyId}/visits`)
    return response.data
  },
}
