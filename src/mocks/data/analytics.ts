import type { AnalyticsData, KpiMetric } from '../../shared/types/common'

export const mockAnalyticsData: AnalyticsData[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2024, 11, i + 1).toISOString().split('T')[0],
  revenue: Math.floor(Math.random() * 10000) + 5000,
  users: Math.floor(Math.random() * 500) + 100,
  sessions: Math.floor(Math.random() * 2000) + 500,
}))

export const mockKpis: KpiMetric[] = [
  { label: 'Total Revenue', value: 284500, change: 12.5, unit: '$' },
  { label: 'Active Users', value: 12340, change: -3.2 },
  { label: 'Conversion Rate', value: 3.8, change: 0.6, unit: '%' },
  { label: 'Avg Session', value: 4.2, change: 8.1, unit: 'min' },
]
