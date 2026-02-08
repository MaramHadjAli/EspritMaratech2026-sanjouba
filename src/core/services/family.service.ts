/**
 * Family API Service
 * Handles all family-related API calls: CRUD operations
 */

import axiosInstance from '../api/axiosInstance'
import { ApiResponse, Family, AddFamilyData, PaginatedResponse } from '@types'

export const familyService = {
  /**
   * Get all family with pagination and filters
   */
  getAllFamilies: async (page = 1, limit = 20, filters?: Record<string, any>): Promise<ApiResponse<PaginatedResponse<Family>>> => {
    const response = await axiosInstance.get('/family', {
      params: { page, limit, ...filters },
    })
    return response.data
  },

  /**
   * Get single family by ID
   */
  getFamilyById: async (id: string): Promise<ApiResponse<Family>> => {
    const response = await axiosInstance.get(`/family/${id}`)
    return response.data
  },

  /**
   * Create new family
   */
  createFamily: async (data: AddFamilyData): Promise<ApiResponse<Family>> => {
    const response = await axiosInstance.post('/family', data)
    return response.data
  },

  /**
   * Update existing family
   */
  updateFamily: async (id: string, data: Partial<Family>): Promise<ApiResponse<Family>> => {
    const response = await axiosInstance.patch(`/family/${id}`, data)
    return response.data
  },

  /**
   * Delete/Archive family
   */
  deleteFamily: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosInstance.delete(`/family/${id}`)
    return response.data
  },

  /**
   * Search family by name, phone, or address
   */
  searchFamilies: async (query: string): Promise<ApiResponse<Family[]>> => {
    const response = await axiosInstance.get('/family/search', {
      params: { q: query },
    })
    return response.data
  },

  /**
   * Get family by region
   */
  getFamiliesByRegion: async (region: string): Promise<ApiResponse<Family[]>> => {
    const response = await axiosInstance.get(`/family/region/${region}`)
    return response.data
  },

  /**
   * Get family visit history
   */
  getFamilyVisitHistory: async (familyId: string): Promise<ApiResponse<any[]>> => {
    const response = await axiosInstance.get(`/family/${familyId}/visits`)
    return response.data
  },

  /**
   * Search family by last name
   */
  searchByLastName: async (query: string): Promise<ApiResponse<Family[]>> => {
    const response = await axiosInstance.get('/family/search/by-lastname', {
      params: { q: query },
    })
    return response.data
  },

  /**
   * Search family by phone number
   */
  searchByPhone: async (query: string): Promise<ApiResponse<Family[]>> => {
    const response = await axiosInstance.get('/family/search/by-phone', {
      params: { q: query },
    })
    return response.data
  },

  /**
   * Get aid recommendations for a family
   */
  getAidRecommendations: async (familyId: string): Promise<ApiResponse<any[]>> => {
    const response = await axiosInstance.get(`/family/${familyId}/aid-recommendation`)
    return response.data
  },

  /**
   * Get family needs catalog
   */
  getNeedCatalog: async (): Promise<ApiResponse<any[]>> => {
    const response = await axiosInstance.get('/family/needs/catalog/list')
    return response.data
  },

  /**
   * Get family needs
   */
  getFamilyNeeds: async (familyId: string): Promise<ApiResponse<any[]>> => {
    const response = await axiosInstance.get(`/family/${familyId}/needs`)
    return response.data
  },

  /**
   * Update/Upsert family needs
   */
  upsertFamilyNeeds: async (familyId: string, needs: any[]): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.patch(`/family/${familyId}/needs`, { needs })
    return response.data
  },
}
