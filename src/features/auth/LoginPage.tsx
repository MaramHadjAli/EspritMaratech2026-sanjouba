/**
 * Login Page – OMNIA Charity Tracking
 * Final UI version: Enhanced colors, glassmorphism background, NGO identity
 */

import React, { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@hooks/useAuth'
import { validateEmail } from '@utils/validators'
import { AccessibleFormField } from '@components/AccessibleFormField'
import { Button } from '@components/Button'
import { PasswordInput } from '@components/PasswordInput'
import { TextInput } from '@components/TextInput'
import { CheckboxInput } from '@components/CheckboxInput'

interface LoginFormErrors {
  email?: string
  password?: string
}

const LoginPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Refs for auto-focus on error
  const emailRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)

  // Focus first error field on error
  React.useEffect(() => {
    if (errors.email && emailRef.current) {
      emailRef.current.focus()
    } else if (errors.password && passwordRef.current) {
      passwordRef.current.focus()
    }
  }, [errors])

  const validateForm = useCallback(() => {
    const newErrors: LoginFormErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = t('auth.email') + ' ' + t('common.required')
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('auth.invalidEmail')
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = t('auth.password') + ' ' + t('common.required')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, t])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.currentTarget
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }))
      if (errors[name as keyof LoginFormErrors]) {
        setErrors(prev => ({ ...prev, [name]: undefined }))
      }
    },
    [errors]
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setSubmitError(null)

      if (!validateForm()) return

      try {
        await login(formData.email, formData.password)

        if (formData.rememberMe) {
          localStorage.setItem('rememberEmail', formData.email)
        } else {
          localStorage.removeItem('rememberEmail')
        }

        navigate('/home')
      } catch (error: any) {
        setSubmitError(
          error?.response?.data?.message ||
            t('auth.invalidCredentials') ||
            'Erreur de connexion'
        )
      }
    },
    [formData, validateForm, login, navigate, t]
  )

  return (
    <div
      className="
        min-h-screen w-full flex items-center justify-center
        px-4 sm:px-6 lg:px-8
        relative overflow-hidden
        bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
        from-emerald-100 via-white to-sky-100
        dark:from-slate-900 dark:via-slate-900 dark:to-slate-800
      "
    >
      {/* Decorative NGO shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-300 rounded-full blur-3xl opacity-30 dark:bg-emerald-900" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-sky-300 rounded-full blur-3xl opacity-30 dark:bg-sky-900" />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div
          className="
            bg-white/80 dark:bg-slate-800/80
            backdrop-blur-xl
            rounded-2xl
            p-6 sm:p-8
            shadow-xl shadow-emerald-200/40
            dark:shadow-black/30
            border border-white/40 dark:border-white/10
            space-y-6
          "
        >
          {/* Header */}
          <div className="text-center space-y-3">
            <div
              className="
                mx-auto w-16 h-16 rounded-full
                bg-gradient-to-br from-emerald-500 to-sky-400
                flex items-center justify-center
                text-white text-2xl
                shadow-lg
              "
            >
              🤍
            </div>

            <h1
              className="
                text-[clamp(1.6rem,4vw,2.1rem)]
                font-extrabold
                bg-gradient-to-r from-emerald-600 to-sky-500
                bg-clip-text text-transparent
              "
            >
              {t('auth.login')}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Ensemble, chaque don devient une action concrète
            </p>
          </div>


          {/* Error - live region for screen readers */}
          {submitError && (
            <div
              role="alert"
              aria-live="assertive"
              className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4"
            >
              <p className="text-sm text-rose-700 dark:text-rose-300">
                <span className="sr-only">Erreur : </span>
                {submitError}
              </p>
            </div>
          )}

          {/* Form */}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label={t('auth.login')}>
            <AccessibleFormField label={t('auth.email')} error={errors.email} required>
              <TextInput
                ref={emailRef}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="username"
                inputMode="email"
                aria-label={t('auth.email')}
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                disabled={isLoading}
                className="transition-all focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </AccessibleFormField>

            <AccessibleFormField label={t('auth.password')} error={errors.password} required>
              <PasswordInput
                ref={passwordRef}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="current-password"
                aria-label={t('auth.password')}
                aria-required="true"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                disabled={isLoading}
                showPassword={showPassword}
                onToggleShowPassword={() => setShowPassword(!showPassword)}
              />
            </AccessibleFormField>


            <div className="flex items-center justify-between">
              <CheckboxInput
                id="remember-me"
                name="rememberMe"
                label={t('auth.rememberMe')}
                checked={formData.rememberMe}
                onChange={handleInputChange}
                aria-label={t('auth.rememberMe')}
              />
              <Link
                to="/auth/forgot-password"
                className="text-sm text-emerald-600 hover:underline"
                tabIndex={0}
                aria-label={t('auth.forgotPassword')}
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              className="rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-sky-500 hover:from-emerald-700 hover:to-sky-600 transition-all duration-300 shadow-lg shadow-emerald-500/30 active:scale-95"
              aria-label={t('auth.login')}
            >
              {isLoading ? t('common.loading') : t('auth.login')}
            </Button>
          </form>

          {/* NGO values */}
          <div className="hidden sm:block text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <p>🌍 Suivez l’impact de vos dons</p>
            <p>🤝 Soutenez des projets transparents</p>
            <p>📊 Actions visibles en temps réel</p>
          </div>

          {/* Register */}
          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            <span>{t('auth.noAccount')} </span>
            <Link
              to="/register"
              className="text-emerald-600 font-semibold hover:underline"
              tabIndex={0}
              aria-label={t('auth.register')}
            >
              {t('Register')}
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>🌱 Association humanitaire à impact social</p>
          <p>🔒 Données sécurisées • Transparence garantie</p>
          <p>© {new Date().getFullYear()} OMNIA Charity</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
