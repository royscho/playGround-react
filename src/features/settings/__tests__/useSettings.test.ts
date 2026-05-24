import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { createWrapper } from '../../../shared/utils/testUtils'
import { useSettings } from '../hooks/useSettings'

describe('useSettings', () => {
  it('optimistically updates profile before server responds', async () => {
    const { result } = renderHook(() => useSettings(), { wrapper: createWrapper() })

    const initial = { name: 'Alice', email: 'alice@example.com', bio: '' }

    act(() => {
      result.current.updateProfile(initial)
    })

    // optimistic update visible immediately
    expect(result.current.profile).toEqual(initial)
  })

  it('calls onSuccess after server confirms', async () => {
    const onSuccess = vi.fn()
    const { result } = renderHook(() => useSettings({ onSuccess }), { wrapper: createWrapper() })

    await act(async () => {
      result.current.updateProfile({ name: 'Bob', email: 'bob@example.com', bio: 'dev' })
    })

    await waitFor(() => expect(onSuccess).toHaveBeenCalled(), { timeout: 3000 })
  })
})
