import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useNotificationsStore } from '../store/notificationsStore'

beforeEach(() => {
  useNotificationsStore.setState({ notifications: [] })
})

describe('notificationsStore', () => {
  it('adds a notification', () => {
    const { result } = renderHook(() => useNotificationsStore())

    act(() => {
      result.current.add({ title: 'Test', message: 'Hello', type: 'info' })
    })

    expect(result.current.notifications).toHaveLength(1)
    expect(result.current.notifications[0].read).toBe(false)
    expect(result.current.notifications[0].title).toBe('Test')
  })

  it('marks single notification read', () => {
    const { result } = renderHook(() => useNotificationsStore())

    act(() => {
      result.current.add({ title: 'Test', message: 'Hello', type: 'info' })
    })

    const id = result.current.notifications[0].id

    act(() => {
      result.current.markRead(id)
    })

    expect(result.current.notifications[0].read).toBe(true)
  })

  it('marks all notifications read', () => {
    const { result } = renderHook(() => useNotificationsStore())

    act(() => {
      result.current.add({ title: 'A', message: '1', type: 'info' })
      result.current.add({ title: 'B', message: '2', type: 'warning' })
    })

    act(() => {
      result.current.markAllRead()
    })

    expect(result.current.notifications.every((n) => n.read)).toBe(true)
  })

  it('unreadCount returns correct count', () => {
    const { result } = renderHook(() => useNotificationsStore())

    act(() => {
      result.current.add({ title: 'A', message: '1', type: 'info' })
      result.current.add({ title: 'B', message: '2', type: 'error' })
    })

    expect(result.current.unreadCount()).toBe(2)

    act(() => {
      result.current.markRead(result.current.notifications[0].id)
    })

    expect(result.current.unreadCount()).toBe(1)
  })
})
