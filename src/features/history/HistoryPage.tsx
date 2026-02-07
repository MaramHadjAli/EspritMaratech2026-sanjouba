/**
 * History/Campaigns Page
 * View campaign history and statistics
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
import { visitService } from '@core/services/visit.service'
import { Visit } from '@types'

const HistoryPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()

  const [loading, setLoading] = useState(true)
  const [visits, setVisits] = useState<Visit[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('COMPLETED')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchVisits = async () => {
      try {
        setLoading(true)
        const response = await visitService.getAllVisits(1, 100)
        setVisits(response.data?.items || [])
      } catch (error) {
        console.error('Failed to fetch campaigns:', error)
        toast.error('Failed to load campaign history')
      } finally {
        setLoading(false)
      }
    }

    fetchVisits()
  }, [user, navigate, toast])

  const filteredVisits = visits.filter((visit) => {
    const matchesSearch = visit.campaignName.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Campaign History
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View all completed and past campaigns
            </p>
          </div>

          {/* Search & Filter */}
          <Card bordered className="p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Search campaigns..."
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
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="ACTIVE">Active</option>
              </select>
              <Button variant="ghost" onClick={() => {
                setSearchTerm('')
                setFilterStatus('all')
              }}>
                Clear Filters
              </Button>
            </div>
          </Card>

          {/* Timeline View */}
          <div className="space-y-4">
            {filteredVisits.length === 0 ? (
              <Card bordered className="p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No campaigns found
                </p>
                <Button onClick={() => navigate('/visits')}>
                  View Active Campaigns
                </Button>
              </Card>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-transparent" />

                {/* Timeline items */}
                {filteredVisits.map((visit, idx) => (
                  <div key={visit.id} className="relative pl-24 pb-8">
                    {/* Timeline dot */}
                    <div className="absolute left-2 top-2 w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                      {idx + 1}
                    </div>

                    <Card bordered className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {visit.campaignName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {visit.description}
                          </p>
                        </div>
                        <Badge variant={
                          visit.status === 'COMPLETED' ? 'success' :
                          visit.status === 'CANCELLED' ? 'danger' :
                          'info'
                        }>
                          {visit.status}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <span className="font-medium">📅 Date</span>
                          <p>{visit.startTime}</p>
                        </div>
                        <div>
                          <span className="font-medium">📍 Location</span>
                          <p>{visit.address}</p>
                        </div>
                        <div>
                          <span className="font-medium">👥 Participants</span>
                          <p>{visit.personCount} people</p>
                        </div>
                        <div>
                          <span className="font-medium">👨‍👩‍👧‍👦 Families</span>
                          <p>{visit.familiesCount} families</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button size="sm" variant="ghost" onClick={() => navigate(`/visits/${visit.id}`)}>
                          View Details
                        </Button>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryPage
