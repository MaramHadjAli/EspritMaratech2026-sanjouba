/**
 * Individual chart components for the configurable dashboard
 */

import React, { useMemo } from 'react'
import { Line, Bar, Pie } from 'react-chartjs-2'
import { Card } from '@components/Card'

export interface ChartComponentProps {
  isEditMode?: boolean
  isDragging?: boolean
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, chartId: string) => void
  chartId: string
  data: {
    timeline?: Array<{ label: string; value: number }>
    aids?: Array<{ label: string; value: number }>
    familySizes?: Array<{ label: string; value: number }>
    priorityFamilies?: any[]
  }
}

export const VisitsTimelineChart: React.FC<ChartComponentProps> = ({
  isEditMode,
  chartId,
  data,
}) => {
  const lineData = useMemo(
    () => ({
      labels: (data.timeline || []).map(item => item.label),
      datasets: [
        {
          label: 'Visits',
          data: (data.timeline || []).map(item => item.value),
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.2)',
          tension: 0.3,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#2563eb',
        },
      ],
    }),
    [data.timeline]
  )

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    }),
    []
  )

  return (
    <Card
      bordered
      className={`p-6 h-full ${isEditMode ? 'border-2 border-primary-400' : ''}`}
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Visits Timeline</h3>
      {(data.timeline || []).length > 0 ? (
        <div style={{ height: '300px', position: 'relative' }}>
          <Line data={lineData} options={options} />
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>
      )}
    </Card>
  )
}

export const AidPieChart: React.FC<ChartComponentProps> = ({
  isEditMode,
  chartId,
  data,
}) => {
  const pieData = useMemo(
    () => ({
      labels: (data.aids || []).map(item => item.label),
      datasets: [
        {
          data: (data.aids || []).map(item => item.value),
          backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6'],
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    }),
    [data.aids]
  )

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0,
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom' as const,
        },
      },
    }),
    []
  )

  return (
    <Card
      bordered
      className={`p-6 h-full ${isEditMode ? 'border-2 border-primary-400' : ''}`}
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Aid Distribution</h3>
      {(data.aids || []).length > 0 ? (
        <div style={{ height: '300px', position: 'relative' }}>
          <Pie data={pieData} options={options} />
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>
      )}
    </Card>
  )
}

export const FamilySizeBarChart: React.FC<ChartComponentProps> = ({
  isEditMode,
  chartId,
  data,
}) => {
  const barData = useMemo(
    () => ({
      labels: (data.familySizes || []).map(item => item.label),
      datasets: [
        {
          label: 'Families',
          data: (data.familySizes || []).map(item => item.value),
          backgroundColor: '#10b981',
          borderColor: '#059669',
          borderWidth: 1,
        },
      ],
    }),
    [data.familySizes]
  )

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    }),
    []
  )

  return (
    <Card
      bordered
      className={`p-6 h-full ${isEditMode ? 'border-2 border-primary-400' : ''}`}
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Family Size Distribution</h3>
      {(data.familySizes || []).length > 0 ? (
        <div style={{ height: '300px', position: 'relative' }}>
          <Bar data={barData} options={options} />
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>
      )}
    </Card>
  )
}

