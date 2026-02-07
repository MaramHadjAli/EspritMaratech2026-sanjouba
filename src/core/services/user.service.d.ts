/**
 * User Service
 * Handles user profile and account management API calls
 */
import { User, UpdateUserData, ChangePasswordData } from '@types';
declare class UserService {
    private baseUrl;
    /**
     * Get user profile by ID
     */
    getUserProfile(userId: string): Promise<User>;
    /**
     * Update user profile
     */
    updateUser(userId: string, data: UpdateUserData): Promise<User>;
    /**
     * Change user password
     */
    changePassword(userId: string, data: Omit<ChangePasswordData, 'confirmPassword'>): Promise<{
        message: string;
    }>;
    /**
     * Upload user avatar/profile picture
     */
    uploadAvatar(userId: string, file: File): Promise<{
        url: string;
    }>;
}
export declare const userService: UserService;
export {};
//# sourceMappingURL=user.service.d.ts.map