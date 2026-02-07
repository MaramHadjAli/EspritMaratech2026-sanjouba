/**
 * Visit API Service
 * Handles all visit/campaign-related API calls
 */

import axiosInstance from '../api/axiosInstance'
import { ApiResponse, Visit, CreateVisitData, EditVisitData, PaginatedResponse } from '@types'

export const visitService = {
  /**
   * Get all visits with pagination
   */
  getAllVisits: async (page = 1, limit = 20, filters?: Record<string, any>): Promise<ApiResponse<PaginatedResponse<Visit>>> => {
    const response = await axiosInstance.get('/visit', {
      params: { page, limit, ...filters },
    })
    return response.data
  },

  /**
   * Get single visit by ID
   */
  getVisitById: async (id: string): Promise<ApiResponse<Visit>> => {
    const response = await axiosInstance.get(`/visit/${id}`)
    return response.data
  },

  /**
   * Create new visit/campaign
   */
  createVisit: async (data: CreateVisitData): Promise<ApiResponse<Visit>> => {
    const response = await axiosInstance.post('/visit', data)
    return response.data
  },

  /**
   * Update existing visit
   */
  updateVisit: async (id: string, data: Partial<EditVisitData>): Promise<ApiResponse<Visit>> => {
    const response = await axiosInstance.put(`/visit/${id}`, data)
    return response.data
  },

  /**
   * Delete/Archive visit
   */
  deleteVisit: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosInstance.delete(`/visit/${id}`)
    return response.data
  },

  /**
   * Get visits assigned to current user
   */
  getMyVisits: async (): Promise<ApiResponse<Visit[]>> => {
    const response = await axiosInstance.get('/visit/my-visits')
    return response.data
  },

  /**
   * Get upcoming visits
   */
  getUpcomingVisits: async (limit = 5): Promise<ApiResponse<Visit[]>> => {
    const response = await axiosInstance.get('/visit/upcoming', {
      params: { limit },
    })
    return response.data
  },

  /**
   * Get visit by region
   */
  getVisitsByRegion: async (region: string): Promise<ApiResponse<Visit[]>> => {
    const response = await axiosInstance.get(`/visit/region/${region}`)
    return response.data
  },

  /**
   * Join a visit as a team member
   */
  joinVisit: async (visitId: string): Promise<ApiResponse<Visit>> => {
    const response = await axiosInstance.post(`/visit/${visitId}/join`)
    return response.data
  },

  /**
   * Leave a visit
   */
  leaveVisit: async (visitId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosInstance.post(`/visit/${visitId}/leave`)
    return response.data
  },

  /**
   * Complete a visit
   */
  completeVisit: async (visitId: string): Promise<ApiResponse<Visit>> => {
    const response = await axiosInstance.post(`/visit/${visitId}/complete`)
    return response.data
  },
}
