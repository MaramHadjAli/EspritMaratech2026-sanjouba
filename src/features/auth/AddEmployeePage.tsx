/**
 * Add Employee Page
 * Admin-only page for adding new employees to the system
 * Employees are created with admin-provided credentials (no self-signup)
 */

import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@hooks/useAuth'
import { useNotification } from '@hooks/useNotification'
import { validatePhoneTN, checkPhoneUnique } from '@utils/validators'
import { Button } from '@components/Button'
import { TextInput } from '@components/TextInput'
import { PasswordInput } from '@components/PasswordInput'
import { FormField } from '@components/FormField'
import { Card } from '@components/Card'
import { userService } from '@services/user.service'

const AddEmployeePage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addNotification } = useNotification()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [isChecking, setIsChecking] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Check if user is admin
  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4">
        <Card className="w-full max-w-md" bordered>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('common.unauthorized')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('auth.adminOnlyAccess')}
            </p>
            <Button onClick={() => navigate('/home')} fullWidth>
              {t('common.back')}
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (stepNum) {
      case 1:
        if (!formData.name.trim()) {
          newErrors.name = t('validation.nameRequired')
        }
        break
      case 2:
        if (!formData.email) {
          newErrors.email = t('validation.emailRequired')
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = t('validation.invalidEmail')
        }
        if (!formData.phoneNumber) {
          newErrors.phoneNumber = t('validation.phoneRequired')
        } else if (!validatePhoneTN(formData.phoneNumber)) {
          newErrors.phoneNumber = t('validation.invalidPhoneFormat')
        }
        break
      case 3:
        if (!formData.password) {
          newErrors.password = t('validation.passwordRequired')
        } else if (formData.password.length < 8) {
          newErrors.password = t('validation.passwordTooShort')
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = t('validation.passwordMismatch')
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = async () => {
    if (!validateStep(step)) return
    
    // Check phone uniqueness when moving from step 2 to step 3
    if (step === 2) {
      setIsChecking(true)
      try {
        const uniqueCheck = await checkPhoneUnique(formData.phoneNumber)
        if (!uniqueCheck.isUnique) {
          setErrors((prev) => ({
            ...prev,
            phoneNumber: t('validation.phoneAlreadyExists'),
          }))
          setIsChecking(false)
          return
        }
      } catch (error) {
        console.error('Error checking phone uniqueness:', error)
      } finally {
        setIsChecking(false)
      }
    }
    
    setStep((prev) => (prev + 1) as 1 | 2 | 3)
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
      await userService.createEmployee({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phoneNumber,
      })
      addNotification({
        type: 'success',
        message: t('auth.employeeAddedSuccess') || 'Employee added successfully',
        duration: 3000,
      })
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
      })
      setStep(1)
      setTimeout(() => navigate('/home'), 2000)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || t('auth.registrationFailed')
      addNotification({
        type: 'error',
        message: errorMessage,
        duration: 5000,
      })
      setErrors({
        submit: errorMessage,
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
          {t('auth.addEmployee')}
        </h1>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8">
          {t('auth.addEmployeeDescription')}
        </p>

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
                {s === 1 ? t('auth.stepPersonal') : s === 2 ? t('auth.stepContact') : t('auth.stepSecurity')}
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
              <FormField label={t('auth.name')} error={errors.name} required>
                <TextInput
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('auth.namePlaceholder')}
                />
              </FormField>
            </>
          )}

          {/* Step 2: Contact Info */}
          {step === 2 && (
            <>
              <FormField label={t('auth.email')} error={errors.email} required>
                <TextInput
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('auth.emailPlaceholder')}
                />
              </FormField>
              <FormField label={t('auth.phone')} error={errors.phoneNumber} required>
                <TextInput
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder={t('auth.phonePlaceholder')}
                />
              </FormField>
            </>
          )}

          {/* Step 3: Security */}
          {step === 3 && (
            <>
              <FormField label={t('auth.password')} error={errors.password} required>
                <PasswordInput
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </FormField>
              <FormField label={t('auth.confirmPassword')} error={errors.confirmPassword} required>
                <PasswordInput
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </FormField>
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button type="button" variant="ghost" fullWidth onClick={handlePrevious}>
                {t('common.previous')}
              </Button>
            )}
            {step < 3 && (
              <Button 
                type="button" 
                fullWidth 
                onClick={handleNext}
                disabled={isChecking}
              >
                {isChecking ? t('common.verifying') : t('common.next')}
              </Button>
            )}
            {step === 3 && (
              <Button type="submit" fullWidth>
                {t('auth.addEmployee')}
              </Button>
            )}
          </div>
        </form>

        {/* Back Link */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            <Link
              to="/home"
              className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
            >
              {t('common.back')}
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default AddEmployeePage
