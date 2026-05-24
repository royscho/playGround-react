import { useAnalytics } from '../../analytics/hooks/useAnalytics'
import { KpiCard } from '../../analytics/components/KpiCard'
import { Skeleton } from '../../../shared/components/Skeleton'

export default function DashboardPage() {
  const { data, isLoading } = useAnalytics()

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} lines={3} className="h-5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {data?.kpis.map((kpi) => <KpiCard key={kpi.label} metric={kpi} />)}
        </div>
      )}

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Full charts available in{' '}
        <a href="/analytics" className="text-blue-600 hover:underline dark:text-blue-400">
          Analytics
        </a>
      </p>
    </div>
  )
}
