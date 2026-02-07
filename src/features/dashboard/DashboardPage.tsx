/**
 * Dashboard Page
 * Analytics and statistics overview
 */

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@hooks/useAuth'
import { useToast } from '@hooks/useNotification'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/Button'
import { Card } from '@components/Card'
import { Badge } from '@components/Badge'
import { Spinner } from '@components/Spinner'
import Header from '@components/Header'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { dashboardService } from '@core/services/dashboard.service'
import { DashboardStats } from '@types'

const DashboardPage: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardStats>({
    totalFamilies: 0,
    totalVisits: 0,
    totalAidsDistributed: 0,
    totalRegions: 0,
    visitsEvolution: [],
    aidDistribution: [],
    regionalStats: [],
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await dashboardService.getDashboardStats({})
        if (response.data) {
          setData(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, navigate, toast])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" label={t('common.loading') || 'Loading...'} />
      </div>
    )
  }

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Overview of your charitable activities and statistics
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card bordered className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Total Families
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {data.totalFamilies.toLocaleString()}
                  </p>
                  <Badge variant="success" className="mt-3">
                    ↑ 12% vs last month
                  </Badge>
                </div>
              </div>
            </Card>

            <Card bordered className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Total Visits
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {data.totalVisits.toLocaleString()}
                  </p>
                  <Badge variant="success" className="mt-3">
                    ↑ 8% vs last month
                  </Badge>
                </div>
              </div>
            </Card>

            <Card bordered className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Aid Distributed (TND)
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {data.totalAidsDistributed.toLocaleString()}
                  </p>
                  <Badge variant="info" className="mt-3">
                    ~15K per region
                  </Badge>
                </div>
              </div>
            </Card>

            <Card bordered className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Active Regions
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {data.totalRegions}
                  </p>
                  <Badge variant="warning" className="mt-3">
                    2 regions pending
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Visits Evolution Chart */}
            <Card bordered className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Visits Evolution
              </h3>
              {data.visitsEvolution && data.visitsEvolution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.visitsEvolution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="visits"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Visits"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-300 flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </Card>

            {/* Aid Distribution Chart */}
            <Card bordered className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Aid Distribution by Type
              </h3>
              {data.aidDistribution && data.aidDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.aidDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.aidDistribution?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-300 flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </Card>
          </div>

          {/* Regional Stats Table */}
          <Card bordered className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Regional Statistics
            </h3>
            {data.regionalStats && data.regionalStats.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left text-sm font-semibold text-gray-900 dark:text-white py-3">
                        Region
                      </th>
                      <th className="text-left text-sm font-semibold text-gray-900 dark:text-white py-3">
                        Families
                      </th>
                      <th className="text-left text-sm font-semibold text-gray-900 dark:text-white py-3">
                        Visits
                      </th>
                      <th className="text-left text-sm font-semibold text-gray-900 dark:text-white py-3">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.regionalStats?.map((stat, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="py-3 text-gray-900 dark:text-white">{stat.region}</td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">
                          {stat.families.toLocaleString()}
                        </td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">
                          {stat.visits.toLocaleString()}
                        </td>
                        <td className="py-3">
                          <Badge variant={stat.visits > 50 ? 'success' : 'warning'}>
                            {stat.visits > 50 ? 'Active' : 'Pending'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No regional data available
              </div>
            )}
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <Button onClick={() => navigate('/visits')}>View All Visits</Button>
            <Button variant="ghost" onClick={() => navigate('/home')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
