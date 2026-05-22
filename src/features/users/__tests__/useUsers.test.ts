import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '../../../shared/utils/testUtils'
import { useUsers } from '../hooks/useUsers'

describe('useUsers', () => {
  it('fetches first page of users', async () => {
    const { result } = renderHook(() => useUsers({ page: 1, pageSize: 10, search: '' }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.data).toHaveLength(10)
    expect(result.current.data?.total).toBe(50)
  })

  it('filters by search', async () => {
    const { result } = renderHook(
      () => useUsers({ page: 1, pageSize: 10, search: 'Alice' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    result.current.data?.data.forEach((u) => {
      expect(u.name.toLowerCase()).toContain('alice')
    })
  })

  it('paginates correctly', async () => {
    const { result } = renderHook(() => useUsers({ page: 2, pageSize: 10, search: '' }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.page).toBe(2)
    expect(result.current.data?.data).toHaveLength(10)
  })
})
