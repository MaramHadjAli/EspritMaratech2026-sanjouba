/**
 * Aid API Service
 * Handles all aid-related API calls: create, read, update, delete
 */

import axiosInstance from '../api/axiosInstance'
import { ApiResponse, Aid, AddAidData, PaginatedResponse } from '@types'

export const aidService = {
  /**
   * Get all aids with pagination
   */
  getAllAids: async (page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Aid>>> => {
    const response = await axiosInstance.get('/aids', {
      params: { page, limit },
    })
    return response.data
  },

  /**
   * Get aids for specific family
   */
  getAidsByFamily: async (familyId: string): Promise<ApiResponse<Aid[]>> => {
    const response = await axiosInstance.get(`/aids/family/${familyId}`)
    return response.data
  },

  /**
   * Get aids for specific visit
   */
  getAidsByVisit: async (visitId: string): Promise<ApiResponse<Aid[]>> => {
    const response = await axiosInstance.get(`/aids/visit/${visitId}`)
    return response.data
  },

  /**
   * Get single aid by ID
   */
  getAidById: async (id: string): Promise<ApiResponse<Aid>> => {
    const response = await axiosInstance.get(`/aids/${id}`)
    return response.data
  },

  /**
   * Create new aid record
   */
  createAid: async (data: AddAidData): Promise<ApiResponse<Aid>> => {
    const response = await axiosInstance.post('/aids', data)
    return response.data
  },

  /**
   * Update existing aid
   */
  updateAid: async (id: string, data: Partial<AddAidData>): Promise<ApiResponse<Aid>> => {
    const response = await axiosInstance.patch(`/aids/${id}`, data)
    return response.data
  },

  /**
   * Delete aid record
   */
  deleteAid: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosInstance.delete(`/aids/${id}`)
    return response.data
  },

  /**
   * Get aid statistics (dashboard)
   */
  getAidStatistics: async (filters?: Record<string, any>): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/aids/statistics', {
      params: filters,
    })
    return response.data
  },

  /**
   * Get aid distribution by type
   */
  getAidsDistributionByType: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/aids/distribution/by-type')
    return response.data
  },

  /**
   * Get aid distribution by region
   */
  getAidsDistributionByRegion: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/aids/distribution/by-region')
    return response.data
  },

  /**
   * Search aids by name or description
   */
  searchAids: async (query: string): Promise<ApiResponse<Aid[]>> => {
    const response = await axiosInstance.get('/aids/search', {
      params: { q: query },
    })
    return response.data
  },

  /**
   * Find all aids with optional search filter
   */
  findAll: async (search?: string): Promise<ApiResponse<Aid[]>> => {
    const response = await axiosInstance.get('/aid', {
      params: search ? { search } : {},
    })
    return response.data
  },
}