export const PriorityFamiliesChart: React.FC<ChartComponentProps> = ({
  isEditMode,
  chartId,
  data,
}) => {
  return (
    <Card
      bordered
      className={`p-6 h-full ${isEditMode ? 'border-2 border-primary-400' : ''}`}
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Priority Families</h3>
      {(data.priorityFamilies || []).length > 0 ? (
        <div className="space-y-3 overflow-y-auto" style={{ maxHeight: '300px' }}>
          {(data.priorityFamilies || []).map((family, index) => (
            <div key={family.familyId || index} className="p-3 rounded-md border border-gray-200 dark:border-gray-700">
              <p className="font-semibold text-gray-900 dark:text-white">Priority Rank #{family.rank || index + 1}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {family.city || family.region || 'Location unavailable'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>
      )}
    </Card>
  )
}

export const CitiesVisitsHeatmap: React.FC<ChartComponentProps> = ({
  isEditMode,
  chartId,
}) => {
  return (
    <Card
      bordered
      className={`p-6 h-full ${isEditMode ? 'border-2 border-primary-400' : ''}`}
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Visits Heatmap</h3>
      <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Map heatmap will display here</p>
      </div>
    </Card>
  )
}

// Generic Bar Chart
export const GenericBarChart: React.FC<{
  isEditMode?: boolean
  chartId: string
  title: string
  data: Array<{ label: string; value: number }>
  color?: string
}> = ({ isEditMode, title, data, color = '#2563eb' }) => {
  const barData = useMemo(
    () => ({
      labels: data.map(item => item.label),
      datasets: [
        {
          label: title,
          data: data.map(item => item.value),
          backgroundColor: color,
          borderColor: color,
          borderWidth: 1,
        },
      ],
    }),
    [data, color, title]
  )

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 0 },
      plugins: { legend: { display: true, position: 'top' as const } },
      scales: { y: { beginAtZero: true } },
    }),
    []
  )

  return (
    <Card bordered className={`p-6 h-full ${isEditMode ? 'border-2 border-primary-400' : ''}`}>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      {data.length > 0 ? (
        <div style={{ height: '300px', position: 'relative' }}>
          <Bar data={barData} options={options} />
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>
      )}
    </Card>
  )
}

// Generic Line Chart
export const GenericLineChart: React.FC<{
  isEditMode?: boolean
  chartId: string
  title: string
  data: Array<{ label: string; value: number }>
  color?: string
}> = ({ isEditMode, title, data, color = '#2563eb' }) => {
  const lineData = useMemo(
    () => ({
      labels: data.map(item => item.label),
      datasets: [
        {
          label: title,
          data: data.map(item => item.value),
          borderColor: color,
          backgroundColor: `${color}20`,
          tension: 0.3,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: color,
        },
      ],
    }),
    [data, color, title]
  )

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 0 },
      plugins: { legend: { display: true, position: 'top' as const } },
      scales: { y: { beginAtZero: true } },
    }),
    []
  )

  return (
    <Card bordered className={`p-6 h-full ${isEditMode ? 'border-2 border-primary-400' : ''}`}>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      {data.length > 0 ? (
        <div style={{ height: '300px', position: 'relative' }}>
          <Line data={lineData} options={options} />
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>
      )}
    </Card>
  )
}

// Generic Pie Chart
export const GenericPieChart: React.FC<{
  isEditMode?: boolean
  chartId: string
  title: string
  data: Array<{ label: string; value: number }>
}> = ({ isEditMode, title, data }) => {
  const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#06b6d4', '#ec4899']
  
  const pieData = useMemo(
    () => ({
      labels: data.map(item => item.label),
      datasets: [
        {
          data: data.map(item => item.value),
          backgroundColor: colors.slice(0, data.length),
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    }),
    [data]
  )

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 0 },
      plugins: { legend: { display: true, position: 'bottom' as const } },
    }),
    []
  )

  return (
    <Card bordered className={`p-6 h-full ${isEditMode ? 'border-2 border-primary-400' : ''}`}>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      {data.length > 0 ? (
        <div style={{ height: '300px', position: 'relative' }}>
          <Pie data={pieData} options={options} />
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>
      )}
    </Card>
  )
}

// Stat Card
export const StatCard: React.FC<{
  isEditMode?: boolean
  chartId: string
  title: string
  value: number | string
  unit?: string
  icon?: string
}> = ({ isEditMode, title, value, unit, icon }) => {
  return (
    <Card bordered className={`p-6 h-full ${isEditMode ? 'border-2 border-primary-400' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
            {unit && <span className="text-sm ml-1">{unit}</span>}
          </p>
        </div>
        {icon && <div className="text-4xl">{icon}</div>}
      </div>
    </Card>
  )
}

// Data Table Card
export const DataTableCard: React.FC<{
  isEditMode?: boolean
  chartId: string
  title: string
  data: Array<Record<string, any>>
  columns: Array<{ key: string; label: string }>
}> = ({ isEditMode, title, data, columns }) => {
  return (
    <Card bordered className={`p-6 h-full ${isEditMode ? 'border-2 border-primary-400' : ''}`}>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="text-left py-2 px-3 font-semibold text-gray-900 dark:text-white">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 10).map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                  {columns.map(col => (
                    <td key={col.key} className="py-2 px-3 text-gray-700 dark:text-gray-300">
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>
      )}
    </Card>
  )
}
