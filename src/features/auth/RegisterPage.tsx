/**
 * Register Page
 * Multi-step registration form with email verification
 */

import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@hooks/useAuth'
import { useToast } from '@hooks/useNotification'
import { validateSignupForm } from '@utils/validators'
import { Button } from '@components/Button'
import { TextInput } from '@components/TextInput'
import { PasswordInput } from '@components/PasswordInput'
import { FormField } from '@components/FormField'
import { Card } from '@components/Card'
import { Badge } from '@components/Badge'

const RegisterPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { signup } = useAuth()
  const toast = useToast()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    location: '',
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (stepNum) {
      case 1:
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'First name is required'
        }
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'Last name is required'
        }
        break
      case 2:
        if (!formData.email) {
          newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Invalid email format'
        }
        if (!formData.phoneNumber) {
          newErrors.phoneNumber = 'Phone is required'
        }
        break
      case 3:
        if (!formData.password) {
          newErrors.password = 'Password is required'
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters'
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match'
        }
        if (!formData.agreeToTerms) {
          newErrors.agreeToTerms = 'You must agree to the terms'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3)
    }
  }

  const handlePrevious = () => {
    setStep((prev) => (prev - 1) as 1 | 2 | 3)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(3)) {
      return
    }

    try {
      await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        dateOfBirth: formData.dateOfBirth,
        location: formData.location,
      })
      toast.success('Account created successfully! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
      setErrors({
        submit: error.response?.data?.message || 'Registration failed. Please try again.',
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <Card className="w-full max-w-md" bordered>
        {/* Header */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">O</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
          Create Account
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  step >= s
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {s}
              </div>
              <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                {s === 1 ? 'Personal' : s === 2 ? 'Contact' : 'Security'}
              </span>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.submit && (
            <div className="p-3 rounded-lg bg-danger-50 dark:bg-danger-900 border border-danger-200 dark:border-danger-800">
              <p className="text-sm text-danger font-medium">{errors.submit}</p>
            </div>
          )}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <>
              <FormField label="First Name" error={errors.firstName} required>
                <TextInput
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                />
              </FormField>
              <FormField label="Last Name" error={errors.lastName} required>
                <TextInput
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                />
              </FormField>
            </>
          )}

          {/* Step 2: Contact Info */}
          {step === 2 && (
            <>
              <FormField label="Email" error={errors.email} required>
                <TextInput
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
              </FormField>
              <FormField label="Phone" error={errors.phoneNumber} required>
                <TextInput
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+216 XX XXX XXX"
                />
              </FormField>
            </>
          )}

          {/* Step 3: Security */}
          {step === 3 && (
            <>
              <FormField label="Password" error={errors.password} required>
                <PasswordInput
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </FormField>
              <FormField label="Confirm Password" error={errors.confirmPassword} required>
                <PasswordInput
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </FormField>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 mr-2"
                  id="terms"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-500 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-500 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={handlePrevious}
              >
                Previous
              </Button>
            )}
            {step < 3 && (
              <Button
                type="button"
                fullWidth
                onClick={handleNext}
              >
                Next
              </Button>
            )}
            {step === 3 && (
              <Button
                type="submit"
                fullWidth
              >
                Create Account
              </Button>
            )}
          </div>
        </form>

        {/* Login Link */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default RegisterPage
