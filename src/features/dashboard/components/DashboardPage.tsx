import { useAnalytics } from '../../analytics/hooks/useAnalytics'
import { KpiCard } from '../../analytics/components/KpiCard'
import { Skeleton } from '../../../shared/components/Skeleton'

export default function DashboardPage() {
  const { data, isLoading } = useAnalytics()

  return (
    <div className="space-y-6 p-6">
      <h1 className="flex items-center gap-3 text-2xl font-semibold text-gray-900 dark:text-white">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7 shrink-0"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
        Dashboard
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} lines={3} className="h-5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {data?.kpis.map((kpi) => (
            <KpiCard key={kpi.label} metric={kpi} />
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Full charts available in{' '}
        <a
          href="/playGround-react/analytics"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Analytics
        </a>
      </p>
    </div>
  )
}
