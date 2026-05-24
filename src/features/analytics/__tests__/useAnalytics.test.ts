import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '../../../shared/utils/testUtils'
import { useAnalytics } from '../hooks/useAnalytics'

describe('useAnalytics', () => {
  it('fetches analytics data and kpis', async () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.data).toHaveLength(30)
    expect(result.current.data?.kpis).toHaveLength(4)
  })

  it('kpi has required fields', async () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const kpi = result.current.data!.kpis[0]
    expect(kpi).toHaveProperty('label')
    expect(kpi).toHaveProperty('value')
    expect(kpi).toHaveProperty('change')
  })
})
