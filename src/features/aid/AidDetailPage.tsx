/**
 * Aid Detail Page
 * View comprehensive aid information
 */

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { useToast } from '@hooks/useNotification'
import { aidService } from '@services/aid.service'
import { Spinner } from '@components/Spinner'
import { Card } from '@components/Card'
import { Badge } from '@components/Badge'
import { Button } from '@components/Button'
import type { Aid } from '@/shared/types'

const AidDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { success, error } = useToast()
  const [aid, setAid] = useState<Aid | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchAid = async () => {
      try {
        setLoading(true)
        // Mock aid for now - in real app would fetch by ID
        setAid({
          id: id || '1',
          name: 'Sample Aid',
          type: 'FOOD',
          quantity: 100,
          requiresRefrigeration: false,
          createdAt: new Date().toISOString(),
          // UI-only fields
          familyId: '',
          unit: 'kg',
          description: 'Sample aid',
          addedAt: new Date().toISOString(),
        })
      } catch (err) {
        error('Error loading aid')
        navigate('/aid')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchAid()
    }
  }, [id, user, navigate, error])

  const handleDelete = async () => {
    if (!aid || !confirm('Delete this aid?')) return

    try {
      const response = await aidService.deleteAid(aid.id)
      if (response.success) {
        success('Aid deleted')
        navigate('/aid')
      } else {
        error('Failed to delete aid')
      }
    } catch (err) {
      error('Error deleting aid')
    }
  }

  if (loading) {
    return (
      <>
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Spinner />
          </div>
        </div>
      </>
    )
  }

  if (!aid) {
    return (
      <>
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Card bordered className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Aid not found
              </p>
              <Button onClick={() => navigate('/aid')}>
                Back to Aid
              </Button>
            </Card>
          </div>
        </div>
      </>
    )
  }

  return (
    <>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => navigate('/aid')}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              ← Back to Aid
            </button>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate(`/aid/${aid.id}/edit`)}
                variant="ghost"
              >
                Edit
              </Button>
              <Button onClick={handleDelete} className="bg-danger hover:bg-danger-600">
                Delete
              </Button>
            </div>
          </div>

          {/* Header Section */}
          <Card bordered className="p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {aid.type}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Aid ID: {aid.id}
                  </p>
                </div>
                <Badge variant="success">
                  Distributed
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Quantity
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {aid.quantity}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Unit
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {aid.unit}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Type
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                  {aid.type?.toLowerCase()}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Date Added
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {new Date(aid.addedAt || '').toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Aid Information */}
          <Card bordered className="p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Aid Information
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Aid Type
                </p>
                <p className="text-gray-900 dark:text-white text-lg capitalize">
                  {aid.type?.toLowerCase()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Quantity
                </p>
                <p className="text-gray-900 dark:text-white">
                  {aid.quantity} {aid.unit}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Description
                </p>
                <p className="text-gray-900 dark:text-white">
                  {aid.description || 'No description provided'}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Added Date
                </p>
                <p className="text-gray-900 dark:text-white">
                  {new Date(aid.addedAt || '').toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <Card bordered className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Details
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                <p className="text-sm text-primary-600 dark:text-primary-400 mb-1">
                  Total Quantity
                </p>
                <p className="text-3xl font-bold text-primary-900 dark:text-primary-100">
                  {aid.quantity}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-success-50 dark:bg-success-900/20">
                <p className="text-sm text-success-600 dark:text-success-400 mb-1">
                  Unit Type
                </p>
                <p className="text-3xl font-bold text-success-900 dark:text-success-100">
                  {aid.unit}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-info-50 dark:bg-info-900/20">
                <p className="text-sm text-info-600 dark:text-info-400 mb-1">
                  Aid Type
                </p>
                <p className="text-3xl font-bold text-info-900 dark:text-info-100 capitalize">
                  {aid.type?.toLowerCase()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default AidDetailPage
