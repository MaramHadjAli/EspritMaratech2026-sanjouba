/**
 * Visits List Page
 * Display visits in three tabs: Upcoming, Active, History
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

type TabType = 'upcoming' | 'active' | 'history'

const VisitsPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()

  const [activeTab, setActiveTab] = useState<TabType>('active')
  const [loading, setLoading] = useState(true)
  const [visits, setVisits] = useState<Visit[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchVisits = async () => {
      try {
        setLoading(true)
        let response
        
        switch (activeTab) {
          case 'upcoming':
            response = await visitService.getUpcomingVisits()
            break
          case 'active':
            response = await visitService.getActiveVisits()
            break
          case 'history':
            response = await visitService.getPreviousVisits()
            break
        }
        
        const data = response?.data ?? response
        setVisits(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch visits:', error)
        setVisits([])
      } finally {
        setLoading(false)
      }
    }

    fetchVisits()
  }, [user, navigate, activeTab])

  const handleJoinVisit = async (visitId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await visitService.joinVisit(visitId)
      toast.success('Successfully joined the visit')
      // Refresh the visits list
      const response = await (activeTab === 'upcoming' 
        ? visitService.getUpcomingVisits()
        : activeTab === 'active'
        ? visitService.getActiveVisits()
        : visitService.getPreviousVisits())
      const data = response?.data ?? response
      setVisits(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to join visit:', error)
      toast.error('Failed to join visit')
    }
  }

  const filteredVisits = visits.filter((visit) => {
    const matchesSearch = 
      (visit.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (visit.region || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (visit.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Visits
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and track all charitable visits
              </p>
            </div>
            <Button onClick={() => navigate('/visits/create')}>
              Create New Visit
            </Button>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === 'upcoming'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }
                  `}
                >
                  📅 Upcoming
                </button>
                <button
                  onClick={() => setActiveTab('active')}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === 'active'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }
                  `}
                >
                  ✅ Active
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === 'history'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }
                  `}
                >
                  📜 History
                </button>
              </nav>
            </div>
          </div>

          {/* Search */}
          <Card bordered className="p-4 mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search by city, region, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              {searchTerm && (
                <Button variant="ghost" onClick={() => setSearchTerm('')}>
                  Clear
                </Button>
              )}
            </div>
          </Card>

          {/* Visits List */}
          <div className="space-y-4">
            {filteredVisits.length === 0 ? (
              <Card bordered className="p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm ? 'No visits found matching your search' : 
                    activeTab === 'upcoming' ? 'No upcoming visits scheduled' :
                    activeTab === 'active' ? 'No active visits at the moment' :
                    'No previous visits yet'}
                </p>
                <Button onClick={() => navigate('/visits/create')}>
                  Create New Visit
                </Button>
              </Card>
            ) : (
              filteredVisits.map((visit) => {
                const isUserInVisit = visit.users?.some(u => u.id === user?.id)
                
                return (
                  <Card
                    key={visit.id}
                    bordered
                    className="p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => navigate(`/visits/${visit.id}`)}
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Visit to {visit.city}, {visit.region}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {visit.notes || 'No notes provided'}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>📅 {new Date(visit.startDate).toLocaleDateString()}</span>
                          {visit.endDate && <span>→ {new Date(visit.endDate).toLocaleDateString()}</span>}
                          <span>📍 {visit.city}, {visit.region}</span>
                          <span>👥 {visit.users?.length || 0} team members</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={
                          visit.isActive ? 'success' :
                          visit.isCompleted ? 'info' :
                          'warning'
                        }>
                          {visit.isActive ? 'ACTIVE' : visit.isCompleted ? 'COMPLETED' : 'PLANNED'}
                        </Badge>
                        
                        {visit.isActive && (
                          isUserInVisit ? (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/visits/${visit.id}`)
                              }}
                              className="bg-green-600 hover:bg-green-700 whitespace-nowrap"
                              size="sm"
                            >
                              Add Aid Distribution
                            </Button>
                          ) : (
                            <Button
                              onClick={(e) => handleJoinVisit(visit.id, e)}
                              variant="ghost"
                              size="sm"
                              className="whitespace-nowrap"
                            >
                              Join Visit
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })
            )}
          </div>
    </div>
  )
}

export default VisitsPage
