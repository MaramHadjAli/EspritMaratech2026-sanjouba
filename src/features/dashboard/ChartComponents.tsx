/**
 * Individual chart components for the configurable dashboard
 */

import React, { useMemo } from 'react'
import { Line, Bar, Pie } from 'react-chartjs-2'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'
import { Card } from '@components/Card'
import { dashboardService } from '@services/dashboard.service'
import { locationService } from '@services/location.service'

export interface ChartComponentProps {
  isEditMode?: boolean;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, chartId: string) => void;
  chartId: string;
  data: {
    timeline?: Array<{ label: string; value: number }>;
    aids?: Array<{ label: string; value: number }>;
    familySizes?: Array<{ label: string; value: number }>;
    priorityFamilies?: any[];
    citiesFamilies?: Array<{ label: string; value: number }>;
    citiesVisits?: Array<{ label: string; value: number }>;
    timeFamilies?: Array<{ label: string; value: number }>;
    timeVisits?: Array<{ label: string; value: number }>;
    timeNeedy?: Array<{ label: string; value: number }>;
    aidsFrequency?: Array<{ label: string; value: number }>;
    aidsType?: Array<{ label: string; value: number }>;
    aidsTypeRegion?: Array<{ label: string; value: number }>;
    familiesHistogram?: Array<{ label: string; value: number }>;
    familiesVulnerability?: Array<{ label: string; value: number }>;
    usersActivity?: Array<{ label: string; value: number }>;
    visitsCompletion?: number;
    depositsSummary?: any[];
    financialDistributed?: number;
    citiesActive?: number;
    familiesCount?: number;
    visitsCount?: number;
  };
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

  // Families Heatmap (Geographical Distribution)
  export const CitiesFamiliesHeatmap: React.FC<ChartComponentProps> = ({ isEditMode, chartId, data }) => {
    const [mapData, setMapData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const fetchData = async () => {
        try {
          const extractData = (payload: any) => payload?.data ?? payload;
          const toArray = (value: any) => (Array.isArray(value) ? value : []);
          const getCountFrom = (item: any) => {
            const keys = ['familyCount', 'count', 'value', 'total'];
            for (const key of keys) {
              const value = item?.[key];
              if (typeof value === 'number') return value;
            }
            return 0;
          };
          const response = await dashboardService.getCitiesFamilies();
          const cityStats = toArray(extractData(response))
            .map((item: any) => ({
              city: item?.city || item?.name || item?.label,
              count: getCountFrom(item),
            }))
            .filter((item: any) => Boolean(item.city));
          const normalizeBbox = (bbox: number[]) => {
            const [a, b, c, d] = bbox;
            const looksLikeLatLatLngLng = Math.abs(a) <= 90 && Math.abs(b) <= 90 && Math.abs(c) <= 180 && Math.abs(d) <= 180;
            const looksLikeLngLatLngLat = Math.abs(a) <= 180 && Math.abs(b) <= 90 && Math.abs(c) <= 180 && Math.abs(d) <= 90;
            if (looksLikeLngLatLngLat && !looksLikeLatLatLngLng) {
              return { minLat: b, maxLat: d, minLng: a, maxLng: c };
            }
            return { minLat: a, maxLat: b, minLng: c, maxLng: d };
          };
          const boundaryResults = await Promise.all(
            cityStats.map(async ({ city, count }: { city: string; count: number }) => {
              try {
                const boundaryResponse = await locationService.getCityBoundary(city);
                const boundary = extractData(boundaryResponse);
                const bbox = boundary?.bbox;
                if (!bbox || bbox.length !== 4) return null;
                const { minLat, maxLat, minLng, maxLng } = normalizeBbox(bbox);
                const lat = (minLat + maxLat) / 2;
                const lng = (minLng + maxLng) / 2;
                return [lat, lng, Math.max(1, count)] as [number, number, number];
              } catch (error) {
                console.warn(`Failed to load boundary for ${city}:`, error);
                return null;
              }
            })
          );
          const heatmapPoints = boundaryResults.filter((point): point is [number, number, number] => Array.isArray(point));
          setMapData(heatmapPoints);
        } catch (error) {
          console.error('Failed to fetch heatmap data:', error);
          setMapData([]);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);
    return (
      <Card bordered className={`p-6 h-full ${isEditMode ? 'border-2 border-primary-400' : ''}`}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Families Heatmap</h3>
        {loading ? (
          <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Loading map...</p>
          </div>
        ) : (
          <TunisiaHeatmap heatmapData={mapData || []} />
        )}
      </Card>
    );
  };

  // Deposits Utilization Bar Chart
  export const DepositsUtilizationBarChart: React.FC<ChartComponentProps> = ({ isEditMode, chartId, data }) => {
    const deposits = Array.isArray(data.depositsSummary) ? data.depositsSummary : [];
    const barData = useMemo(
      () => ({
        labels: deposits.map((d: any) => d.name || d.id || 'Deposit'),
        datasets: [
          {
            label: 'Utilization Rate (%)',
            data: deposits.map((d: any) => Math.round((d.utilizationRate || 0) * 100)),
            backgroundColor: '#f59e0b',
            borderColor: '#f59e0b',
            borderWidth: 1,
          },
        ],
      }),
      [deposits]
    );
    const options = useMemo(
      () => ({
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        plugins: { legend: { display: true, position: 'top' as const } },
        scales: { y: { beginAtZero: true, max: 100 } },
      }),
      []
    );
    return (
      <Card bordered className={`p-6 h-full ${isEditMode ? 'border-2 border-primary-400' : ''}`}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Deposits Utilization</h3>
        {deposits.length > 0 ? (
          <div style={{ height: '300px', position: 'relative' }}>
            <Bar data={barData} options={options} />
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>
        )}
      </Card>
    );
  };

export const CitiesVisitsHeatmap: React.FC<ChartComponentProps> = ({
  isEditMode,
  chartId,
  data,
}) => {
  const [mapData, setMapData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // Fetch heatmap data from dashboard service
    const fetchData = async () => {
      try {
        const extractData = (payload: any) => payload?.data ?? payload
        const toArray = (value: any) => (Array.isArray(value) ? value : [])
        const getCountFrom = (item: any) => {
          const keys = ['visits', 'visitsCount', 'count', 'value', 'total']
          for (const key of keys) {
            const value = item?.[key]
            if (typeof value === 'number') return value
          }
          return 0
        }

        const response = await dashboardService.getCitiesVisits(50)
        const cityStats = toArray(extractData(response))
          .map((item: any) => ({
            city: item?.city || item?.name || item?.label,
            count: getCountFrom(item),
          }))
          .filter((item: any) => Boolean(item.city))

        const normalizeBbox = (bbox: number[]) => {
          const [a, b, c, d] = bbox
          const looksLikeLatLatLngLng =
            Math.abs(a) <= 90 && Math.abs(b) <= 90 && Math.abs(c) <= 180 && Math.abs(d) <= 180
          const looksLikeLngLatLngLat =
            Math.abs(a) <= 180 && Math.abs(b) <= 90 && Math.abs(c) <= 180 && Math.abs(d) <= 90

          if (looksLikeLngLatLngLat && !looksLikeLatLatLngLng) {
            return { minLat: b, maxLat: d, minLng: a, maxLng: c }
          }

          // Default to lat/lat/lng/lng (matches observed location endpoint)
          return { minLat: a, maxLat: b, minLng: c, maxLng: d }
        }

        const boundaryResults = await Promise.all(
          cityStats.map(async ({ city, count }: { city: string; count: number }) => {
            try {
              const boundaryResponse = await locationService.getCityBoundary(city)
              const boundary = extractData(boundaryResponse)
              const bbox = boundary?.bbox
              if (!bbox || bbox.length !== 4) return null
              const { minLat, maxLat, minLng, maxLng } = normalizeBbox(bbox)
              const lat = (minLat + maxLat) / 2
              const lng = (minLng + maxLng) / 2
              return [lat, lng, Math.max(1, count)] as [number, number, number]
            } catch (error) {
              console.warn(`Failed to load boundary for ${city}:`, error)
              return null
            }
          })
        )

        const heatmapPoints = boundaryResults.filter(
          (point): point is [number, number, number] => Array.isArray(point)
        )

        setMapData(heatmapPoints)
      } catch (error) {
        console.error('Failed to fetch heatmap data:', error)
        setMapData([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  return (
    <Card
      bordered
      className={`p-6 h-full ${isEditMode ? 'border-2 border-primary-400' : ''}`}
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Visits Heatmap</h3>
      {loading ? (
        <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Loading map...</p>
        </div>
      ) : (
        <TunisiaHeatmap heatmapData={mapData || []} />
      )}
    </Card>
  )
}


// Tunisia Heatmap Component
interface TunisiaHeatmapProps {
  heatmapData: Array<[number, number, number]> // [lat, lng, intensity]
}

const TunisiaHeatmap: React.FC<TunisiaHeatmapProps> = ({ heatmapData }) => {
  const mapRef = React.useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = React.useRef<L.Map | null>(null)
  const heatLayerRef = React.useRef<L.Layer | null>(null)

  React.useEffect(() => {
    if (!mapRef.current) return

    // Tunisia bounds (lat, lng)
    const tunisiaBounds = [
      [30.23, 7.52],  // Southwest
      [37.35, 11.62], // Northeast
    ] as [number, number][]

    // Destroy any previous map instance (avoids duplicate maps)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    // Create map and fit to Tunisia bounds
    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: true,
    })
    map.fitBounds(tunisiaBounds, { padding: [16, 16] })
    mapInstanceRef.current = map

    // Restrict panning to Tunisia
    const southWest = L.latLng(30.23, 7.52)
    const northEast = L.latLng(37.35, 11.62)
    const bounds = L.latLngBounds(southWest, northEast)
    map.setMaxBounds(bounds)
    map.options.maxBoundsViscosity = 1

    // Add tile layer (Carto Positron)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      maxZoom: 20,
    }).addTo(map)

    // Add heatmap layer if we have data
    if (heatmapData.length > 0 && (L as any).heatLayer) {
      heatLayerRef.current = (L as any).heatLayer(heatmapData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {
          0.0: '#0000ff',
          0.25: '#00ff00',
          0.5: '#ffff00',
          0.75: '#ff7700',
          1.0: '#ff0000',
        },
      }).addTo(map)
    } else if (heatmapData.length > 0) {
      // Fallback: show point circles if heatLayer not available
      heatmapData.forEach(([lat, lng, intensity]) => {
        L.circleMarker([lat, lng], {
          radius: Math.min(intensity || 5, 20),
          fillColor: `hsl(0, 100%, ${Math.max(30, 100 - (intensity || 1) * 10)}%)`,
          color: '#ff4444',
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.6,
        }).addTo(map)
      })
    }

    map.whenReady(() => {
      map.invalidateSize()
    })

    return () => {
      if (heatLayerRef.current) {
        heatLayerRef.current.remove()
        heatLayerRef.current = null
      }
      map.remove()
      mapInstanceRef.current = null
    }
  }, [heatmapData])

  return (
    <div
      ref={mapRef}
      className="h-96 rounded-lg border border-gray-200 dark:border-gray-700"
      style={{ backgroundColor: '#f3f4f6' }}
    />
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
