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
import { WelcomeText } from '@components/SplitText'
import { Visit } from '@types'
import { visitService } from '@core/services/visit.service'

// SVG Icons for premium look
const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
)

const HeartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
)

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
)

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
)

const MapIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
  </svg>
)



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
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          {/* Welcome Section with SplitText Animation */}
          <div>
            <WelcomeText 
              greeting={t('home.welcome') || 'Welcome,'} 
              name={user?.name || 'User'}
              className="mb-3"
            />
            <p className="text-lg text-gray-500 dark:text-gray-400 animate-fade-in-up opacity-0" style={{ animationDelay: '2.5s', animationFillMode: 'forwards' }}>
              {t('home.welcomeMessage') || "Here's what's happening with your charitable work today."}
            </p>
          </div>

          {/* Quick Action Cards - Premium style */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/visits/create')}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <LocationIcon />
              </div>
              <span className="text-sm font-semibold">{t('home.createVisit') || 'Schedule Visit'}</span>
            </button>
            <button
              onClick={() => navigate('/aid/add')}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <HeartIcon />
              </div>
              <span className="text-sm font-semibold">{t('aid.addAid') || 'Add Aid'}</span>
            </button>
            <button
              onClick={() => navigate('/families/add')}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UsersIcon />
              </div>
              <span className="text-sm font-semibold">{t('families.addFamily') || 'Add Family'}</span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ChartIcon />
              </div>
              <span className="text-sm font-semibold">{t('navigation.dashboard') || 'Dashboard'}</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <Card bordered className="p-5 group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium truncate">
                    {t('dashboard.totalFamilies') || 'Total Families'}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.totalFamilies.toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 dark:bg-primary-900/50 rounded-xl flex-shrink-0 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                  <UsersIcon />
                </div>
              </div>
            </Card>

            <Card bordered className="p-5 group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium truncate">
                    {t('dashboard.activeVisits') || 'Active Visits'}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.totalVisits.toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary-100 dark:bg-secondary-900/50 rounded-xl flex-shrink-0 flex items-center justify-center text-secondary-600 dark:text-secondary-400 group-hover:scale-110 transition-transform">
                  <LocationIcon />
                </div>
              </div>
            </Card>

            <Card bordered className="p-5 group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium truncate">
                    {t('dashboard.totalAid') || 'Total Aid Distributed'}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.totalAidDistributed.toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-100 dark:bg-rose-900/50 rounded-xl flex-shrink-0 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                  <HeartIcon />
                </div>
              </div>
            </Card>

            <Card bordered className="p-5 group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium truncate">
                    {t('common.region') || 'Region'}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.totalRegions}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex-shrink-0 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <MapIcon />
                </div>
              </div>
            </Card>
          </div>

          {/* Upcoming Visits Section */}
          <Card bordered className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {t('home.upcomingVisits') || 'Upcoming Visits'}
              </h2>
              <Button
                onClick={() => navigate('/visits')}
                size="sm"
                variant="ghost"
              >
                {t('home.viewAll') || 'View All'} →
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
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                        {visit.campaignName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {visit.startDate && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                            {new Date(visit.startDate).toLocaleDateString()} at {new Date(visit.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                        {visit.address && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                            {visit.address}
                          </span>
                        )}
                        {(visit.personCount ?? 0) > 0 && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                            {visit.personCount} team member{(visit.personCount ?? 1) !== 1 ? 's' : ''}
                          </span>
                        )}
                        {visit.notes && (
                          <span className="flex items-center gap-1 text-xs italic text-gray-400">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                            {visit.notes}
                          </span>
                        )}
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
          <div className="grid md:grid-cols-2 gap-6">
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
