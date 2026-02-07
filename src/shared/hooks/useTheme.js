/**
 * useTheme Hook
 * Custom hook for accessing theme context and functions
 */
import { useContext } from 'react';
import { ThemeContext } from '@contexts/ThemeContext';
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
//# sourceMappingURL=useTheme.js.map