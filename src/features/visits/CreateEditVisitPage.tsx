/**
 * Create/Edit Visit Page
 * Create new or edit existing visit
 */

import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '@hooks/useAuth'
import { useToast } from '@hooks/useNotification'
import { visitService } from '@services/visit.service'
import { Card } from '@components/Card'
import { FormField } from '@components/FormField'
import { Button } from '@components/Button'
import type { CreateVisitData } from '@/shared/types'

const CreateEditVisitPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { success, error } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateVisitData>({
    defaultValues: {
      campaignName: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      location: { latitude: 0, longitude: 0 },
      address: '',
    },
  })

  const [submitting, setSubmitting] = useState(false)

  const isEditing = !!id

  if (!user) {
    navigate('/login')
    return null
  }

  const onSubmit = async (data: CreateVisitData) => {
    try {
      setSubmitting(true)

      if (isEditing) {
        const response = await visitService.updateVisit(id!, data)
        if (response.success) {
          success('Visit updated successfully')
          navigate(`/visits/${id}`)
        } else {
          error('Failed to update visit')
        }
      } else {
        const response = await visitService.createVisit(data)
        if (response.success) {
          success('Visit created successfully')
          navigate('/visits')
        } else {
          error('Failed to create visit')
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
            onClick={() => navigate(isEditing ? `/visits/${id}` : '/visits')}
            className="mb-6 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            ← Back
          </button>

          {/* Form Card */}
          <Card bordered className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isEditing ? 'Edit Visit' : 'Create New Visit'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {isEditing
                ? 'Update the visit information'
                : 'Fill in the details to create a new visit'}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Campaign Name */}
              <FormField
                label="Campaign Name"
                error={errors.campaignName?.message}
              >
                <input
                  {...register('campaignName', {
                    required: 'Campaign name is required',
                  })}
                  type="text"
                  placeholder="Enter campaign name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </FormField>

              {/* Address */}
              <FormField
                label="Address"
                error={errors.address?.message}
              >
                <input
                  {...register('address', {
                    required: 'Address is required',
                  })}
                  type="text"
                  placeholder="Enter address"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </FormField>

              {/* Description */}
              <FormField
                label="Description"
                error={errors.description?.message}
              >
                <textarea
                  {...register('description')}
                  placeholder="Enter description"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </FormField>

              {/* Visit Date */}
              <FormField
                label="Visit Date"
                error={errors.date?.message}
              >
                <input
                  {...register('date')}
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </FormField>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  onClick={() => navigate(isEditing ? `/visits/${id}` : '/visits')}
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : isEditing ? 'Update Visit' : 'Create Visit'}
                </Button>
              </div>
            </form>
          </Card>
    </div>
  )
}

export default CreateEditVisitPage
