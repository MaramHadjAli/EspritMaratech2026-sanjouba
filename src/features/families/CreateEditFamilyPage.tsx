/**
 * Create/Edit Family Page
 * Create new or edit existing family
 */

import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '@hooks/useAuth'
import { useToast } from '@hooks/useNotification'
import { familyService } from '@services/family.service'
import { Card } from '@components/Card'
import { FormField } from '@components/FormField'
import { Button } from '@components/Button'
import type { AddFamilyData } from '@/shared/types'

const CreateEditFamilyPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { success, error } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddFamilyData>({
    defaultValues: {
      name: '',
      phoneNumber: '',
      address: '',
      familySize: 1,
    },
  })

  const [submitting, setSubmitting] = useState(false)

  const isEditing = !!id

  if (!user) {
    navigate('/login')
    return null
  }

  const onSubmit = async (data: AddFamilyData) => {
    try {
      setSubmitting(true)

      if (isEditing) {
        const response = await familyService.updateFamily(id!, data)
        if (response.success) {
          success('Family updated successfully')
          navigate(`/families/${id}`)
        } else {
          error('Failed to update family')
        }
      } else {
        const response = await familyService.createFamily(data)
        if (response.success) {
          success('Family created successfully')
          navigate('/families')
        } else {
          error('Failed to create family')
        }
      }
    } catch (err) {
      error('An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="py-8 max-w-2xl mx-auto">
          {/* Navigation */}
          <button
            onClick={() => navigate(isEditing ? `/families/${id}` : '/families')}
            className="mb-6 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            ← Back
          </button>

          {/* Form Card */}
          <Card bordered className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isEditing ? 'Edit Family' : 'Add New Family'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {isEditing
                ? 'Update the family information'
                : 'Fill in the details to register a new family'}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <FormField
                label="Name"
                error={errors.name?.message}
              >
                <input
                  {...register('name', {
                    required: 'Name is required',
                  })}
                  type="text"
                  placeholder="Enter name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </FormField>

              {/* Family Size */}
              <FormField
                label="Family Size"
                error={errors.familySize?.message}
              >
                <input
                  {...register('familySize', {
                    required: 'Family size is required',
                    valueAsNumber: true,
                    min: { value: 1, message: 'Must be at least 1' },
                  })}
                  type="number"
                  placeholder="Enter total family size"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </FormField>

              {/* Phone Number */}
              <FormField
                label="Phone Number"
                error={errors.phoneNumber?.message}
              >
                <input
                  {...register('phoneNumber')}
                  type="tel"
                  placeholder="+216 XX XXX XXX"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </FormField>

              {/* Address */}
              <FormField
                label="Address"
                error={errors.address?.message}
              >
                <input
                  {...register('address')}
                  type="text"
                  placeholder="Enter address"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </FormField>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  onClick={() => navigate(isEditing ? `/families/${id}` : '/families')}
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : isEditing ? 'Update Family' : 'Add Family'}
                </Button>
              </div>
            </form>
          </Card>
    </div>
  )
}

export default CreateEditFamilyPage
