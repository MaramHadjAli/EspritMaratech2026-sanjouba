/**
 * Dashboard API Service
 * Handles all dashboard/analytics related API calls
 */

import axiosInstance from '../api/axiosInstance'
import { ApiResponse, DashboardStats, RegionalStats } from '@shared/types'

export const dashboardService = {
  /**
   * Get dashboard statistics/KPIs
   */
  getDashboardStats: async (filters?: Record<string, any>): Promise<ApiResponse<DashboardStats>> => {
    const extractData = (payload: any) => payload?.data ?? payload
    const toArray = (value: any) => (Array.isArray(value) ? value : [])
    const getNumberFrom = (item: any, keys: string[]) => {
      for (const key of keys) {
        const value = item?.[key]
        if (typeof value === 'number') {
          return value
        }
      }
      return 0
    }
    const sumBy = (items: any[], keys: string[]) =>
      items.reduce((sum, item) => sum + getNumberFrom(item, keys), 0)

    const [familiesResponse, visitsResponse, aidsResponse] = await Promise.all([
      axiosInstance.get('/dashboard/cities/families', { params: filters }),
      axiosInstance.get('/dashboard/cities/visits', { params: filters }),
      axiosInstance.get('/dashboard/aids/pie', { params: { limit: 100, ...filters } }),
    ])

    const familiesData = toArray(extractData(familiesResponse.data))
    const visitsData = toArray(extractData(visitsResponse.data))
    const aidsData = toArray(extractData(aidsResponse.data))

    const totalFamilies = sumBy(familiesData, ['families', 'familiesCount', 'count', 'value', 'total'])
    const totalVisits = sumBy(visitsData, ['visits', 'visitsCount', 'count', 'value', 'total'])
    const totalAidsDistributed = sumBy(aidsData, ['value', 'amount', 'total', 'count'])
    const totalRegions = familiesData.length

    return {
      success: true,
      data: {
        totalFamilies,
        totalVisits,
        totalAidsDistributed,
        totalRegions,
      },
    }
  },

  /**
   * Get regional statistics
   */
  getRegionalStats: async (region?: string): Promise<ApiResponse<RegionalStats[]>> => {
    const response = await axiosInstance.get('/dashboard/regional-stats', {
      params: { region },
    })
    return response.data
  },

  /**
   * Get aid distribution analytics
   */
  getAidDistribution: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/aid-distribution')
    return response.data
  },

  /**
   * Get coverage evolution over time
   */
  getCoverageEvolution: async (startYear?: number, endYear?: number): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/coverage-evolution', {
      params: { startYear, endYear },
    })
    return response.data
  },

  /**
   * Get heatmap data for families by region
   */
  getHeatmapData: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/heatmap')
    return response.data
  },

  /**
   * Export dashboard report as PDF
   */
  exportDashboardPDF: async (filters?: Record<string, any>): Promise<Blob> => {
    const response = await axiosInstance.get('/dashboard/export/pdf', {
      params: filters,
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * Export dashboard report as Excel
   */
  exportDashboardExcel: async (filters?: Record<string, any>): Promise<Blob> => {
    const response = await axiosInstance.get('/dashboard/export/excel', {
      params: filters,
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * Get top statistics (highlights)
   */
  getTopStats: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/top-stats')
    return response.data
  },
}
