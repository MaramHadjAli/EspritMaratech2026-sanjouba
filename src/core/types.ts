// Aid interface for aid management
export interface Aid {
    id: string;
    name: string;
    type: string;
    description?: string;
    quantity: number;
    depositId?: string;
    requiresRefrigeration?: boolean;
    requiredHumidityLevel?: string;
    requiredMinTemperatureC?: number;
    requiredMaxTemperatureC?: number;
    familyId: string;
    unit?: string;
    addedAt?: string;
}
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

export interface DashboardStats {
    // Add properties as needed
}

export interface RegionalStats {
    // Add properties as needed
}