/**
 * Location API Service
 * Handles city boundary and geospatial endpoints
 */

import axiosInstance from '../api/axiosInstance'
import { ApiResponse, CityBoundary } from '@shared/types'

export const locationService = {
  /**
   * Get city boundary by name
   */
  getCityBoundary: async (city: string): Promise<ApiResponse<CityBoundary>> => {
    const response = await axiosInstance.get(`/location/boundaries/${encodeURIComponent(city)}`)
    return response.data
  },
}
