/**
 * Families Page
 * Manage family records with CRUD operations
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@hooks/useAuth'
import { useToast } from '@hooks/useNotification'
import { Button } from '@components/Button'
import { Card } from '@components/Card'
import { Badge } from '@components/Badge'
import { Spinner } from '@components/Spinner'
import Header from '@components/Header'
import { familyService } from '@core/services/family.service'
import { Family } from '@types'

const FamiliesPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()

  const [loading, setLoading] = useState(true)
  const [families, setFamilies] = useState<Family[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRegion, setFilterRegion] = useState<string>('all')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchFamilies = async () => {
      try {
        setLoading(true)
        const response = await familyService.getAllFamilies(1, 50, {})
        setFamilies(response.data?.items || [])
      } catch (error) {
        console.error('Failed to fetch families:', error)
        toast.error('Failed to load families')
      } finally {
        setLoading(false)
      }
    }

    fetchFamilies()
  }, [user, navigate, toast])

  const filteredFamilies = families.filter((family) => {
    const matchesSearch = family.headOfFamily?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         family.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" label={t('common.loading') || 'Loading...'} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Families
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and track all family records
              </p>
            </div>
            <Button onClick={() => navigate('/families/add')}>
              Add New Family
            </Button>
          </div>

          {/* Search & Filter */}
          <Card bordered className="p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Search families..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Regions</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
                <option value="center">Center</option>
              </select>
              <Button variant="ghost" onClick={() => {
                setSearchTerm('')
                setFilterRegion('all')
              }}>
                Clear Filters
              </Button>
            </div>
          </Card>

          {/* Families List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFamilies.length === 0 ? (
              <Card bordered className="p-12 text-center md:col-span-2 lg:col-span-3">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm || filterRegion !== 'all' ? 'No families found' : 'No families yet'}
                </p>
                <Button onClick={() => navigate('/families/add')}>
                  Add First Family
                </Button>
              </Card>
            ) : (
              filteredFamilies.map((family) => (
                <Card
                  key={family.id}
                  bordered
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/families/${family.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {family.headOfFamily}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {family.familySize} members
                      </p>
                    </div>
                    <Badge variant="info">
                      Size: {family.numberOfMembers}
                    </Badge>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400">
                    📍 {family.address}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    📱 {family.phoneNumber}
                  </p>

                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/families/${family.id}/edit`)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-danger"
                      onClick={(e) => {
                        e.stopPropagation()
                        // TODO: Delete family
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FamiliesPage
