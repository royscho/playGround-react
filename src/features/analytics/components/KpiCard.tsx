import { clsx } from 'clsx'
import type { KpiMetric } from '../../../shared/types/common'
import { formatNumber, formatPercent } from '../../../shared/utils/formatters'

interface KpiCardProps {
  metric: KpiMetric
}

export function KpiCard({ metric }: KpiCardProps) {
  const { label, value, change, unit } = metric
  const positive = change >= 0

  const formattedValue =
    unit === '$'
      ? `$${formatNumber(value)}`
      : unit === '%'
        ? formatPercent(value / 100)
        : unit === 'min'
          ? `${value}m`
          : formatNumber(value)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-gray-900 sm:text-3xl dark:text-white">{formattedValue}</p>
      <p
        className={clsx('mt-1 text-sm font-medium', {
          'text-green-600': positive,
          'text-red-500': !positive,
        })}
      >
        {positive ? '▲' : '▼'} {Math.abs(change)}%
      </p>
    </div>
  )
}
