import { useTransition } from 'react'
import { useAnalytics } from '../hooks/useAnalytics'
import { KpiCard } from './KpiCard'
import { RevenueChart } from './RevenueChart'
import { Skeleton } from '../../../shared/components/Skeleton'
import { Button } from '../../../shared/components/Button'

export default function AnalyticsPage() {
  const [isPending, startTransition] = useTransition()
  const { data, isLoading, refetch } = useAnalytics()

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton lines={1} className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} lines={3} className="h-5" />
          ))}
        </div>
        <Skeleton lines={6} className="h-6" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Analytics</h1>
        <Button
          variant="secondary"
          size="sm"
          loading={isPending}
          onClick={() =>
            startTransition(() => {
              refetch()
            })
          }
        >
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {data?.kpis.map((kpi) => (
          <KpiCard key={kpi.label} metric={kpi} />
        ))}
      </div>

      {data?.data && <RevenueChart data={data.data} />}
    </div>
  )
}
