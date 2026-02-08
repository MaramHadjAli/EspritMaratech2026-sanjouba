/**
 * Configurable Dashboard with Drag and Drop
 * Allows users to rearrange and customize which charts are displayed
 */

import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@hooks/useAuth'
import { useNotification } from '@hooks/useNotification'
import { useDashboardStats } from '@hooks/useDashboardStats'
import { useNavigate } from 'react-router-dom'
import { Button } from '@components/Button'
import { Spinner } from '@components/Spinner'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { dashboardService } from '@services/dashboard.service'
import {
  VisitsTimelineChart,
  AidPieChart,
  FamilySizeBarChart,
  PriorityFamiliesChart,
  CitiesVisitsHeatmap,
  GenericBarChart,
  GenericLineChart,
  GenericPieChart,
  StatCard,
} from './ChartComponents'
import { dashboardLayoutStore, ChartConfig, DashboardLayout } from '@stores/dashboardLayoutStore'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend)

type SeriesPoint = { label: string; value: number }

interface ChartData {
  timeline: SeriesPoint[]
  aids: SeriesPoint[]
  familySizes: SeriesPoint[]
  priorityFamilies: any[]
  citiesFamilies: SeriesPoint[]
  citiesVisits: SeriesPoint[]
  timeFamilies: SeriesPoint[]
  timeVisits: SeriesPoint[]
  timeNeedy: SeriesPoint[]
  aidsFrequency: SeriesPoint[]
  aidsType: SeriesPoint[]
  aidsTypeRegion: SeriesPoint[]
  familiesHistogram: SeriesPoint[]
  familiesVulnerability: SeriesPoint[]
  usersActivity: SeriesPoint[]
  visitsCompletion: number
  depositsSummary: any[]
  financialDistributed: number
  citiesActive: number
  familiesCount: number
  visitsCount: number
}

const extractData = (payload: any) => payload?.data ?? payload

const toArray = (payload: any) => {
  const data = extractData(payload)
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.items)) return data.items
  return []
}

const getNumberFrom = (item: any, keys: string[]) => {
  for (const key of keys) {
    const value = item?.[key]
    if (typeof value === 'number') return value
  }
  return 0
}

const getLabelFrom = (item: any, keys: string[]) => {
  for (const key of keys) {
    const value = item?.[key]
    if (typeof value === 'string' && value.trim().length > 0) return value
  }
  return ''
}

const normalizeSeries = (items: any[], labelKeys: string[], valueKeys: string[]): SeriesPoint[] => {
  if (!Array.isArray(items)) return []
  return items
    .map((item, index) => ({
      label: getLabelFrom(item, labelKeys) || `Item ${index + 1}`,
      value: getNumberFrom(item, valueKeys),
    }))
    .filter(point => point.value > 0)
}

