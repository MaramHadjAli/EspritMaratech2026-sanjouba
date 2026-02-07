/**
 * Family API Service
 * Handles all family-related API calls: CRUD operations
 */
import { ApiResponse, Family, AddFamilyData, PaginatedResponse } from '@types';
export declare const familyService: {
    /**
     * Get all families with pagination and filters
     */
    getAllFamilies: (page?: number, limit?: number, filters?: Record<string, any>) => Promise<ApiResponse<PaginatedResponse<Family>>>;
    /**
     * Get single family by ID
     */
    getFamilyById: (id: string) => Promise<ApiResponse<Family>>;
    /**
     * Create new family
     */
    createFamily: (data: AddFamilyData) => Promise<ApiResponse<Family>>;
    /**
     * Update existing family
     */
    updateFamily: (id: string, data: Partial<Family>) => Promise<ApiResponse<Family>>;
    /**
     * Delete/Archive family
     */
    deleteFamily: (id: string) => Promise<ApiResponse<{
        message: string;
    }>>;
    /**
     * Search families by name, phone, or address
     */
    searchFamilies: (query: string) => Promise<ApiResponse<Family[]>>;
    /**
     * Get families by region
     */
    getFamiliesByRegion: (region: string) => Promise<ApiResponse<Family[]>>;
    /**
     * Get family visit history
     */
    getFamilyVisitHistory: (familyId: string) => Promise<ApiResponse<any[]>>;
};
//# sourceMappingURL=family.service.d.ts.map