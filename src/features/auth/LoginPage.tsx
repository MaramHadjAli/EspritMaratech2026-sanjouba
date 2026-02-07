/**
 * Login Page - OMNIA Charity Tracking
 * Handles user authentication with email/password
 * Responsive, accessible (WCAG AA), supports dark mode and multiple languages
 */

import React, { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@hooks/useAuth'
import { useTheme } from '@hooks/useTheme'
import { validateEmail } from '@utils/validators'
import { FormField } from '@components/FormField'
import { Button } from '@components/Button'
import { PasswordInput } from '@components/PasswordInput'
import { TextInput } from '@components/TextInput'
import { CheckboxInput } from '@components/CheckboxInput'

interface LoginFormErrors {
  email?: string
  password?: string
  general?: string
}

const LoginPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const { isDarkMode } = useTheme()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: LoginFormErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = t('auth.email') + ' ' + t('common.required')
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('auth.invalidEmail')
    }

    if (!formData.password) {
      newErrors.password = t('auth.password') + ' ' + t('common.required')
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.password') + ' ' + t('common.required')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, t])

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.currentTarget
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }))
      if (errors[name as keyof LoginFormErrors]) {
        setErrors(prev => ({
          ...prev,
          [name]: undefined,
        }))
      }
    },
    [errors]
  )

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setSubmitError(null)

      if (!validateForm()) {
        return
      }

      try {
        await login(formData.email, formData.password)
        if (formData.rememberMe) {
          localStorage.setItem('rememberEmail', formData.email)
        } else {
          localStorage.removeItem('rememberEmail')
        }
        navigate('/home')
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || error?.message || t('auth.invalidCredentials')
        setSubmitError(errorMessage)
      }
    },
    [formData, validateForm, login, navigate, t]
  )

  // Handle enter key
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !isLoading) {
        handleSubmit(e as any)
      }
    },
    [handleSubmit, isLoading]
  )

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-8"
      style={{
        backgroundImage: isDarkMode
          ? "url('/images/backgrounds/bg-dark.png')"
          : "url('/images/backgrounds/bg-light.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Skip to main content link for accessibility */}
      <a href="#login-form" className="sr-only focus:not-sr-only">
        {t('common.skipToContent') || 'Aller au formulaire de connexion'}
      </a>

      {/* Main container */}
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <img
              src={isDarkMode ? '/images/icons/logo-dark.png' : '/images/icons/logo-light.png'}
              alt={t('common.appName')}
              className="h-12 mx-auto"
            />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('auth.login')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('common.tagline')}
            </p>
          </div>

          {/* Error alert */}
          {submitError && (
            <div
              role="alert"
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4"
              aria-live="polite"
              aria-atomic="true"
            >
              <p className="text-sm text-red-800 dark:text-red-200">{submitError}</p>
            </div>
          )}

          {/* Form */}
          <form
            id="login-form"
            onSubmit={handleSubmit}
            onKeyPress={handleKeyPress}
            className="space-y-4"
            noValidate
          >
            {/* Email field */}
            <FormField
              label={t('auth.email')}
              error={errors.email}
              required
            >
              <TextInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="exemple@omnia.fr"
                disabled={isLoading}
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </FormField>

            {/* Password field */}
            <FormField
              label={t('auth.password')}
              error={errors.password}
              required
            >
              <PasswordInput
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                disabled={isLoading}
                showPassword={showPassword}
                onToggleShowPassword={() => setShowPassword(!showPassword)}
                aria-required="true"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
            </FormField>

            {/* Remember me checkbox */}
            <div className="flex items-center justify-between">
              <CheckboxInput
                id="remember-me"
                name="rememberMe"
                label={t('auth.rememberMe')}
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <Link
                to="/auth/forgot-password"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline focus:outline-2 focus:outline-offset-2 focus:outline-primary-500"
                aria-label={t('auth.forgotPassword')}
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
              size="lg"
              aria-busy={isLoading}
            >
              {isLoading ? t('common.loading') : t('auth.login')}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                {t('common.or') || 'ou'}
              </span>
            </div>
          </div>

          {/* Contact admin message */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <span>{t('auth.noAccount')} </span>
            <span className="text-primary-600 dark:text-primary-400 font-semibold">
              {t('auth.contactAdmin')}
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            {t('common.secureConnection') || 'Connexion sécurisée'} • {t('common.privacyPolicy') || 'Politique de confidentialité'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
