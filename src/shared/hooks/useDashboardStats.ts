/**
 * Custom hook for dashboard statistics
 * Fetches detailed chart data and calculates summary stats from it
 * Caches results to prevent duplicate API calls across pages
 */

import { useEffect, useState, useRef } from 'react'
import { dashboardService } from '@core/services/dashboard.service'

export interface DashboardStats {
  totalFamilies: number
  totalVisits: number
  totalAidDistributed: number
  totalRegions: number
}

// Cache to store fetched stats across component instances
let statsCache: DashboardStats | null = null
let cachePromise: Promise<DashboardStats> | null = null

// Helper functions (same as DashboardPage)
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

const normalizeSeries = (items: any[], labelKeys: string[], valueKeys: string[]) => {
  if (!Array.isArray(items)) return []
  return items
    .map((item, index) => ({
      label: getLabelFrom(item, labelKeys) || `Item ${index + 1}`,
      value: getNumberFrom(item, valueKeys),
    }))
    .filter(point => point.value > 0)
}

const normalizeCities = (items: any[]) => {
  if (!Array.isArray(items)) return []
  return items
    .map((item) => ({
      city: getLabelFrom(item, ['city', 'name', 'label']),
      value: getNumberFrom(item, ['visitCount', 'familyCount', 'visits', 'visitsCount', 'families', 'familiesCount', 'count', 'value', 'total']),
    }))
    .filter(item => item.city.length > 0)
}

export const useDashboardStats = (autoFetch = true) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalFamilies: 0,
    totalVisits: 0,
    totalAidDistributed: 0,
    totalRegions: 0,
  })
  const [loading, setLoading] = useState(autoFetch)
  const [error, setError] = useState<string | null>(null)
  const fetchAttemptedRef = useRef(false)

  const fetchStats = async () => {
    // Return cached data if available
    if (statsCache) {
      setStats(statsCache)
      setLoading(false)
      return statsCache
    }

    // Use existing promise if fetch is in progress
    if (cachePromise) {
      try {
        const result = await cachePromise
        setStats(result)
        setLoading(false)
        return result
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats')
        setLoading(false)
      }
      return null
    }

    // Start new fetch
    setLoading(true)
    setError(null)

    cachePromise = (async () => {
      try {
        // Fetch detailed data like DashboardPage does
        const [sizeRes, citiesVisitsRes, citiesFamiliesRes, timelineRes, aidsRes] = await Promise.all([
          dashboardService.getFamiliesSizeDistribution(),
          dashboardService.getCitiesVisits(8),
          dashboardService.getCitiesFamilies(8),
          dashboardService.getVisitsTimeline(6),
          dashboardService.getAidsPie(6),
        ])

        // Normalize the data
        const citiesFamilies = normalizeCities(toArray(citiesFamiliesRes))
        const visitsTimeline = normalizeSeries(toArray(timelineRes), ['bucket', 'month', 'label', 'date'], ['totalVisits', 'visits', 'count', 'value', 'total'])
        const aidBreakdown = normalizeSeries(toArray(aidsRes), ['aidType', 'type', 'name', 'label'], ['totalQuantity', 'value', 'amount', 'count', 'total'])

        // Calculate stats from detailed data (same way DashboardPage does)
        const normalized: DashboardStats = {
          totalFamilies: citiesFamilies.reduce((sum, item) => sum + item.value, 0),
          totalVisits: visitsTimeline.reduce((sum, item) => sum + item.value, 0),
          totalAidDistributed: aidBreakdown.reduce((sum, item) => sum + item.value, 0),
          totalRegions: citiesFamilies.length,
        }

        statsCache = normalized
        setStats(normalized)
        setLoading(false)
        return normalized
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch stats'
        setError(message)
        setLoading(false)
        cachePromise = null // Reset promise on error to allow retry
        throw err
      }
    })()

    return cachePromise
  }

  useEffect(() => {
    if (autoFetch && !fetchAttemptedRef.current) {
      fetchAttemptedRef.current = true
      fetchStats()
    }
  }, [autoFetch])

  return { stats, loading, error, fetchStats }
}

// Function to reset the cache (useful for manual refreshes)
export const resetDashboardStatsCache = () => {
  statsCache = null
  cachePromise = null
}

