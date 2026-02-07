/**
 * Auth Service
 * Handles user authentication: login, signup, logout, and user retrieval
 */
import { axiosInstance } from '../api/axiosInstance';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const authService = {
    /**
     * Connexion utilisateur
     */
    login: async (credentials) => {
        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/auth/login`, credentials);
            // Stocker le token
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                if (response.data.refreshToken) {
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                }
            }
            return response.data;
        }
        catch (error) {
            throw new Error('Erreur de connexion. Vérifiez vos identifiants.');
        }
    },
    /**
     * Inscription utilisateur
     */
    signup: async (userData) => {
        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/auth/signup`, userData);
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
            }
            return response.data;
        }
        catch (error) {
            throw new Error('Erreur lors de l\'inscription.');
        }
    },
    /**
     * Déconnexion
     */
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },
    /**
     * Récupérer l'utilisateur actif
     */
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    /**
     * Vérifier si l'utilisateur est authentifié
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    },
    /**
     * Obtenir le token
     */
    getToken: () => {
        return localStorage.getItem('authToken');
    },
};
//# sourceMappingURL=axiosInstance.js.map