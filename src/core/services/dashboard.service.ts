/**
 * Dashboard API Service
 * Handles all dashboard/analytics related API calls
 */

import axiosInstance from '../api/axiosInstance'
import { ApiResponse, DashboardStats } from '@shared/types'

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
   * Visits timeline for a period (months)
   */
  getVisitsTimeline: async (months = 6): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/visits/timeline', {
      params: { months },
    })
    console.log('📊 Visits timeline response:', response.data)
    return response.data
  },

  /**
   * Aid distribution pie
   */
  getAidsPie: async (limit = 6): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/aids/pie', {
      params: { limit },
    })
    console.log('📊 Aids pie response:', response.data)
    return response.data
  },

  /**
   * Families size distribution
   */
  getFamiliesSizeDistribution: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/families/size-distribution')
    console.log('📊 Families size distribution response:', response.data)
    return response.data
  },

  /**
   * Priority families list
   */
  getPriorityFamilies: async (limit = 5): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/ai/priority-families', {
      params: { limit },
    })
    return response.data
  },

  /**
   * City metrics for map
   */
  getCitiesVisits: async (limit = 10): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/cities/visits', {
      params: { limit },
    })
    return response.data
  },

  getCitiesFamilies: async (limit = 10): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/cities/families', {
      params: { limit },
    })
    return response.data
  },

  // Time series endpoints
  getTimeFamilies: async (months = 6): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/time/families', {
      params: { months },
    })
    return response.data
  },

  getTimeVisits: async (months = 6): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/time/visits', {
      params: { months },
    })
    return response.data
  },

  getTimeNeedyComparison: async (months = 6): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/time/needy-comparison', {
      params: { months },
    })
    return response.data
  },

  // Aid endpoints
  getAidsFrequency: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/aids/frequency')
    return response.data
  },

  getAidsTypeBreakdown: async (region?: string, limit = 10): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/aids/type-breakdown', {
      params: { region, limit },
    })
    return response.data
  },

  getAidsTypeBreakdownByRegion: async (limit = 10): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/aids/type-breakdown/by-region', {
      params: { limit },
    })
    return response.data
  },

  getAidsByCityTop: async (city: string, n = 5): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get(`/dashboard/aids/city/${city}/top/${n}`)
    return response.data
  },

  // Family endpoints
  getFamiliesHistogram: async (months = 6): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/families/histogram', {
      params: { months },
    })
    return response.data
  },

  getFamiliesVulnerabilityProfile: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/families/vulnerability-profile')
    return response.data
  },

  getFamiliesCount: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/families/count')
    return response.data
  },

  // Visit endpoints
  getVisitsCompletionRate: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/visits/completion-rate')
    return response.data
  },

  getVisitsCount: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/visits/count')
    return response.data
  },

  // Deposit endpoints
  getDepositsSummary: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/deposits/summary')
    return response.data
  },

  getDepositsHistory: async (depositId: string, limit = 10): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get(`/dashboard/deposits/${depositId}/history`, {
      params: { limit },
    })
    return response.data
  },

  // User endpoints
  getUsersActivity: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/users/activity')
    return response.data
  },

  // AI endpoints
  getAiRiskMap: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/ai/risk-map')
    return response.data
  },

  // Financial endpoints
  getAidsFinancialTotalDistributed: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/aids/financial/total-distributed')
    return response.data
  },

  // Cities endpoints
  getCitiesActiveCount: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/cities/active/count')
    return response.data
  },

  // Heatmap endpoints
  getHeatmapFamilies: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/heatmap/families')
    return response.data
  },

  getHeatmapVisits: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/heatmap/visits')
    return response.data
  },

  getCitiesAidsHeatmap: async (): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.get('/dashboard/cities/aids/heatmap')
    return response.data
  },
}
