/**
 * Visit API Service
 * Handles all visit/campaign-related API calls
 */
import axiosInstance from '../api/axiosInstance';
export const visitService = {
    /**
     * Get all visits with pagination
     */
    getAllVisits: async (page = 1, limit = 20, filters) => {
        const response = await axiosInstance.get('/visits', {
            params: { page, limit, ...filters },
        });
        return response.data;
    },
    /**
     * Get single visit by ID
     */
    getVisitById: async (id) => {
        const response = await axiosInstance.get(`/visits/${id}`);
        return response.data;
    },
    /**
     * Create new visit/campaign
     */
    createVisit: async (data) => {
        const response = await axiosInstance.post('/visits', data);
        return response.data;
    },
    /**
     * Update existing visit
     */
    updateVisit: async (id, data) => {
        const response = await axiosInstance.put(`/visits/${id}`, data);
        return response.data;
    },
    /**
     * Delete/Archive visit
     */
    deleteVisit: async (id) => {
        const response = await axiosInstance.delete(`/visits/${id}`);
        return response.data;
    },
    /**
     * Get visits assigned to current user
     */
    getMyVisits: async () => {
        const response = await axiosInstance.get('/visits/my-visits');
        return response.data;
    },
    /**
     * Get upcoming visits
     */
    getUpcomingVisits: async () => {
        const response = await axiosInstance.get('/visits/upcoming');
        return response.data;
    },
    /**
     * Get visit by region
     */
    getVisitsByRegion: async (region) => {
        const response = await axiosInstance.get(`/visits/region/${region}`);
        return response.data;
    },
    /**
     * Join a visit as a team member
     */
    joinVisit: async (visitId) => {
        const response = await axiosInstance.post(`/visits/${visitId}/join`);
        return response.data;
    },
    /**
     * Leave a visit
     */
    leaveVisit: async (visitId) => {
        const response = await axiosInstance.post(`/visits/${visitId}/leave`);
        return response.data;
    },
    /**
     * Complete a visit
     */
    completeVisit: async (visitId) => {
        const response = await axiosInstance.post(`/visits/${visitId}/complete`);
        return response.data;
    },
};
//# sourceMappingURL=visit.service.js.map