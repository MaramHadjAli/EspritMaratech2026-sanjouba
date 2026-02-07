/**
 * Home Page
 * Main dashboard for authenticated users
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@hooks/useAuth'
import { useNotification } from '@hooks/useNotification'
import { useDashboardStats } from '@hooks/useDashboardStats'
import { Button } from '@components/Button'
import { Card } from '@components/Card'
import { Badge } from '@components/Badge'
import { Spinner } from '@components/Spinner'
import Header from '@components/Header'
import { Visit } from '@types'
import { visitService } from '@core/services/visit.service'



interface DashboardStats {
  totalFamilies: number
  totalVisits: number
  totalAidDistributed: number
  totalRegions: number
}

const HomePage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, isRestoring } = useAuth()
  const { addNotification } = useNotification()
  const { stats, loading: statsLoading } = useDashboardStats()

  const [loading, setLoading] = useState(true)
  const [upcomingVisits, setUpcomingVisits] = useState<Visit[]>([])

  useEffect(() => {
    if (isRestoring) {
      return
    }

    if (!user) {
      navigate('/login')
      return
    }

    const fetchVisits = async () => {
      try {
        setLoading(true)
        
        // Fetch upcoming visits from /event/upcoming
        const visitsData = await visitService.getUpcomingVisits(5)
        const visits = Array.isArray(visitsData) ? visitsData : (visitsData.data || [])
        
        const mappedVisits: Visit[] = visits.slice(0, 5).map((visit: any) => ({
          id: visit.id || '',
          startDate: visit.startDate || new Date().toISOString(),
          endDate: visit.endDate,
          latitude: visit.latitude,
          longitude: visit.longitude,
          city: visit.city || '',
          region: visit.region || '',
          isActive: visit.isActive ?? true,
          isCompleted: visit.isCompleted ?? false,
          statsComputed: visit.statsComputed ?? false,
          notes: visit.notes,
          users: visit.users || [],
          // UI-only fields
          campaignName: `Visit to ${visit.city || 'Unknown'}`,
          address: `${visit.city || ''}, ${visit.region || ''}`.trim().replace(/^,\s*/, ''),
          location: visit.latitude && visit.longitude ? {
            latitude: visit.latitude,
            longitude: visit.longitude
          } : undefined,
          personCount: visit.users?.length || 0,
          status: visit.isCompleted ? 'COMPLETED' : (visit.isActive ? 'ACTIVE' : 'CANCELLED'),
        }))
        setUpcomingVisits(mappedVisits)
      } catch (error) {
        console.error('Failed to fetch visits:', error)
        addNotification({ type: 'error', message: 'Failed to load upcoming visits' })
      } finally {
        setLoading(false)
      }
    }

    fetchVisits()
  }, [user, navigate, addNotification, isRestoring])

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" label={t('common.loading') || 'Loading...'} />
      </div>
    )
  }

  return (
    <div className="py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here's what's happening with your charitable work today.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Button
              onClick={() => navigate('/visits/create')}
              className="flex items-center justify-center gap-2"
            >
              📍 Create Visit
            </Button>
            <Button
              onClick={() => navigate('/aid/add')}
              variant="ghost"
              className="flex items-center justify-center gap-2"
            >
              💝 Add Aid
            </Button>
            <Button
              onClick={() => navigate('/families/add')}
              variant="ghost"
              className="flex items-center justify-center gap-2"
            >
              👥 Add Family
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              className="flex items-center justify-center gap-2"
            >
              📊 View Dashboard
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card bordered className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Families Supported
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats.totalFamilies.toLocaleString()}
                  </p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </Card>

            <Card bordered className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Visits Completed
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats.totalVisits.toLocaleString()}
                  </p>
                </div>
                <div className="text-4xl">📍</div>
              </div>
            </Card>

            <Card bordered className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Aid Distributed (TND)
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats.totalAidDistributed.toLocaleString()}
                  </p>
                </div>
                <div className="text-4xl">💝</div>
              </div>
            </Card>

            <Card bordered className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Active Regions
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats.totalRegions}
                  </p>
                </div>
                <div className="text-4xl">🗺️</div>
              </div>
            </Card>
          </div>

          {/* Upcoming Visits Section */}
          <Card bordered className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Upcoming Visits
              </h2>
              <Button
                onClick={() => navigate('/visits')}
                size="sm"
                variant="ghost"
              >
                View All →
              </Button>
            </div>

            {upcomingVisits.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No upcoming visits scheduled
                </p>
                <Button onClick={() => navigate('/visits/create')}>
                  Schedule a Visit
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingVisits.map((visit) => (
                  <div
                    key={visit.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {visit.campaignName}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {visit.startDate && (
                          <span>📅 {new Date(visit.startDate).toLocaleDateString()} at {new Date(visit.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        )}
                        {visit.address && <span>📍 {visit.address}</span>}
                        {(visit.personCount ?? 0) > 0 && <span>👥 {visit.personCount} team member{(visit.personCount ?? 1) !== 1 ? 's' : ''}</span>}
                        {visit.notes && <span className="text-xs italic">✏️ {visit.notes}</span>}
                      </div>
                    </div>
                    <div className="ml-4">
                      <Badge variant="success">{visit.status || 'ACTIVE'}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Activity Section */}
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {/* My Tasks */}
            <Card bordered className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                My Tasks
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'Review pending aid requests', completed: false },
                  { title: 'Update family information', completed: true },
                  { title: 'Schedule region visit', completed: false },
                ].map((task, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      readOnly
                      className="w-5 h-5 rounded"
                    />
                    <span
                      className={`${
                        task.completed
                          ? 'line-through text-gray-400'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Team News */}
            <Card bordered className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Team News
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    New volunteer joined!
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">5 minutes ago</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    25 families received aid
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">2 hours ago</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    North region visit completed
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">Yesterday</p>
                </div>
              </div>
            </Card>
          </div>
    </div>
  )
}

export default HomePage
