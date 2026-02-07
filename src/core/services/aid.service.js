/**
 * Aid API Service
 * Handles all aid-related API calls: create, read, update, delete
 */
import axiosInstance from '../api/axiosInstance';
export const aidService = {
    /**
     * Get all aids with pagination
     */
    getAllAids: async (page = 1, limit = 20) => {
        const response = await axiosInstance.get('/aids', {
            params: { page, limit },
        });
        return response.data;
    },
    /**
     * Get aids for specific family
     */
    getAidsByFamily: async (familyId) => {
        const response = await axiosInstance.get(`/aids/family/${familyId}`);
        return response.data;
    },
    /**
     * Get aids for specific visit
     */
    getAidsByVisit: async (visitId) => {
        const response = await axiosInstance.get(`/aids/visit/${visitId}`);
        return response.data;
    },
    /**
     * Get single aid by ID
     */
    getAidById: async (id) => {
        const response = await axiosInstance.get(`/aids/${id}`);
        return response.data;
    },
    /**
     * Create new aid record
     */
    createAid: async (data) => {
        const response = await axiosInstance.post('/aids', data);
        return response.data;
    },
    /**
     * Update existing aid
     */
    updateAid: async (id, data) => {
        const response = await axiosInstance.put(`/aids/${id}`, data);
        return response.data;
    },
    /**
     * Delete aid record
     */
    deleteAid: async (id) => {
        const response = await axiosInstance.delete(`/aids/${id}`);
        return response.data;
    },
    /**
     * Get aid statistics (dashboard)
     */
    getAidStatistics: async (filters) => {
        const response = await axiosInstance.get('/aids/statistics', {
            params: filters,
        });
        return response.data;
    },
    /**
     * Get aid distribution by type
     */
    getAidsDistributionByType: async () => {
        const response = await axiosInstance.get('/aids/distribution/by-type');
        return response.data;
    },
    /**
     * Get aid distribution by region
     */
    getAidsDistributionByRegion: async () => {
        const response = await axiosInstance.get('/aids/distribution/by-region');
        return response.data;
    },
};
//# sourceMappingURL=aid.service.js.map