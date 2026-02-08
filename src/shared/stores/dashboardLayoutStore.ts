/**
 * Dashboard Layout Configuration Store
 * Manages which charts are displayed and their layout
 */

export interface ChartConfig {
  id: string
    type: 'visits_timeline' | 'aid_pie' | 'family_size' | 'priority_families' | 'cities_visits_heatmap' | 'cities_families_heatmap' | 'cities_families_metric' |
      'cities_families_bar' | 'cities_visits_bar' | 'time_families_line' | 'time_visits_line' | 'time_needy_line' |
      'aids_frequency_bar' | 'aids_type_pie' | 'aids_type_region_bar' | 'families_histogram_bar' | 
      'families_vulnerability_pie' | 'visits_completion_stat' | 'deposits_summary_stat' | 'deposits_utilization_bar' | 'users_activity_bar' |
      'financial_distributed_stat' | 'cities_active_stat' | 'families_count_stat' | 'visits_count_stat'
  title: string
  gridCol: number // 1-4 (Tailwind grid columns)
  gridRow: number // rows it spans
  enabled: boolean
}

export interface DashboardLayout {
  charts: ChartConfig[]
  isLocked: boolean
}

const DASHBOARD_LAYOUT_KEY = 'dashboardLayout'

// Default layout configuration
const defaultLayout: DashboardLayout = {
  isLocked: true,
  charts: [
    {
      id: 'cities-families-heatmap',
      type: 'cities_families_heatmap',
      title: 'Families Heatmap',
      gridCol: 4,
      gridRow: 1,
      enabled: true,
    },
    {
      id: 'deposits-utilization-bar',
      type: 'deposits_utilization_bar',
      title: 'Deposits Utilization',
      gridCol: 2,
      gridRow: 1,
      enabled: true,
    },
    {
      id: 'visits-timeline',
      type: 'visits_timeline',
      title: 'Visits Timeline',
      gridCol: 2,
      gridRow: 1,
      enabled: true,
    },
    {
      id: 'aid-pie',
      type: 'aid_pie',
      title: 'Aid Distribution',
      gridCol: 2,
      gridRow: 1,
      enabled: true,
    },
    {
      id: 'family-size',
      type: 'family_size',
      title: 'Family Size Distribution',
      gridCol: 2,
      gridRow: 1,
      enabled: true,
    },
    {
      id: 'priority-families',
      type: 'priority_families',
      title: 'Priority Families',
      gridCol: 2,
      gridRow: 1,
      enabled: true,
    },
    {
      id: 'cities-visits',
      type: 'cities_visits_heatmap',
      title: 'Visits Heatmap',
      gridCol: 4,
      gridRow: 1,
      enabled: true,
    },
    {
      id: 'cities-families-bar',
      type: 'cities_families_bar',
      title: 'Families by City',
      gridCol: 2,
      gridRow: 1,
      enabled: false,
    },
    {
      id: 'cities-visits-bar',
      type: 'cities_visits_bar',
      title: 'Visits by City',
      gridCol: 2,
      gridRow: 1,
      enabled: false,
    },
    {
      id: 'time-families',
      type: 'time_families_line',
      title: 'Families Over Time',
      gridCol: 2,
      gridRow: 1,
      enabled: false,
    },
    {
      id: 'time-visits',
      type: 'time_visits_line',
      title: 'Visits Over Time',
      gridCol: 2,
      gridRow: 1,
      enabled: false,
    },
    {
      id: 'time-needy',
      type: 'time_needy_line',
      title: 'Needy Families Comparison',
      gridCol: 2,
      gridRow: 1,
      enabled: false,
    },
    {
      id: 'aids-frequency',
      type: 'aids_frequency_bar',
      title: 'Aid Frequency',
      gridCol: 2,
      gridRow: 1,
      enabled: false,
    },
    {
      id: 'aids-type',
      type: 'aids_type_pie',
      title: 'Aid Types Distribution',
      gridCol: 2,
      gridRow: 1,
      enabled: false,
    },
    {
      id: 'aids-type-region',
      type: 'aids_type_region_bar',
      title: 'Aid Types by Region',
      gridCol: 2,
      gridRow: 1,
      enabled: false,
    },
    {
      id: 'families-histogram',
      type: 'families_histogram_bar',
      title: 'Families Histogram',
      gridCol: 2,
      gridRow: 1,
      enabled: false,
    },
    {
      id: 'families-vulnerability',
      type: 'families_vulnerability_pie',
      title: 'Vulnerability Profile',
      gridCol: 2,
      gridRow: 1,
      enabled: false,
    },
    {
      id: 'visits-completion',
      type: 'visits_completion_stat',
      title: 'Visit Completion Rate',
      gridCol: 1,
      gridRow: 1,
      enabled: false,
    },
    {
      id: 'deposits-summary',
      type: 'deposits_summary_stat',
      title: 'Deposits Summary',
      gridCol: 1,
      gridRow: 1,
      enabled: false,
    },
    {
      id: 'users-activity',
      type: 'users_activity_bar',
      title: 'Users Activity',
      gridCol: 2,
      gridRow: 1,
      enabled: false,
    },
    {
      id: 'financial-distributed',
      type: 'financial_distributed_stat',
      title: 'Financial Distributed',
      gridCol: 1,
      gridRow: 1,
      enabled: false,
    },
    {
      id: 'cities-active',
      type: 'cities_active_stat',
      title: 'Active Cities',
      gridCol: 1,
      gridRow: 1,
      enabled: false,
    },
    {
      id: 'families-count',
      type: 'families_count_stat',
      title: 'Total Families',
      gridCol: 1,
      gridRow: 1,
      enabled: false,
    },
    {
      id: 'visits-count',
      type: 'visits_count_stat',
      title: 'Total Visits',
      gridCol: 1,
      gridRow: 1,
      enabled: false,
    },
  ],
}

export const dashboardLayoutStore = {
  getLayout: (): DashboardLayout => {
    try {
      const stored = localStorage.getItem(DASHBOARD_LAYOUT_KEY)
      if (stored) {
        const layout = JSON.parse(stored)
        // Merge with defaults to handle new charts added in updates
        return {
          ...layout,
          charts: [
            ...layout.charts,
            ...defaultLayout.charts.filter(
              chart => !layout.charts.some((c: { id: string }) => c.id === chart.id)
            ),
          ],
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard layout:', error)
    }
    return defaultLayout
  },

  saveLayout: (layout: DashboardLayout) => {
    try {
      localStorage.setItem(DASHBOARD_LAYOUT_KEY, JSON.stringify(layout))
    } catch (error) {
      console.error('Failed to save dashboard layout:', error)
    }
  },

  resetLayout: () => {
    localStorage.removeItem(DASHBOARD_LAYOUT_KEY)
  },

  updateChartPosition: (chartId: string, gridCol: number, gridRow: number) => {
    const layout = dashboardLayoutStore.getLayout()
    const chart = layout.charts.find(c => c.id === chartId)
    if (chart) {
      chart.gridCol = gridCol
      chart.gridRow = gridRow
      dashboardLayoutStore.saveLayout(layout)
    }
  },

  toggleChartVisibility: (chartId: string) => {
    const layout = dashboardLayoutStore.getLayout()
    const chart = layout.charts.find(c => c.id === chartId)
    if (chart) {
      chart.enabled = !chart.enabled
      dashboardLayoutStore.saveLayout(layout)
    }
  },

  setLocked: (locked: boolean) => {
    const layout = dashboardLayoutStore.getLayout()
    layout.isLocked = locked
    dashboardLayoutStore.saveLayout(layout)
  },
}
