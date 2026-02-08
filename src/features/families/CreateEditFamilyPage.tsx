/**
 * Create/Edit Family Page
 * Create new or edit existing family
 */

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '@hooks/useAuth'
import { useToast } from '@hooks/useNotification'
import { familyService } from '@services/family.service'
import { Card } from '@components/Card'
import { FormField } from '@components/FormField'
import { Button } from '@components/Button'
import { Spinner } from '@components/Spinner'
import { CheckboxInput } from '@components/CheckboxInput'
import type { Family } from '@/shared/types'

interface FamilyFormData {
  lastName: string
  phone: string
  address: string
  numberOfMembers: number
  containsDisabledMember: boolean
  containsElderlyMember: boolean
  containspupilMember: boolean
}

const CreateEditFamilyPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { success } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FamilyFormData>({
    defaultValues: {
      lastName: '',
      phone: '',
      address: '',
      numberOfMembers: 1,
      containsDisabledMember: false,
      containsElderlyMember: false,
      containspupilMember: false,
    },
  })

  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(!!id)
  const [needsCatalog, setNeedsCatalog] = useState<string[]>([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([])

  const isEditing = !!id
  const containsDisabled = watch('containsDisabledMember')
  const containsElderly = watch('containsElderlyMember')
  const containsPupil = watch('containspupilMember')

  // Load needs catalog on mount
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setCatalogLoading(true)
        const response = await familyService.getNeedCatalog()
        const needs = response?.data ?? response
        setNeedsCatalog(Array.isArray(needs) ? needs : [])
      } catch (err) {
        console.error('Error loading needs catalog:', err)
        setNeedsCatalog([])
      } finally {
        setCatalogLoading(false)
      }
    }
    loadCatalog()
  }, [])

  // Load family data when editing
  useEffect(() => {
    if (isEditing && id) {
      const fetchFamily = async () => {
        try {
          setLoading(true)
          console.log('🔍 FETCHING family with id:', id)
          const response = await familyService.getFamilyById(id)
          console.log('📥 API RESPONSE:', response)
          
          // Response is the family object directly, not wrapped in {success, data}
          const family = response as any
          console.log('👨‍👩‍👧 Family object:', family)
          
          if (family && family.id) {
            const resetData = {
              lastName: family.LastName || family.lastName || '',
              phone: family.phone || '',
              address: family.address || '',
              numberOfMembers: family.numberOfMembers || 1,
              containsDisabledMember: family.containsDisabledMember || false,
              containsElderlyMember: family.containsElderlyMember || false,
              containspupilMember: family.containspupilMember || false,
            }
            console.log('📋 Reset data to apply:', resetData)
            
            reset(resetData)
            console.log('✅ Reset called with data')

            // Fetch needs separately
            try {
              const needsResponse = await familyService.getFamilyNeeds(id)
              const needs = needsResponse?.data ?? needsResponse
              console.log('📝 Family needs:', needs)
              if (Array.isArray(needs)) {
                // Extract category names from the needs objects
                const categories = needs.map((need: any) => need.category || need).filter(Boolean)
                setSelectedNeeds(categories)
              }
            } catch (err) {
              console.error('Error fetching family needs:', err)
            }
          }
        } catch (err) {
          console.error('Error fetching family:', err)
        } finally {
          setLoading(false)
        }
      }

      fetchFamily()
    }
  }, [id, isEditing, reset])

  if (!user) {
    navigate('/login')
    return null
  }

  const onSubmit = async (data: FamilyFormData) => {
    try {
      setSubmitting(true)

      if (isEditing) {
        const response = await familyService.updateFamily(id!, data as any)
        // Response is the family object directly
        const family = response as any  
        if (family && family.id) {
          // Update needs separately if any are selected
          if (selectedNeeds.length > 0) {
            const needsData = selectedNeeds.map((category) => ({
              category,
              priority: 3, // Default priority
              notes: '',
            }))
            console.log('📤 Upserting needs:', needsData)
            await familyService.upsertFamilyNeeds(id!, needsData)
          }
          
          // Refetch the family to show updated data
          const updatedResponse = await familyService.getFamilyById(id!)
          const updatedFamily = updatedResponse as any
          
          if (updatedFamily && updatedFamily.id) {
            const resetData = {
              lastName: updatedFamily.LastName || updatedFamily.lastName || '',
              phone: updatedFamily.phone || '',
              address: updatedFamily.address || '',
              numberOfMembers: updatedFamily.numberOfMembers || 1,
              containsDisabledMember: updatedFamily.containsDisabledMember || false,
              containsElderlyMember: updatedFamily.containsElderlyMember || false,
              containspupilMember: updatedFamily.containspupilMember || false,
            }
            reset(resetData)

            // Also refetch needs
            try {
              const needsResponse = await familyService.getFamilyNeeds(id!)
              const needs = needsResponse?.data ?? needsResponse
              if (Array.isArray(needs)) {
                const categories = needs.map((need: any) => need.category || need).filter(Boolean)
                setSelectedNeeds(categories)
              }
            } catch (err) {
              console.error('Error refetching family needs:', err)
            }
          }
          
          success('Family updated successfully')
        }
      } else {
        const response = await familyService.createFamily(data as any)
        // Response is the family object directly
        const family = response as any
        if (family && family.id) {
          // Add needs for new family if any are selected
          if (selectedNeeds.length > 0) {
            const needsData = selectedNeeds.map((category) => ({
              category,
              priority: 3, // Default priority
              notes: '',
            }))
            console.log('📤 Upserting needs:', needsData)
            await familyService.upsertFamilyNeeds(family.id, needsData)
          }
          success('Family created successfully')
          navigate('/families')
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" label="Loading family data..." />
      </div>
    )
  }

  return (
    <div className="py-8 max-w-2xl mx-auto">
      {/* Navigation */}
      <button
        onClick={() => navigate('/families')}
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
          {/* Last Name */}
          <FormField
            label="Last Name"
            error={errors.lastName?.message}
          >
            <input
              {...register('lastName', {
                required: 'Last name is required',
              })}
              type="text"
              placeholder="Enter last name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </FormField>

          {/* Number of Members */}
          <FormField
            label="Number of Members"
            error={errors.numberOfMembers?.message}
          >
            <input
              {...register('numberOfMembers', {
                required: 'Number of members is required',
                valueAsNumber: true,
                min: { value: 1, message: 'Must be at least 1' },
              })}
              type="number"
              placeholder="Enter total family members"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </FormField>

          {/* Phone Number */}
          <FormField
            label="Phone Number"
            error={errors.phone?.message}
          >
            <input
              {...register('phone')}
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

          {/* Family Characteristics */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Family Characteristics</p>
            
            <CheckboxInput
              {...register('containsDisabledMember')}
              label="Contains Disabled Member"
              checked={containsDisabled}
            />

            <CheckboxInput
              {...register('containsElderlyMember')}
              label="Contains Elderly Member"
              checked={containsElderly}
            />

            <CheckboxInput
              {...register('containspupilMember')}
              label="Contains Student/Pupil Member"
              checked={containsPupil}
            />
          </div>

          {/* Family Needs */}
          {!catalogLoading && needsCatalog.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-3 border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Family Needs</p>
              <div className="grid grid-cols-2 gap-3">
                {needsCatalog.map((need) => (
                  <label key={need} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedNeeds.includes(need)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedNeeds([...selectedNeeds, need])
                        } else {
                          setSelectedNeeds(selectedNeeds.filter((n) => n !== need))
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{need}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              onClick={() => navigate('/families')}
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
