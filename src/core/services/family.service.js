/**
 * Family API Service
 * Handles all family-related API calls: CRUD operations
 */
import axiosInstance from '../api/axiosInstance';
export const familyService = {
    /**
     * Get all families with pagination and filters
     */
    getAllFamilies: async (page = 1, limit = 20, filters) => {
        const response = await axiosInstance.get('/families', {
            params: { page, limit, ...filters },
        });
        return response.data;
    },
    /**
     * Get single family by ID
     */
    getFamilyById: async (id) => {
        const response = await axiosInstance.get(`/families/${id}`);
        return response.data;
    },
    /**
     * Create new family
     */
    createFamily: async (data) => {
        const response = await axiosInstance.post('/families', data);
        return response.data;
    },
    /**
     * Update existing family
     */
    updateFamily: async (id, data) => {
        const response = await axiosInstance.put(`/families/${id}`, data);
        return response.data;
    },
    /**
     * Delete/Archive family
     */
    deleteFamily: async (id) => {
        const response = await axiosInstance.delete(`/families/${id}`);
        return response.data;
    },
    /**
     * Search families by name, phone, or address
     */
    searchFamilies: async (query) => {
        const response = await axiosInstance.get('/families/search', {
            params: { q: query },
        });
        return response.data;
    },
    /**
     * Get families by region
     */
    getFamiliesByRegion: async (region) => {
        const response = await axiosInstance.get(`/families/region/${region}`);
        return response.data;
    },
    /**
     * Get family visit history
     */
    getFamilyVisitHistory: async (familyId) => {
        const response = await axiosInstance.get(`/families/${familyId}/visits`);
        return response.data;
    },
};
//# sourceMappingURL=family.service.js.map