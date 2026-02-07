import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '@hooks/useAuth'
import { useToast } from '@hooks/useNotification'
import { FormField } from '@components/FormField'
import { Button } from '@components/Button'
import { Card } from '@components/Card'
import type { UpdateUserData, User } from '@types'

export const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<User | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserData>({
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      organization: '',
    },
  })

  const [submitting, setSubmitting] = useState(false)

  if (!user) {
    navigate('/login')
    return null
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        // Mock user data - in real app would fetch from backend
        const mockUser: User = {
          id: user.id,
          name: 'Mohamed Ahmed',
          email: user.email,
          phoneNumber: '+20 123 456 7890',
          fullName: 'Mohamed Ahmed',
          role: user.role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setUserData(mockUser)
        reset({
          name: mockUser.name || mockUser.fullName,
          email: mockUser.email,
          phoneNumber: mockUser.phoneNumber,
        })
      } catch (err) {
        toast.error('Error loading profile')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user, reset, toast])

  const onSubmit = async (data: UpdateUserData) => {
    try {
      setSubmitting(true)
      // Mock API call - would be:
      // await userService.updateUser(user!.id, data)

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))

      toast.success('Profile updated successfully')
      setTimeout(() => navigate('/settings'), 1000)
    } catch (err) {
      toast.error('Error updating profile')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600 dark:text-gray-400">
            Loading profile...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 max-w-4xl mx-auto">
        <div>
          <div className="mb-8">
            <button
              onClick={() => navigate('/settings')}
              className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
            >
              ← Back to Settings
            </button>
          </div>

          {/* Profile Form */}
          <Card bordered className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Edit Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Update your personal information
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Section */}
              <div className="grid md:grid-cols-1 gap-6">
                <FormField
                  label="Full Name"
                  error={errors.name?.message}
                >
                  <input
                    {...register('name', {
                      required: 'Full name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                    })}
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  />
                </FormField>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  label="Email"
                  error={errors.email?.message}
                >
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address',
                      },
                    })}
                    type="email"
                    placeholder="Enter email"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  />
                </FormField>

                <FormField
                  label="Phone Number"
                  error={errors.phoneNumber?.message}
                >
                  <input
                    {...register('phoneNumber', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[\d\s\-\+\(\)]+$/,
                        message: 'Please enter a valid phone number',
                      },
                    })}
                    type="tel"
                    placeholder="Enter phone number"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  />
                </FormField>
              </div>

              {/* Organization */}
              <FormField
                label="Organization"
                error={errors.organization?.message}
              >
                <input
                  {...register('organization', {
                    required: 'Organization is required',
                    minLength: {
                      value: 2,
                      message: 'Organization must be at least 2 characters',
                    },
                  })}
                  type="text"
                  placeholder="Enter organization name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </FormField>

              {/* Role Display */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <p className="text-gray-900 dark:text-white capitalize">
                  {user.role}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Contact an administrator to change your role
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
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
          </Card>

          {/* Info Section */}
          <div className="mt-8 p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Need to change your password?
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
              Go to the Account tab in Settings to change your password
            </p>
            <Button
              variant="secondary"
              onClick={() => navigate('/settings')}
              className="text-sm"
            >
              Go to Account Settings
            </Button>
          </div>
        </div>
    </div>
  )
}
