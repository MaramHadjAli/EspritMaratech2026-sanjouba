/**
 * Create/Edit Aid Page
 * Create new or edit existing aid
 */

import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '@hooks/useAuth'
import { useToast } from '@hooks/useNotification'
import { aidService } from '@services/aid.service'
import { Card } from '@components/Card'
import { FormField } from '@components/FormField'
import { Button } from '@components/Button'
import Header from '@components/Header'
import type { AddAidData } from '@/shared/types'

const CreateEditAidPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { success, error } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddAidData>({
    defaultValues: {
      type: 'FOOD',
      description: '',
      quantity: 1,
    },
  })

  const [submitting, setSubmitting] = useState(false)

  const isEditing = !!id

  const aidCategories = [
    'FOOD',
    'MEDICAL',
    'EDUCATIONAL',
    'CLOTHING',
    'SHELTER',
    'OTHER',
  ]

  if (!user) {
    navigate('/login')
    return null
  }

  const onSubmit = async (data: AddAidData) => {
    try {
      setSubmitting(true)

      if (isEditing) {
        const response = await aidService.updateAid(id!, data)
        if (response.success) {
          success('Aid updated successfully')
          navigate(`/aid/${id}`)
        } else {
          error('Failed to update aid')
        }
      } else {
        const response = await aidService.createAid(data)
        if (response.success) {
          success('Aid created successfully')
          navigate('/aid')
        } else {
          error('Failed to create aid')
        }
      }
    } catch (err) {
      error('An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Navigation */}
          <button
            onClick={() => navigate(isEditing ? `/aid/${id}` : '/aid')}
            className="mb-6 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            ← Back
          </button>

          {/* Form Card */}
          <Card bordered className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isEditing ? 'Edit Aid' : 'Add New Aid'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {isEditing
                ? 'Update the aid information'
                : 'Fill in the details to add new aid'}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Aid Type */}
              <FormField
                label="Aid Type"
                error={errors.type?.message}
              >
                <select
                  {...register('type', {
                    required: 'Aid type is required',
                  })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select aid category</option>
                  {aidCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Quantity */}
              <FormField
                label="Quantity"
                error={errors.quantity?.message}
              >
                <input
                  {...register('quantity', {
                    required: 'Quantity is required',
                    valueAsNumber: true,
                    min: { value: 1, message: 'Must be at least 1' },
                  })}
                  type="number"
                  placeholder="Enter quantity"
                  step="0.01"
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

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  onClick={() => navigate(isEditing ? `/aid/${id}` : '/aid')}
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : isEditing ? 'Update Aid' : 'Add Aid'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CreateEditAidPage
