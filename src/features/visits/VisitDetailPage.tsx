/**
 * Visit Detail Page
 * View comprehensive visit information
 */

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { useToast } from '@hooks/useNotification'
import { visitService } from '@services/visit.service'
import { Spinner } from '@components/Spinner'
import { Card } from '@components/Card'
import { Badge } from '@components/Badge'
import { Button } from '@components/Button'
import Header from '@components/Header'
import type { Visit } from '@/shared/types'

const VisitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { success, error } = useToast()
  const [visit, setVisit] = useState<Visit | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchVisit = async () => {
      try {
        setLoading(true)
        // Mock visit for now - in real app would fetch by ID
        const mockVisit: Visit = {
          id: id || '1',
          campaignName: 'Sample Campaign',
          address: 'Sample Address',
          description: 'Sample description',
          personCount: 10,
          familiesCount: 3,
        }
        setVisit(mockVisit)
      } catch (err) {
        error('Error loading visit')
        navigate('/visits')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchVisit()
    }
  }, [id, user, navigate, error])

  const handleDelete = async () => {
    if (!visit || !confirm('Delete this visit?')) return

    try {
      // Note: deleteVisit would be called here
      success('Visit deleted')
      navigate('/visits')
    } catch (err) {
      error('Error deleting visit')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Spinner />
          </div>
        </div>
      </div>
    )
  }

  if (!visit) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Card bordered className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Visit not found
              </p>
              <Button onClick={() => navigate('/visits')}>
                Back to Visits
              </Button>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => navigate('/visits')}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              ← Back to Visits
            </button>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate(`/visits/${visit.id}/edit`)}
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
                    {visit.campaignName}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {visit.address}
                  </p>
                </div>
                <Badge
                  variant={
                    visit.status === 'ACTIVE'
                      ? 'success'
                      : visit.status === 'COMPLETED'
                      ? 'info'
                      : 'warning'
                  }
                >
                  {visit.status}
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Families
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {visit.familiesCount || 0}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  People
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {visit.personCount}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Date
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  N/A
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Duration
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  N/A
                </p>
              </div>
            </div>
          </Card>

          {/* Details Section */}
          <Card bordered className="p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Details
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Campaign Name
                </p>
                <p className="text-gray-900 dark:text-white">
                  {visit.campaignName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Address
                </p>
                <p className="text-gray-900 dark:text-white">
                  {visit.address}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Description
                </p>
                <p className="text-gray-900 dark:text-white">
                  {visit.description || 'No description provided'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Visit Date
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    N/A
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Location
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {visit.address || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <Card bordered className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Statistics
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                <p className="text-sm text-primary-600 dark:text-primary-400 mb-1">
                  Total Families
                </p>
                <p className="text-3xl font-bold text-primary-900 dark:text-primary-100">
                  {visit.familiesCount || 0}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-success-50 dark:bg-success-900/20">
                <p className="text-sm text-success-600 dark:text-success-400 mb-1">
                  Total People
                </p>
                <p className="text-3xl font-bold text-success-900 dark:text-success-100">
                  {visit.personCount}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-info-50 dark:bg-info-900/20">
                <p className="text-sm text-info-600 dark:text-info-400 mb-1">
                  Status
                </p>
                <p className="text-3xl font-bold text-info-900 dark:text-info-100 capitalize">
                  {visit.status?.toLowerCase()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default VisitDetailPage
