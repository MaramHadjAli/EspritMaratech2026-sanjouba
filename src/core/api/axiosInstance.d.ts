/**
 * Auth Service
 * Handles user authentication: login, signup, logout, and user retrieval
 */
import { AuthResponse, LoginCredentials, User } from '../types';
export declare const authService: {
    /**
     * Connexion utilisateur
     */
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    /**
     * Inscription utilisateur
     */
    signup: (userData: any) => Promise<AuthResponse>;
    /**
     * Déconnexion
     */
    logout: () => void;
    /**
     * Récupérer l'utilisateur actif
     */
    getCurrentUser: () => User | null;
    /**
     * Vérifier si l'utilisateur est authentifié
     */
    isAuthenticated: () => boolean;
    /**
     * Obtenir le token
     */
    getToken: () => string | null;
};
//# sourceMappingURL=axiosInstance.d.ts.map