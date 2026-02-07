/**
 * Visit API Service
 * Handles all visit/campaign-related API calls
 */
import { ApiResponse, Visit, CreateVisitData, EditVisitData, PaginatedResponse } from '@types';
export declare const visitService: {
    /**
     * Get all visits with pagination
     */
    getAllVisits: (page?: number, limit?: number, filters?: Record<string, any>) => Promise<ApiResponse<PaginatedResponse<Visit>>>;
    /**
     * Get single visit by ID
     */
    getVisitById: (id: string) => Promise<ApiResponse<Visit>>;
    /**
     * Create new visit/campaign
     */
    createVisit: (data: CreateVisitData) => Promise<ApiResponse<Visit>>;
    /**
     * Update existing visit
     */
    updateVisit: (id: string, data: Partial<EditVisitData>) => Promise<ApiResponse<Visit>>;
    /**
     * Delete/Archive visit
     */
    deleteVisit: (id: string) => Promise<ApiResponse<{
        message: string;
    }>>;
    /**
     * Get visits assigned to current user
     */
    getMyVisits: () => Promise<ApiResponse<Visit[]>>;
    /**
     * Get upcoming visits
     */
    getUpcomingVisits: () => Promise<ApiResponse<Visit[]>>;
    /**
     * Get visit by region
     */
    getVisitsByRegion: (region: string) => Promise<ApiResponse<Visit[]>>;
    /**
     * Join a visit as a team member
     */
    joinVisit: (visitId: string) => Promise<ApiResponse<Visit>>;
    /**
     * Leave a visit
     */
    leaveVisit: (visitId: string) => Promise<ApiResponse<{
        message: string;
    }>>;
    /**
     * Complete a visit
     */
    completeVisit: (visitId: string) => Promise<ApiResponse<Visit>>;
};
//# sourceMappingURL=visit.service.d.ts.map