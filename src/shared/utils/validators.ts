/**
 * Form Validators
 * Validation functions for forms across the application
 */

import { FormError, PasswordStrength } from '@types'

// ============================================
// EMAIL VALIDATION
// ============================================

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// ============================================
// PASSWORD VALIDATION
// ============================================

export const getPasswordStrength = (password: string): PasswordStrength => {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  }

  let score = 0
  if (requirements.minLength) score++
  if (requirements.hasUpperCase) score++
  if (requirements.hasLowerCase) score++
  if (requirements.hasNumber) score++
  if (requirements.hasSpecialChar) score++

  const levels: Array<'weak' | 'fair' | 'good' | 'strong' | 'very-strong'> = [
    'weak',
    'weak',
    'fair',
    'good',
    'strong',
    'very-strong',
  ]

  return {
    score,
    level: levels[score],
  }
}

export const validatePassword = (password: string): FormError[] => {
  const errors: FormError[] = []

  if (password.length < 8) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 8 characters long',
    })
  }

  if (!/[A-Z]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one uppercase letter',
    })
  }

  if (!/[a-z]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one lowercase letter',
    })
  }

  if (!/\d/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one number',
    })
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one special character',
    })
  }

  return errors
}

// ============================================
// PHONE VALIDATION (Tunisia format)
// ============================================

/**
 * Validates Tunisia phone number format
 * Must be +216 followed by exactly 8 digits
 * @param phone - Phone number to validate
 * @returns true if valid format
 */
export const validatePhoneTN = (phone: string): boolean => {
  // Tunisia phone format: +216 followed by exactly 8 digits
  // Remove spaces for validation
  const cleaned = phone.replace(/\s/g, '')
  const phoneRegex = /^\+216[0-9]{8}$/
  return phoneRegex.test(cleaned)
}

/**
 * Formats phone number to Tunisia standard format (+216 XX XXX XXX)
 */
export const formatPhoneTN = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')

  // If starts with 216, add + prefix
  if (cleaned.startsWith('216') && cleaned.length === 11) {
    const digits = cleaned.substring(3)
    return `+216 ${digits.substring(0, 2)} ${digits.substring(2, 5)} ${digits.substring(5)}`
  }

  // If 8 digits only, add +216 prefix
  if (cleaned.length === 8) {
    return `+216 ${cleaned.substring(0, 2)} ${cleaned.substring(2, 5)} ${cleaned.substring(5)}`
  }

  return phone
}

/**
 * Check if phone number is unique (calls API)
 * @param phone - Phone number to check
 * @param excludeUserId - Optional user ID to exclude from check (for edit mode)
 * @returns Promise<boolean> - true if unique, false if already exists
 */
export const checkPhoneUnique = async (
  phone: string,
  excludeUserId?: string
): Promise<{ isUnique: boolean; message?: string }> => {
  try {
    // In production, this would call the backend API
    // For now, we simulate an API check
    // const response = await axiosInstance.get(`/users/check-phone?phone=${encodeURIComponent(phone)}&excludeId=${excludeUserId || ''}`)
    // return { isUnique: response.data.isUnique }
    
    // Mock implementation - in real app, replace with actual API call
    return { isUnique: true }
  } catch (error) {
    console.error('Error checking phone uniqueness:', error)
    return { isUnique: false, message: 'Could not verify phone number uniqueness' }
  }
}

// ============================================
// NAME VALIDATION
// ============================================

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(name)
}

// ============================================
// ADDRESS VALIDATION
// ============================================

export const validateAddress = (address: string): boolean => {
  return address.trim().length >= 5
}

// ============================================
// DATE VALIDATION
// ============================================

export const validateDateOfBirth = (date: string): boolean => {
  const birthDate = new Date(date)
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()

  // Must be at least 13 years old
  return age >= 13 && birthDate < today
}

// ============================================
// GENERIC FIELD VALIDATORS
// ============================================

export const validateRequired = (value: string | number): FormError[] => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return [{ field: 'required', message: 'This field is required' }]
  }
  return []
}

export const validateMinLength = (value: string, minLength: number): FormError[] => {
  if (value.length < minLength) {
    return [
      {
        field: 'minLength',
        message: `Must be at least ${minLength} characters`,
      },
    ]
  }
  return []
}

export const validateMaxLength = (value: string, maxLength: number): FormError[] => {
  if (value.length > maxLength) {
    return [
      {
        field: 'maxLength',
        message: `Must not exceed ${maxLength} characters`,
      },
    ]
  }
  return []
}

// ============================================
// FORM-LEVEL VALIDATORS
// ============================================

export const validateSignupForm = (data: any): FormError[] => {
  const errors: FormError[] = []

  // Email
  if (!data.email) {
    errors.push({ field: 'email', message: 'Email is required' })
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' })
  }

  // Name
  if (!data.name) {
    errors.push({ field: 'name', message: 'Name is required' })
  } else if (!validateName(data.name)) {
    errors.push({ field: 'name', message: 'Invalid name format' })
  }

  // Phone
  if (!data.phoneNumber) {
    errors.push({ field: 'phoneNumber', message: 'Phone number is required' })
  } else if (!validatePhoneTN(data.phoneNumber)) {
    errors.push({ field: 'phoneNumber', message: 'Invalid Tunisia phone format' })
  }

  // Date of Birth
  if (!data.dateOfBirth) {
    errors.push({ field: 'dateOfBirth', message: 'Date of birth is required' })
  } else if (!validateDateOfBirth(data.dateOfBirth)) {
    errors.push({ field: 'dateOfBirth', message: 'You must be at least 13 years old' })
  }

  // Location
  if (!data.location) {
    errors.push({ field: 'location', message: 'Location/Region is required' })
  }

  // Password
  const passwordErrors = validatePassword(data.password)
  errors.push(...passwordErrors)

  // Confirm Password
  if (!data.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Password confirmation is required' })
  } else if (data.password !== data.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' })
  }

  return errors
}

export const validateLoginForm = (data: any): FormError[] => {
  const errors: FormError[] = []

  if (!data.email) {
    errors.push({ field: 'email', message: 'Email is required' })
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' })
  }

  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' })
  }

  return errors
}
