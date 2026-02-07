/**
 * PasswordInput Component
 * Password input with show/hide toggle button
 * Accessible and supports dark mode
 */
import React from 'react';
interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    showPassword?: boolean;
    onToggleShowPassword?: () => void;
    error?: string;
}
export declare const PasswordInput: React.ForwardRefExoticComponent<PasswordInputProps & React.RefAttributes<HTMLInputElement>>;
export default PasswordInput;
//# sourceMappingURL=PasswordInput.d.ts.map