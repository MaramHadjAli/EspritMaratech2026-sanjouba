/**
 * Register Page – OMNIA Charity Tracking
 * Multi-step registration • NGO style • Glassmorphism • Responsive
 */

import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@hooks/useAuth'
import { useToast } from '@hooks/useNotification'
import { validatePhoneTN } from '@utils/validators'
import { Button } from '@components/Button'
import { TextInput } from '@components/TextInput'
import { PasswordInput } from '@components/PasswordInput'
import { FormField } from '@components/FormField'

const RegisterPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { signup } = useAuth()
  const toast = useToast()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    dateOfBirth: '',
    location: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep = (current: number) => {
    const newErrors: Record<string, string> = {}

    if (current === 1 && !formData.name.trim()) {
      newErrors.name = 'Nom requis'
    }

    if (current === 2) {
      if (!formData.email) newErrors.email = 'Email requis'
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = 'Téléphone requis'
      } else if (!validatePhoneTN(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Format téléphone invalide'
      }
    }

    if (current === 3) {
      if (formData.password.length < 8) {
        newErrors.password = 'Minimum 8 caractères'
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Mots de passe différents'
      }
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'Vous devez accepter les conditions'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(3)) return

    try {
      await signup({
        name: formData.name,
        fullName: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        dateOfBirth: formData.dateOfBirth,
        location: formData.location,
      })
      toast.success('Compte créé avec succès 💚')
      setTimeout(() => navigate('/login'), 1500)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erreur inscription')
    }
  }

  return (
    <div
      className="
        min-h-screen flex items-center justify-center
        px-4 sm:px-6 lg:px-8
        relative overflow-hidden
        bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
        from-emerald-100 via-white to-sky-100
        dark:from-slate-900 dark:via-slate-900 dark:to-slate-800
      "
    >
      {/* Decorative shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-300 blur-3xl opacity-30 dark:bg-emerald-900" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-sky-300 blur-3xl opacity-30 dark:bg-sky-900" />

      <div className="w-full max-w-md relative z-10">
        <div
          className="
            bg-white/80 dark:bg-slate-800/80
            backdrop-blur-xl
            rounded-2xl
            p-6 sm:p-8
            shadow-xl shadow-emerald-200/40
            border border-white/40 dark:border-white/10
            space-y-6
          "
        >
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-sky-400 flex items-center justify-center text-white text-2xl shadow-lg">
              🌱
            </div>
            <h1 className="text-[clamp(1.6rem,4vw,2.1rem)] font-extrabold bg-gradient-to-r from-emerald-600 to-sky-500 bg-clip-text text-transparent">
              Créer un compte
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Rejoignez une communauté solidaire
            </p>
          </div>

          {/* Progress */}
          <div className="flex justify-between">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= s
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}
                >
                  {s}
                </div>
                <span className="text-xs mt-2 text-slate-500">
                  {s === 1 ? 'Profil' : s === 2 ? 'Contact' : 'Sécurité'}
                </span>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <FormField label="Nom complet" error={errors.name} required>
                  <TextInput name="name" value={formData.name} onChange={handleChange} />
                </FormField>
                <FormField label="Date de naissance" error={errors.dateOfBirth} required>
                  <TextInput name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                </FormField>
                <FormField label="Localisation" error={errors.location} required>
                  <TextInput name="location" value={formData.location} onChange={handleChange} />
                </FormField>
              </>
            )}

            {step === 2 && (
              <>
                <FormField label="Email" error={errors.email} required>
                  <TextInput name="email" type="email" value={formData.email} onChange={handleChange} />
                </FormField>
                <FormField label="Téléphone" error={errors.phoneNumber} required>
                  <TextInput name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                </FormField>
              </>
            )}

            {step === 3 && (
              <>
                <FormField label="Mot de passe" error={errors.password} required>
                  <PasswordInput name="password" value={formData.password} onChange={handleChange} />
                </FormField>
                <FormField label="Confirmer" error={errors.confirmPassword} required>
                  <PasswordInput name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                </FormField>

                <label className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} />
                  J’accepte les <Link to="/terms" className="text-emerald-600 underline">conditions</Link>
                </label>
              </>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <Button type="button" variant="ghost" fullWidth onClick={() => setStep(s => (s - 1) as any)}>
                  Précédent
                </Button>
              )}
              {step < 3 && (
                <Button type="button" fullWidth onClick={() => validateStep(step) && setStep(s => (s + 1) as any)}>
                  Suivant
                </Button>
              )}
              {step === 3 && (
                <Button
                  type="submit"
                  fullWidth
                  className="bg-gradient-to-r from-emerald-600 to-sky-500 text-white shadow-lg"
                >
                  Créer & aider
                </Button>
              )}
            </div>
          </form>

          {/* Login */}
          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            Déjà inscrit ?{' '}
            <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
              Se connecter
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          🌍 OMNIA Charity • Ensemble pour un impact réel
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
