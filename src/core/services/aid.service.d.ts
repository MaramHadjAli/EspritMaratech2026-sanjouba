/**
 * Aid API Service
 * Handles all aid-related API calls: create, read, update, delete
 */
import { ApiResponse, Aid, AddAidData, PaginatedResponse } from '@types';
export declare const aidService: {
    /**
     * Get all aids with pagination
     */
    getAllAids: (page?: number, limit?: number) => Promise<ApiResponse<PaginatedResponse<Aid>>>;
    /**
     * Get aids for specific family
     */
    getAidsByFamily: (familyId: string) => Promise<ApiResponse<Aid[]>>;
    /**
     * Get aids for specific visit
     */
    getAidsByVisit: (visitId: string) => Promise<ApiResponse<Aid[]>>;
    /**
     * Get single aid by ID
     */
    getAidById: (id: string) => Promise<ApiResponse<Aid>>;
    /**
     * Create new aid record
     */
    createAid: (data: AddAidData) => Promise<ApiResponse<Aid>>;
    /**
     * Update existing aid
     */
    updateAid: (id: string, data: Partial<AddAidData>) => Promise<ApiResponse<Aid>>;
    /**
     * Delete aid record
     */
    deleteAid: (id: string) => Promise<ApiResponse<{
        message: string;
    }>>;
    /**
     * Get aid statistics (dashboard)
     */
    getAidStatistics: (filters?: Record<string, any>) => Promise<ApiResponse<any>>;
    /**
     * Get aid distribution by type
     */
    getAidsDistributionByType: () => Promise<ApiResponse<any>>;
    /**
     * Get aid distribution by region
     */
    getAidsDistributionByRegion: () => Promise<ApiResponse<any>>;
};
//# sourceMappingURL=aid.service.d.ts.map