const ConfigurableDashboard: React.FC = () => {
  const { t } = useTranslation()
  const { user, isRestoring } = useAuth()
  const navigate = useNavigate()
  const { addNotification } = useNotification()
  const { stats } = useDashboardStats()

  // Layout and UI state
  const [isEditMode, setIsEditMode] = useState(false)
  const [layout, setLayout] = useState<DashboardLayout>(dashboardLayoutStore.getLayout())
  const [draggedChart, setDraggedChart] = useState<string | null>(null)
  const [dragOverCell, setDragOverCell] = useState<string | null>(null)

  // Chart data state
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<ChartData>({
    timeline: [],
    aids: [],
    familySizes: [],
    priorityFamilies: [],
    citiesFamilies: [],
    citiesVisits: [],
    timeFamilies: [],
    timeVisits: [],
    timeNeedy: [],
    aidsFrequency: [],
    aidsType: [],
    aidsTypeRegion: [],
    familiesHistogram: [],
    familiesVulnerability: [],
    usersActivity: [],
    visitsCompletion: 0,
    depositsSummary: [],
    financialDistributed: 0,
    citiesActive: 0,
    familiesCount: 0,
    visitsCount: 0,
  })

  // Fetch chart data
  useEffect(() => {
    if (isRestoring) return
    if (!user) {
      navigate('/login')
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const results = await Promise.all([
          dashboardService.getVisitsTimeline(6),
          dashboardService.getAidsPie(6),
          dashboardService.getFamiliesSizeDistribution(),
          dashboardService.getPriorityFamilies(5),
          dashboardService.getCitiesFamilies(),
          dashboardService.getCitiesVisits(),
          dashboardService.getTimeFamilies(6),
          dashboardService.getTimeVisits(6),
          dashboardService.getTimeNeedyComparison(6),
          dashboardService.getAidsFrequency(),
          dashboardService.getAidsTypeBreakdownByRegion(),
          dashboardService.getFamiliesHistogram(),
          dashboardService.getFamiliesVulnerabilityProfile(),
          dashboardService.getUsersActivity(),
          dashboardService.getVisitsCompletionRate(),
          dashboardService.getDepositsSummary(),
          dashboardService.getAidsFinancialTotalDistributed(),
          dashboardService.getCitiesActiveCount(),
          dashboardService.getFamiliesCount(),
          dashboardService.getVisitsCount(),
        ])

        const [
          timelineRes, aidsRes, sizeRes, priorityRes, citiesFamRes, citiesVisRes,
          timeFamRes, timeVisRes, timeNeedyRes, aidsFreqRes, aidsTypeRes, famHistRes,
          famVulnRes, usersActRes, visitCompRes, depSummRes, finDistRes, citiesActRes,
          famCountRes, visCountRes
        ] = results

        setChartData({
          // visits/timeline returns: [{bucket, totalVisits, completedVisits}]
          timeline: normalizeSeries(toArray(timelineRes), ['bucket'], ['totalVisits']),
          
          // aids/pie returns: [{aidType, totalQuantity}]
          aids: normalizeSeries(toArray(aidsRes), ['aidType'], ['totalQuantity']),
          
          // families/size-distribution returns: [{size, familyCount}]
          familySizes: normalizeSeries(toArray(sizeRes), ['size'], ['familyCount']),
          
          // ai/priority-families returns array of family objects
          priorityFamilies: toArray(priorityRes),
          
          // cities/families returns: [{city, region, familyCount}]
          citiesFamilies: normalizeSeries(toArray(citiesFamRes), ['city'], ['familyCount']),
          
          // cities/visits returns: [{city, region, visitCount}]
          citiesVisits: normalizeSeries(toArray(citiesVisRes), ['city'], ['visitCount']),
          
          // time/families returns: [{bucket, familyCount}]
          timeFamilies: normalizeSeries(toArray(timeFamRes), ['bucket'], ['familyCount']),
          
          // time/visits returns: [{bucket, visitCount, completedCount}]
          timeVisits: normalizeSeries(toArray(timeVisRes), ['bucket'], ['visitCount']),
          
          // time/needy-comparison returns: {windowMonths, ranges: [{label, averageVulnerabilityScore}]}
          timeNeedy: normalizeSeries(
            toArray(extractData(timeNeedyRes)?.ranges || []),
            ['label'],
            ['averageVulnerabilityScore']
          ),
          
          // aids/frequency returns: [{aidType, distributionCount}]
          aidsFrequency: normalizeSeries(toArray(aidsFreqRes), ['aidType'], ['distributionCount']),
          
          // this is still aids/pie for the pie chart
          aidsType: normalizeSeries(toArray(aidsRes), ['aidType'], ['totalQuantity']),
          
          // aids/type-breakdown/by-region returns: [{region, topAidTypes: [{aidType, totalQuantity}]}]
          // For now, flatten to region-level totals
          aidsTypeRegion: toArray(aidsTypeRes).map((item: any) => ({
            label: item.region || '',
            value: item.topAidTypes?.reduce((sum: number, aid: any) => sum + (aid.totalQuantity || 0), 0) || 0
          })),
          
          // families/histogram returns: [{bucket, totalFamilies, needyFamilies}]
          familiesHistogram: normalizeSeries(toArray(famHistRes), ['bucket'], ['totalFamilies']),
          
          // families/vulnerability-profile returns: {elderly, disabled, pupils, largeFamilies, povertyScore, totals: {families, elderly, ...}}
          familiesVulnerability: [
            { label: 'Elderly', value: Math.round((extractData(famVulnRes)?.elderly || 0) * 100) },
            { label: 'Disabled', value: Math.round((extractData(famVulnRes)?.disabled || 0) * 100) },
            { label: 'Pupils', value: Math.round((extractData(famVulnRes)?.pupils || 0) * 100) },
            { label: 'Large Families', value: Math.round((extractData(famVulnRes)?.largeFamilies || 0) * 100) },
          ].filter(item => item.value > 0),
          
          // users/activity returns: [{userId, name, email, visitsCount}]
          usersActivity: normalizeSeries(toArray(usersActRes), ['name'], ['visitsCount']),
          
          // visits/completion-rate returns: {totalVisits, completedVisits, completionRate}
          visitsCompletion: (extractData(visitCompRes)?.completionRate || 0) * 100,
          
          // deposits/summary returns: [{id, name, city, capacity, currentQuantity, utilizationRate, ...}]
          depositsSummary: extractData(depSummRes) || [],
          
          // aids/financial/total-distributed returns: {totalFinancialAidDistributed}
          financialDistributed: extractData(finDistRes)?.totalFinancialAidDistributed || 0,
          
          // cities/active/count returns: {activeCities}
          citiesActive: extractData(citiesActRes)?.activeCities || 0,
          
          // families/count returns: {totalFamilies}
          familiesCount: extractData(famCountRes)?.totalFamilies || 0,
          
          // visits/count returns: {totalVisits}
          visitsCount: extractData(visCountRes)?.totalVisits || 0,
        })
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        addNotification({ type: 'error', message: 'Failed to load dashboard data' })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, isRestoring, navigate, addNotification])

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, chartId: string) => {
    if (!isEditMode) {
      e.preventDefault()
      return
    }
    setDraggedChart(chartId)
    e.dataTransfer!.effectAllowed = 'move'
    e.dataTransfer!.setData('text/plain', chartId)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, cellId: string) => {
    e.preventDefault()
    e.dataTransfer!.dropEffect = 'move'
    if (isEditMode) {
      setDragOverCell(cellId)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetCellIndex: number) => {
    e.preventDefault()
    if (!draggedChart || !isEditMode) return

    const newLayout = { ...layout }
    const draggedChartIndex = newLayout.charts.findIndex(c => c.id === draggedChart)

    if (draggedChartIndex !== -1) {
      // Swap positions
      ;[newLayout.charts[draggedChartIndex], newLayout.charts[targetCellIndex]] = [
        newLayout.charts[targetCellIndex],
        newLayout.charts[draggedChartIndex],
      ]

      setLayout(newLayout)
      dashboardLayoutStore.saveLayout(newLayout)
    }

    setDraggedChart(null)
    setDragOverCell(null)
  }

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  const handleToggleLocked = () => {
    const newLayout = { ...layout, isLocked: !layout.isLocked }
    setLayout(newLayout)
    dashboardLayoutStore.setLocked(newLayout.isLocked)
  }

  const handleToggleChartVisibility = (chartId: string) => {
    const newLayout = { ...layout }
    const chart = newLayout.charts.find(c => c.id === chartId)
    if (chart) {
      chart.enabled = !chart.enabled
      setLayout(newLayout)
      dashboardLayoutStore.saveLayout(newLayout)
    }
  }

  const handleResetLayout = () => {
    if (confirm('Are you sure you want to reset the dashboard layout to default?')) {
      dashboardLayoutStore.resetLayout()
      setLayout(dashboardLayoutStore.getLayout())
      addNotification({ type: 'success', message: 'Dashboard layout reset to default' })
    }
  }

  const renderChart = (chart: ChartConfig, index: number) => {
    const commonProps = {
      isEditMode,
      chartId: chart.id,
      data: chartData,
    }

    switch (chart.type) {
      case 'visits_timeline':
        return <VisitsTimelineChart key={chart.id} {...commonProps} />
      case 'aid_pie':
        return <AidPieChart key={chart.id} {...commonProps} />
      case 'family_size':
        return <FamilySizeBarChart key={chart.id} {...commonProps} />
      case 'priority_families':
        return <PriorityFamiliesChart key={chart.id} {...commonProps} />
      case 'cities_visits_heatmap':
        return <CitiesVisitsHeatmap key={chart.id} {...commonProps} />
      case 'cities_families_bar':
        return (
          <GenericBarChart
            key={chart.id}
            isEditMode={isEditMode}
            chartId={chart.id}
            title={chart.title}
            data={chartData.citiesFamilies}
            color="#10b981"
          />
        )
      case 'cities_visits_bar':
        return (
          <GenericBarChart
            key={chart.id}
            isEditMode={isEditMode}
            chartId={chart.id}
            title={chart.title}
            data={chartData.citiesVisits}
            color="#3b82f6"
          />
        )
      case 'time_families_line':
        return (
          <GenericLineChart
            key={chart.id}
            isEditMode={isEditMode}
            chartId={chart.id}
            title={chart.title}
            data={chartData.timeFamilies}
            color="#f59e0b"
          />
        )
      case 'time_visits_line':
        return (
          <GenericLineChart
            key={chart.id}
            isEditMode={isEditMode}
            chartId={chart.id}
            title={chart.title}
            data={chartData.timeVisits}
            color="#06b6d4"
          />
        )
      case 'time_needy_line':
        return (
          <GenericLineChart
            key={chart.id}
            isEditMode={isEditMode}
            chartId={chart.id}
            title={chart.title}
            data={chartData.timeNeedy}
            color="#ec4899"
          />
        )
      case 'aids_frequency_bar':
        return (
          <GenericBarChart
            key={chart.id}
            isEditMode={isEditMode}
            chartId={chart.id}
            title={chart.title}
            data={chartData.aidsFrequency}
            color="#8b5cf6"
          />
        )
      case 'aids_type_pie':
        return (
          <GenericPieChart
            key={chart.id}
            isEditMode={isEditMode}
            chartId={chart.id}
            title={chart.title}
            data={chartData.aidsType}
          />
        )
      case 'aids_type_region_bar':
        return (
          <GenericBarChart
            key={chart.id}
            isEditMode={isEditMode}
            chartId={chart.id}
            title={chart.title}
            data={chartData.aidsTypeRegion}
            color="#14b8a6"
          />
        )
      case 'families_histogram_bar':
        return (
          <GenericBarChart
            key={chart.id}
            isEditMode={isEditMode}
            chartId={chart.id}
            title={chart.title}
            data={chartData.familiesHistogram}
            color="#f97316"
          />
        )
      case 'families_vulnerability_pie':
        return (
          <GenericPieChart
            key={chart.id}
            isEditMode={isEditMode}
            chartId={chart.id}
            title={chart.title}
            data={chartData.familiesVulnerability}
          />
        )
      case 'users_activity_bar':
        return (
          <GenericBarChart
            key={chart.id}
            isEditMode={isEditMode}
            chartId={chart.id}
            title={chart.title}
            data={chartData.usersActivity}
            color="#06b6d4"
          />
        )
      case 'visits_completion_stat':
        return (
          <StatCard
            key={chart.id}
            isEditMode={isEditMode}
            chartId={chart.id}
            title={chart.title}
            value={Math.round(chartData.visitsCompletion)}
            unit="%"
            icon="✓"
          />
        )
      case 'deposits_summary_stat':
        return (
          <StatCard
            key={chart.id}
            isEditMode={isEditMode}
            chartId={chart.id}
            title={chart.title}
            value={Array.isArray(chartData.depositsSummary) ? chartData.depositsSummary.length : 0}
            icon="📦"
          />
        )
      case 'financial_distributed_stat':
        return (
          <StatCard
            key={chart.id}
            isEditMode={isEditMode}
            chartId={chart.id}
            title={chart.title}
            value={chartData.financialDistributed}
            unit="DA"
            icon="💰"
          />
        )
      case 'cities_active_stat':
        return (
          <StatCard
            key={chart.id}
            isEditMode={isEditMode}
            chartId={chart.id}
            title={chart.title}
            value={chartData.citiesActive}
            icon="🏙️"
          />
        )
      case 'families_count_stat':
        return (
          <StatCard
            key={chart.id}
            isEditMode={isEditMode}
            chartId={chart.id}
            title={chart.title}
            value={chartData.familiesCount}
            icon="👨‍👩‍👧‍👦"
          />
        )
      case 'visits_count_stat':
        return (
          <StatCard
            key={chart.id}
            isEditMode={isEditMode}
            chartId={chart.id}
            title={chart.title}
            value={chartData.visitsCount}
            icon="📍"
          />
        )
      default:
        return null
    }
  }

  if (loading || isRestoring) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" label={t('common.loading') || 'Loading...'} />
      </div>
    )
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              {isEditMode ? (
                'Drag and drop charts to rearrange. Click the eye icon to show/hide charts.'
              ) : (
                <>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live insights from real-time data endpoints
                </>
              )}
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Families</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalFamilies.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Visits</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalVisits.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Aid Distributed</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.totalAidDistributed.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Active Regions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalRegions}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleToggleEditMode} variant={isEditMode ? 'primary' : 'ghost'}>
            {isEditMode ? '✓ Done Editing' : '✎ Edit Layout'}
          </Button>
          {isEditMode && (
            <>
              <Button onClick={handleToggleLocked} variant={layout.isLocked ? 'ghost' : 'secondary'}>
                {layout.isLocked ? '🔒 Locked' : '🔓 Unlocked'}
              </Button>
              <Button onClick={handleResetLayout} variant="ghost" size="sm">
                ↺ Reset to Default
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-max">
        {layout.charts.map((chart, index) => (
          <div
            key={chart.id}
            draggable={isEditMode && chart.enabled}
            className={`${
              chart.gridCol === 4 ? 'lg:col-span-4' : chart.gridCol === 2 ? 'lg:col-span-2' : 'lg:col-span-1'
            } ${
              !chart.enabled ? 'hidden' : ''
            } ${
              isEditMode && dragOverCell === chart.id
                ? 'ring-2 ring-primary-400 rounded-lg'
                : ''
            } ${
              isEditMode ? 'cursor-move' : ''
            }`}
            onDragStart={e => handleDragStart(e, chart.id)}
            onDragOver={e => handleDragOver(e, chart.id)}
            onDrop={e => handleDrop(e, index)}
            onDragLeave={() => setDragOverCell(null)}
          >
            <div className="relative h-full">
              {renderChart(chart, index)}

              {/* Edit Mode Controls */}
              {isEditMode && (
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => handleToggleChartVisibility(chart.id)}
                    className="p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                    title={chart.enabled ? 'Hide chart' : 'Show chart'}
                  >
                    {chart.enabled ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chart Selection Panel in Edit Mode */}
      {isEditMode && (
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Available Charts</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {layout.charts.map(chart => (
              <div
                key={chart.id}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  chart.enabled
                    ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                }`}
                onClick={() => handleToggleChartVisibility(chart.id)}
              >
                <p className="font-medium text-gray-900 dark:text-white text-sm">{chart.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {chart.enabled ? '✓ Visible' : 'Hidden'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ConfigurableDashboard
