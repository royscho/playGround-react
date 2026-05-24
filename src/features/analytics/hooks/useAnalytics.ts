import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../../shared/utils/apiClient'
import type { AnalyticsData, KpiMetric } from '../../../shared/types/common'

interface AnalyticsResponse {
  data: AnalyticsData[]
  kpis: KpiMetric[]
}

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: () => apiClient.get<AnalyticsResponse>('/api/analytics'),
    staleTime: 1000 * 60 * 5,
  })
}
