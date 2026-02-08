/**
 * Create/Edit Visit Page
 * Create new or edit existing visit with location map and team members
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAuth } from '@hooks/useAuth'
import { useToast } from '@hooks/useNotification'
import { useDebounce } from '@hooks/useDebounce'
import { visitService } from '@services/visit.service'
import { userService } from '@services/user.service'
import { Card } from '@components/Card'
import { FormField } from '@components/FormField'
import { Button } from '@components/Button'
import { Spinner } from '@components/Spinner'
import type { CreateVisitData } from '@/shared/types'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

interface UserOption {
  id: string
  name: string
  email?: string
}

const CreateEditVisitPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { success, error: showError } = useToast()

  // State management
  const [submitting, setSubmitting] = useState(false)
  const [map, setMap] = useState<L.Map | null>(null)
  const [mapContainer, setMapContainer] = useState<HTMLElement | null>(null)
  const [userSearch, setUserSearch] = useState('')
  const [userResults, setUserResults] = useState<UserOption[]>([])
  const [userSearching, setUserSearching] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<UserOption[]>([])
  const [showUserResults, setShowUserResults] = useState(false)
  const [latitude, setLatitude] = useState(35.83)
  const [longitude, setLongitude] = useState(10.19)

  // Debounce user search query
  const debouncedUserSearch = useDebounce(userSearch, 1000)

  // Initialize form with proper defaults
  const form = useForm<CreateVisitData>({
    mode: 'onBlur',
    defaultValues: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: undefined,
      notes: undefined,
      userIds: undefined,
      latitude: latitude,
      longitude: longitude,
    },
  })

  const { register, handleSubmit, formState } = form
  const { errors } = formState
  const isEditing = !!id

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // Initialize map once DOM is ready
  useEffect(() => {
    const container = document.getElementById('visit-map')
    if (!container) return

    try {
      const newMap = L.map('visit-map').setView([latitude, longitude], 7)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(newMap)

      newMap.on('click', (e: L.LeafletMouseEvent) => {
        setLatitude(e.latlng.lat)
        setLongitude(e.latlng.lng)
      })

      setMap(newMap)
      setMapContainer(container)

      return () => {
        if (newMap) {
          newMap.remove()
        }
      }
    } catch (err) {
      console.error('Map initialization error:', err)
    }
  }, [])

  // Update map markers when location changes
  useEffect(() => {
    if (!map) return

    try {
      // Clear existing markers
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer)
        }
      })

      // Add new marker
      L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup('Visit Location')
    } catch (err) {
      console.error('Map update error:', err)
    }
  }, [map, latitude, longitude])

  // Auto search when debounced query changes
  useEffect(() => {
    if (!debouncedUserSearch.trim()) {
      setUserResults([])
      setShowUserResults(false)
      return
    }

    const performSearch = async () => {
      try {
        setUserSearching(true)
        const response = await userService.searchUsernames(debouncedUserSearch)
        const users = Array.isArray(response)
          ? response
          : response?.data?.users || response?.users || response?.data || []
        setUserResults(users)
        setShowUserResults(true)
      } catch (err) {
        console.error('User search error:', err)
        setUserResults([])
      } finally {
        setUserSearching(false)
      }
    }

    performSearch()
  }, [debouncedUserSearch])


  // Add user to selected list
  const addUser = (userOption: UserOption) => {
    if (!selectedUsers.find((u) => u.id === userOption.id)) {
      setSelectedUsers([...selectedUsers, userOption])
    }
    setUserSearch('')
    setShowUserResults(false)
  }

  // Remove user from selected list
  const removeUser = (userId: string) => {
    const updated = selectedUsers.filter((u) => u.id !== userId)
    setSelectedUsers(updated)
  }

  const onSubmit: SubmitHandler<CreateVisitData> = async (data: CreateVisitData) => {
    try {
      setSubmitting(true)

      // Add latitude, longitude, and userIds to the data
      const submitData: CreateVisitData = {
        ...data,
        latitude: latitude,
        longitude: longitude,
        userIds: selectedUsers.map((u) => u.id),
      }

      if (isEditing) {
        const response = await visitService.updateVisit(id!, submitData)
        if (response.success || response.data) {
          success('Visit updated successfully')
          navigate(`/visits/${id}`)
        } else {
          showError('Failed to update visit')
        }
      } else {
        const response = await visitService.createVisit(submitData)
        const createdVisit = (response as any)?.data ?? response
        if (createdVisit?.id) {
          success('Visit created successfully')
          navigate(`/visits/${createdVisit.id}`)
        } else if ((response as any)?.success) {
          success('Visit created successfully')
          navigate('/visits')
        } else {
          showError('Failed to create visit')
        }
      }
    } catch (err) {
      showError('An error occurred')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <button
          onClick={() => navigate(isEditing ? `/visits/${id}` : '/visits')}
          className="mb-6 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
        >
          ← Back to {isEditing ? 'Visit' : 'Visits'}
        </button>

        {/* Form Card */}
        <Card bordered className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isEditing ? 'Edit Visit' : 'Create New Visit'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {isEditing
              ? 'Update the visit information and assign team members if needed'
              : 'Fill in the details to create a new visit'}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Date Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Visit Dates
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Start Date */}
                <FormField
                  label="Start Date"
                  required
                  error={errors.startDate?.message}
                >
                  <input
                    {...register('startDate', {
                      required: 'Start date is required',
                    })}
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </FormField>

                {/* End Date */}
                <FormField label="End Date (Optional)" error={errors.endDate?.message}>
                  <input
                    {...register('endDate')}
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </FormField>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Additional Information
              </h2>

              <FormField label="Notes (Optional)" error={errors.notes?.message}>
                <textarea
                  {...register('notes', {
                    maxLength: {
                      value: 2000,
                      message: 'Notes cannot exceed 2000 characters',
                    },
                  })}
                  placeholder="Enter any additional notes about this visit..."
                  rows={4}
                  maxLength={2000}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </FormField>
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Visit Location
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Click on the map to select the visit location
              </p>

              <div
                id="visit-map"
                className="w-full h-96 rounded-lg border border-gray-300 dark:border-gray-600"
              />

              <div className="grid md:grid-cols-2 gap-4 pt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.00001"
                    readOnly
                    value={latitude.toFixed(5)}
                    className="w-full px-4 py-2 mt-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.00001"
                    readOnly
                    value={longitude.toFixed(5)}
                    className="w-full px-4 py-2 mt-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Team Members Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Assign Team Members (Optional)
              </h2>

              {/* User Search */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Search and Add Team Members
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by username..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />

                  {/* Search Results Dropdown */}
                  {showUserResults && userResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                      {userSearching ? (
                        <div className="p-4 flex justify-center">
                          <Spinner />
                        </div>
                      ) : (
                        userResults.map((userOption) => (
                          <button
                            key={userOption.id}
                            type="button"
                            onClick={() => addUser(userOption)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition"
                          >
                            <p className="font-medium text-gray-900 dark:text-white">
                              {userOption.name}
                            </p>
                            {userOption.email && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {userOption.email}
                              </p>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Users */}
              {selectedUsers.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Selected Team Members ({selectedUsers.length})
                  </label>
                  <div className="space-y-2">
                    {selectedUsers.map((userOption) => (
                      <div
                        key={userOption.id}
                        className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {userOption.name}
                          </p>
                          {userOption.email && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {userOption.email}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeUser(userOption.id)}
                          className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
    </div>
  )
}

export default CreateEditVisitPage
