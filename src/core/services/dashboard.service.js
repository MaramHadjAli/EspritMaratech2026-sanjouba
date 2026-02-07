/**
 * Dashboard API Service
 * Handles all dashboard/analytics related API calls
 */
import axiosInstance from '../api/axiosInstance';
export const dashboardService = {
    /**
     * Get dashboard statistics/KPIs
     */
    getDashboardStats: async (filters) => {
        const response = await axiosInstance.get('/dashboard/stats', {
            params: filters,
        });
        return response.data;
    },
    /**
     * Get regional statistics
     */
    getRegionalStats: async (region) => {
        const response = await axiosInstance.get('/dashboard/regional-stats', {
            params: { region },
        });
        return response.data;
    },
    /**
     * Get aid distribution analytics
     */
    getAidDistribution: async () => {
        const response = await axiosInstance.get('/dashboard/aid-distribution');
        return response.data;
    },
    /**
     * Get coverage evolution over time
     */
    getCoverageEvolution: async (startYear, endYear) => {
        const response = await axiosInstance.get('/dashboard/coverage-evolution', {
            params: { startYear, endYear },
        });
        return response.data;
    },
    /**
     * Get heatmap data for families by region
     */
    getHeatmapData: async () => {
        const response = await axiosInstance.get('/dashboard/heatmap');
        return response.data;
    },
    /**
     * Export dashboard report as PDF
     */
    exportDashboardPDF: async (filters) => {
        const response = await axiosInstance.get('/dashboard/export/pdf', {
            params: filters,
            responseType: 'blob',
        });
        return response.data;
    },
    /**
     * Export dashboard report as Excel
     */
    exportDashboardExcel: async (filters) => {
        const response = await axiosInstance.get('/dashboard/export/excel', {
            params: filters,
            responseType: 'blob',
        });
        return response.data;
    },
    /**
     * Get top statistics (highlights)
     */
    getTopStats: async () => {
        const response = await axiosInstance.get('/dashboard/top-stats');
        return response.data;
    },
};
//# sourceMappingURL=dashboard.service.js.map