/**
 * Form Validators
 * Validation functions for forms across the application
 */
import { FormError, PasswordStrength } from '@types';
export declare const validateEmail: (email: string) => boolean;
export declare const getPasswordStrength: (password: string) => PasswordStrength;
export declare const validatePassword: (password: string) => FormError[];
export declare const validatePhoneTN: (phone: string) => boolean;
export declare const formatPhoneTN: (phone: string) => string;
export declare const validateName: (name: string) => boolean;
export declare const validateAddress: (address: string) => boolean;
export declare const validateDateOfBirth: (date: string) => boolean;
export declare const validateRequired: (value: string | number) => FormError[];
export declare const validateMinLength: (value: string, minLength: number) => FormError[];
export declare const validateMaxLength: (value: string, maxLength: number) => FormError[];
export declare const validateSignupForm: (data: any) => FormError[];
export declare const validateLoginForm: (data: any) => FormError[];
//# sourceMappingURL=validators.d.ts.map