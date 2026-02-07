/**
 * Form Validators
 * Validation functions for forms across the application
 */
// ============================================
// EMAIL VALIDATION
// ============================================
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
// ============================================
// PASSWORD VALIDATION
// ============================================
export const getPasswordStrength = (password) => {
    const requirements = {
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
    let score = 0;
    if (requirements.minLength)
        score++;
    if (requirements.hasUpperCase)
        score++;
    if (requirements.hasLowerCase)
        score++;
    if (requirements.hasNumber)
        score++;
    if (requirements.hasSpecialChar)
        score++;
    const levels = [
        'weak',
        'weak',
        'fair',
        'good',
        'strong',
        'very-strong',
    ];
    return {
        score,
        level: levels[score],
    };
};
export const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
        errors.push({
            field: 'password',
            message: 'Password must be at least 8 characters long',
        });
    }
    if (!/[A-Z]/.test(password)) {
        errors.push({
            field: 'password',
            message: 'Password must contain at least one uppercase letter',
        });
    }
    if (!/[a-z]/.test(password)) {
        errors.push({
            field: 'password',
            message: 'Password must contain at least one lowercase letter',
        });
    }
    if (!/\d/.test(password)) {
        errors.push({
            field: 'password',
            message: 'Password must contain at least one number',
        });
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push({
            field: 'password',
            message: 'Password must contain at least one special character',
        });
    }
    return errors;
};
// ============================================
// PHONE VALIDATION (Tunisia format)
// ============================================
export const validatePhoneTN = (phone) => {
    // Tunisia phone format: +216XXXXXXXXXX or 0XXXXXXXXX
    const phoneRegex = /^(\+216|0)[2-5][0-9]{7}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};
export const formatPhoneTN = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('216')) {
        return `+${cleaned}`;
    }
    if (cleaned.startsWith('0')) {
        return `+216${cleaned.substring(1)}`;
    }
    if (cleaned.length === 8) {
        return `+216${cleaned}`;
    }
    return phone;
};
// ============================================
// NAME VALIDATION
// ============================================
export const validateName = (name) => {
    return name.trim().length >= 2 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(name);
};
// ============================================
// ADDRESS VALIDATION
// ============================================
export const validateAddress = (address) => {
    return address.trim().length >= 5;
};
// ============================================
// DATE VALIDATION
// ============================================
export const validateDateOfBirth = (date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    // Must be at least 13 years old
    return age >= 13 && birthDate < today;
};
// ============================================
// GENERIC FIELD VALIDATORS
// ============================================
export const validateRequired = (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
        return [{ field: 'required', message: 'This field is required' }];
    }
    return [];
};
export const validateMinLength = (value, minLength) => {
    if (value.length < minLength) {
        return [
            {
                field: 'minLength',
                message: `Must be at least ${minLength} characters`,
            },
        ];
    }
    return [];
};
export const validateMaxLength = (value, maxLength) => {
    if (value.length > maxLength) {
        return [
            {
                field: 'maxLength',
                message: `Must not exceed ${maxLength} characters`,
            },
        ];
    }
    return [];
};
// ============================================
// FORM-LEVEL VALIDATORS
// ============================================
export const validateSignupForm = (data) => {
    const errors = [];
    // Email
    if (!data.email) {
        errors.push({ field: 'email', message: 'Email is required' });
    }
    else if (!validateEmail(data.email)) {
        errors.push({ field: 'email', message: 'Invalid email format' });
    }
    // Name
    if (!data.name) {
        errors.push({ field: 'name', message: 'Name is required' });
    }
    else if (!validateName(data.name)) {
        errors.push({ field: 'name', message: 'Invalid name format' });
    }
    // Phone
    if (!data.phoneNumber) {
        errors.push({ field: 'phoneNumber', message: 'Phone number is required' });
    }
    else if (!validatePhoneTN(data.phoneNumber)) {
        errors.push({ field: 'phoneNumber', message: 'Invalid Tunisia phone format' });
    }
    // Date of Birth
    if (!data.dateOfBirth) {
        errors.push({ field: 'dateOfBirth', message: 'Date of birth is required' });
    }
    else if (!validateDateOfBirth(data.dateOfBirth)) {
        errors.push({ field: 'dateOfBirth', message: 'You must be at least 13 years old' });
    }
    // Location
    if (!data.location) {
        errors.push({ field: 'location', message: 'Location/Region is required' });
    }
    // Password
    const passwordErrors = validatePassword(data.password);
    errors.push(...passwordErrors);
    // Confirm Password
    if (!data.confirmPassword) {
        errors.push({ field: 'confirmPassword', message: 'Password confirmation is required' });
    }
    else if (data.password !== data.confirmPassword) {
        errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
    }
    return errors;
};
export const validateLoginForm = (data) => {
    const errors = [];
    if (!data.email) {
        errors.push({ field: 'email', message: 'Email is required' });
    }
    else if (!validateEmail(data.email)) {
        errors.push({ field: 'email', message: 'Invalid email format' });
    }
    if (!data.password) {
        errors.push({ field: 'password', message: 'Password is required' });
    }
    return errors;
};
//# sourceMappingURL=validators.js.map