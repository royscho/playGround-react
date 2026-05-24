import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { createWrapper } from '../../../shared/utils/testUtils'
import { useSettings } from '../hooks/useSettings'

describe('useSettings', () => {
  it('fetches initial profile from server', async () => {
    const { result } = renderHook(() => useSettings(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.profile?.name).toBe('Admin User')
    expect(result.current.profile?.email).toBe('admin@example.com')
  })

  it('optimistically updates profile before server responds', async () => {
    const { result } = renderHook(() => useSettings(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const updated = { name: 'Alice', email: 'alice@example.com', bio: 'dev' }

    act(() => {
      result.current.updateProfile(updated)
    })

    await waitFor(() => expect(result.current.profile).toEqual(updated))
  })

  it('calls onSuccess after server confirms', async () => {
    const onSuccess = vi.fn()
    const { result } = renderHook(() => useSettings({ onSuccess }), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      result.current.updateProfile({ name: 'Bob', email: 'bob@example.com', bio: 'dev' })
    })

    await waitFor(() => expect(onSuccess).toHaveBeenCalled(), { timeout: 3000 })
  })
})
