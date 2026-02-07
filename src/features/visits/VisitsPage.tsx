/**
 * Visits List Page
 * Display all visits with filters and search
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
import { visitService } from '@core/services/visit.service'
import { Visit } from '@types'

const VisitsPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()

  const [loading, setLoading] = useState(true)
  const [visits, setVisits] = useState<Visit[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchVisits = async () => {
      try {
        setLoading(true)
        const response = await visitService.getAllVisits(1, 50, {})
        setVisits(response.data?.items || [])
      } catch (error) {
        console.error('Failed to fetch visits:', error)
        toast.error('Failed to load visits')
      } finally {
        setLoading(false)
      }
    }

    fetchVisits()
  }, [user, navigate, toast])

  const filteredVisits = visits.filter((visit) => {
    const matchesSearch = visit.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visit.address?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || visit.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" label={t('common.loading') || 'Loading...'} />
      </div>
    )
  }

  return (
    <div className="py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                All Visits
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and track all charitable visits
              </p>
            </div>
            <Button onClick={() => navigate('/visits/create')}>
              Create New Visit
            </Button>
          </div>

          {/* Search & Filter */}
          <Card bordered className="p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Search visits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <Button variant="ghost" onClick={() => {
                setSearchTerm('')
                setFilterStatus('all')
              }}>
                Clear Filters
              </Button>
            </div>
          </Card>

          {/* Visits List */}
          <div className="space-y-4">
            {filteredVisits.length === 0 ? (
              <Card bordered className="p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm || filterStatus !== 'all' ? 'No visits found matching your filters' : 'No visits yet'}
                </p>
                <Button onClick={() => navigate('/visits/create')}>
                  Create First Visit
                </Button>
              </Card>
            ) : (
              filteredVisits.map((visit) => (
                <Card
                  key={visit.id}
                  bordered
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/visits/${visit.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {visit.campaignName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {visit.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>📅 {visit.startTime}</span>
                        <span>📍 {visit.address}</span>
                        <span>👥 {visit.personCount} participants</span>
                      </div>
                    </div>
                    <Badge variant={
                      visit.status === 'COMPLETED' ? 'success' :
                      visit.status === 'ACTIVE' ? 'success' :
                      'warning'
                    }>
                      {visit.status}
                    </Badge>
                  </div>
                </Card>
              ))
            )}
          </div>
    </div>
  )
}

export default VisitsPage
