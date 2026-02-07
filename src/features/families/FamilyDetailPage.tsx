/**
 * Family Detail Page
 * View comprehensive family information
 */

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { useToast } from '@hooks/useNotification'
import { familyService } from '@services/family.service'
import { Spinner } from '@components/Spinner'
import { Card } from '@components/Card'
import { Badge } from '@components/Badge'
import { Button } from '@components/Button'
import type { Family } from '@/shared/types'

const FamilyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { success, error } = useToast()
  const [family, setFamily] = useState<Family | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchFamily = async () => {
      try {
        setLoading(true)
        // Mock family for now - in real app would fetch by ID
        const mockFamily: Family = {
          id: id || '1',
          lastName: 'Sample Family',
          numberOfMembers: 4,
          containsDisabledMember: false,
          containsElderlyMember: false,
          containspupilMember: true,
          vulnerabilityScore: 5,
          createdAt: new Date().toISOString(),
          // UI-only fields
          headOfFamily: 'Sample Family',
          familySize: 5,
          phoneNumber: '+216 99 999 999',
          address: 'Sample Address',
          name: 'Sample Family',
          updatedAt: new Date().toISOString(),
        }
        setFamily(mockFamily)
      } catch (err) {
        error('Error loading family')
        navigate('/families')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchFamily()
    }
  }, [id, user, navigate, error])

  const handleDelete = async () => {
    if (!family || !confirm('Delete this family?')) return

    try {
      // deleteFamily would be called here
      success('Family deleted')
      navigate('/families')
    } catch (err) {
      error('Error deleting family')
    }
  }

  if (loading) {
    return (
      <div className="py-8">
        <Spinner />
      </div>
    )
  }

  if (!family) {
    return (
      <div className="py-8">
        <Card bordered className="p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Family not found
          </p>
          <Button onClick={() => navigate('/families')}>
            Back to Families
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="py-8">
          {/* Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => navigate('/families')}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              ← Back to Families
            </button>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate(`/families/${family.id}/edit`)}
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
                    {family.headOfFamily}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Family ID: {family.id}
                  </p>
                </div>
                <Badge variant="success">
                  Active
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Family Size
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {family.familySize || 0}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Members
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {family.numberOfMembers || 0}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Phone
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {family.phoneNumber || 'N/A'}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Status
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  Active
                </p>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card bordered className="p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Contact Information
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Head of Family
                </p>
                <p className="text-gray-900 dark:text-white text-lg">
                  {family.headOfFamily}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Phone Number
                </p>
                <p className="text-gray-900 dark:text-white">
                  {family.phoneNumber || 'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Address
                </p>
                <p className="text-gray-900 dark:text-white">
                  {family.address || 'Not provided'}
                </p>
              </div>
            </div>
          </Card>

          {/* Family Details */}
          <Card bordered className="p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Family Details
            </h2>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Family Size
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {family.familySize || 0} people
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Number of Members
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {family.numberOfMembers || 0}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <Card bordered className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Statistics
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                <p className="text-sm text-primary-600 dark:text-primary-400 mb-1">
                  Family Size
                </p>
                <p className="text-3xl font-bold text-primary-900 dark:text-primary-100">
                  {family.familySize || 0}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-success-50 dark:bg-success-900/20">
                <p className="text-sm text-success-600 dark:text-success-400 mb-1">
                  Members Registered
                </p>
                <p className="text-3xl font-bold text-success-900 dark:text-success-100">
                  {family.numberOfMembers || 0}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-info-50 dark:bg-info-900/20">
                <p className="text-sm text-info-600 dark:text-info-400 mb-1">
                  Status
                </p>
                <p className="text-3xl font-bold text-info-900 dark:text-info-100">
                  Active
                </p>
              </div>
            </div>
          </Card>
    </div>
  )
}

export default FamilyDetailPage
