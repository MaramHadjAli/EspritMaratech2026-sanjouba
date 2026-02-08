import { Users, Calendar, Package, MapPin, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  gradient: string
  trend?: number
}

const StatCard = ({ title, value, icon, gradient, trend }: StatCardProps) => (
  <div
    className={`
      relative overflow-hidden rounded-2xl p-5 sm:p-6
      bg-gradient-to-br ${gradient}
      shadow-lg hover:shadow-2xl
      transform hover:-translate-y-1 hover:scale-[1.02]
      transition-all duration-300 ease-out
      border border-white/10
      group flex-1 min-w-[140px]
    `}
  >
    {/* Glow effect */}
    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    {/* Background circle */}
    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all" />
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs sm:text-sm font-medium text-white/80 uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
          {icon}
        </div>
      </div>
      
      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
        {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
      </p>
      
      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-xs ${trend >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
          <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
          <span>{trend >= 0 ? '+' : ''}{trend}%</span>
        </div>
      )}
    </div>
  </div>
)

interface StatsCardsProps {
  stats: {
    totalFamilies: number
    totalVisits: number
    aidDistributed: number
    activeRegions: number
  }
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const { t } = useTranslation()

  const cards = [
    {
      title: t('dashboard.totalFamilies', 'Total Familles'),
      value: stats.totalFamilies,
      icon: <Users className="w-5 h-5 text-white" />,
      gradient: 'from-blue-500 to-blue-700',
      trend: 12
    },
    {
      title: t('dashboard.totalVisits', 'Total Visites'),
      value: stats.totalVisits,
      icon: <Calendar className="w-5 h-5 text-white" />,
      gradient: 'from-emerald-500 to-emerald-700',
      trend: 8
    },
    {
      title: t('dashboard.aidDistributed', 'Aides Distribuées'),
      value: stats.aidDistributed,
      icon: <Package className="w-5 h-5 text-white" />,
      gradient: 'from-amber-500 to-amber-700',
      trend: 24
    },
    {
      title: t('dashboard.activeRegions', 'Régions Actives'),
      value: stats.activeRegions,
      icon: <MapPin className="w-5 h-5 text-white" />,
      gradient: 'from-purple-500 to-purple-700'
    }
  ]

  return (
    <div className="flex flex-wrap gap-4 md:gap-6">
      {cards.map((card, i) => (
        <StatCard key={i} {...card} />
      ))}
    </div>
  )
}

export default StatsCards