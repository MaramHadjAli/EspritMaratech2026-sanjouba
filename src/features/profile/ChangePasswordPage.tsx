import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '@hooks/useAuth'
import { useToast } from '@hooks/useNotification'
import { FormField } from '@components/FormField'
import { PasswordInput } from '@components/PasswordInput'
import { Button } from '@components/Button'
import { Card } from '@components/Card'
import type { ChangePasswordData } from '@types'

export const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const [submitting, setSubmitting] = useState(false)
  const newPassword = watch('newPassword')

  if (!user) {
    navigate('/login')
    return null
  }

  const onSubmit = async (data: ChangePasswordData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      setSubmitting(true)
      // Mock API call - would be:
      // await userService.changePassword(user.id, {
      //   currentPassword: data.currentPassword,
      //   newPassword: data.newPassword,
      // })

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800))

      toast.success('Password changed successfully')
      setTimeout(() => navigate('/settings'), 1000)
    } catch (err: any) {
      toast.error(err.message || 'Error changing password')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div>
          <div className="mb-8">
            <button
              onClick={() => navigate('/settings')}
              className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
            >
              ← Back to Settings
            </button>
          </div>

          {/* Password Change Form */}
          <Card bordered className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Change Password
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Update your password to keep your account secure
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Current Password */}
              <FormField label="Current Password" error={errors.currentPassword?.message} required>
                <PasswordInput
                  {...register('currentPassword', {
                    required: 'Current password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                  placeholder="Enter your current password"
                />
              </FormField>

              <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Your current password is required to confirm this change for security reasons.
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700"></div>

              {/* New Password */}
              <FormField label="New Password" error={errors.newPassword?.message} required>
                <PasswordInput
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                    validate: {
                      uppercase: (value) =>
                        /[A-Z]/.test(value) ||
                        'Password must contain at least one uppercase letter',
                      lowercase: (value) =>
                        /[a-z]/.test(value) ||
                        'Password must contain at least one lowercase letter',
                      number: (value) =>
                        /\d/.test(value) ||
                        'Password must contain at least one number',
                      special: (value) =>
                        /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                        'Password must contain at least one special character',
                    },
                  })}
                  placeholder="Enter your new password"
                />
              </FormField>

              {/* Password Requirements */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Password Requirements:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className={`flex items-center ${newPassword?.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    <span className="mr-2">✓</span>
                    At least 8 characters
                  </li>
                  <li className={`flex items-center ${/[A-Z]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    <span className="mr-2">✓</span>
                    One uppercase letter
                  </li>
                  <li className={`flex items-center ${/[a-z]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    <span className="mr-2">✓</span>
                    One lowercase letter
                  </li>
                  <li className={`flex items-center ${/\d/.test(newPassword) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    <span className="mr-2">✓</span>
                    One number
                  </li>
                  <li className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    <span className="mr-2">✓</span>
                    One special character
                  </li>
                </ul>
              </div>

              {/* Confirm Password */}
              <FormField label="Confirm New Password" error={errors.confirmPassword?.message} required>
                <PasswordInput
                  {...register('confirmPassword', {
                    required: 'Please confirm your new password',
                    validate: (value) =>
                      value === newPassword || 'Passwords do not match',
                  })}
                  placeholder="Re-enter your new password"
                />
              </FormField>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? 'Updating...' : 'Update Password'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/settings')}
                  disabled={submitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>

            {/* Security Tips */}
            <div className="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Security Tips:
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                <li>• Use a password you don't use on other websites</li>
                <li>• Avoid easily guessable information like birthdays</li>
                <li>• Consider using a password manager for complex passwords</li>
                <li>• Change your password regularly for better security</li>
              </ul>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
