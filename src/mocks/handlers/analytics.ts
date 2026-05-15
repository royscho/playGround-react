import { http, HttpResponse, delay } from 'msw'
import { mockAnalyticsData, mockKpis } from '../data/analytics'

export const analyticsHandlers = [
  http.get('/api/analytics', async () => {
    await delay(500)
    return HttpResponse.json({ data: mockAnalyticsData, kpis: mockKpis })
  }),
]
