/**
 * Dashboard API Service
 * Handles all dashboard/analytics related API calls
 */
import { ApiResponse, DashboardStats, RegionalStats } from '@shared/types';
export declare const dashboardService: {
    /**
     * Get dashboard statistics/KPIs
     */
    getDashboardStats: (filters?: Record<string, any>) => Promise<ApiResponse<DashboardStats>>;
    /**
     * Get regional statistics
     */
    getRegionalStats: (region?: string) => Promise<ApiResponse<RegionalStats[]>>;
    /**
     * Get aid distribution analytics
     */
    getAidDistribution: () => Promise<ApiResponse<any>>;
    /**
     * Get coverage evolution over time
     */
    getCoverageEvolution: (startYear?: number, endYear?: number) => Promise<ApiResponse<any>>;
    /**
     * Get heatmap data for families by region
     */
    getHeatmapData: () => Promise<ApiResponse<any>>;
    /**
     * Export dashboard report as PDF
     */
    exportDashboardPDF: (filters?: Record<string, any>) => Promise<Blob>;
    /**
     * Export dashboard report as Excel
     */
    exportDashboardExcel: (filters?: Record<string, any>) => Promise<Blob>;
    /**
     * Get top statistics (highlights)
     */
    getTopStats: () => Promise<ApiResponse<any>>;
};
//# sourceMappingURL=dashboard.service.d.ts.map