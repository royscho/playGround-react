// src/features/chat/hooks/__tests__/useChat.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useChat } from '../useChat'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('useChat', () => {
  it('starts as connecting', () => {
    const { result } = renderHook(() => useChat())
    expect(result.current.status).toBe('connecting')
  })

  it('transitions to connected after 300ms', async () => {
    const { result } = renderHook(() => useChat())
    await act(async () => { vi.advanceTimersByTime(300) })
    expect(result.current.status).toBe('connected')
  })

  it('starts with empty messages', () => {
    const { result } = renderHook(() => useChat())
    expect(result.current.messages).toHaveLength(0)
  })

  it('send() appends user message immediately', async () => {
    const { result } = renderHook(() => useChat())
    await act(async () => { vi.advanceTimersByTime(300) })
    act(() => { result.current.setInputValue('Hello') })
    await act(async () => { result.current.send() })
    expect(result.current.messages).toHaveLength(1)
    expect(result.current.messages[0].sender).toBe('user')
    expect(result.current.messages[0].text).toBe('Hello')
  })

  it('bot reply arrives after 800ms', async () => {
    const { result } = renderHook(() => useChat())
    await act(async () => { vi.advanceTimersByTime(300) })
    act(() => { result.current.setInputValue('Hello') })
    await act(async () => { result.current.send() })
    await act(async () => { vi.advanceTimersByTime(800) })
    expect(result.current.messages).toHaveLength(2)
    expect(result.current.messages[1].sender).toBe('bot')
  })

  it('send() clears inputValue', async () => {
    const { result } = renderHook(() => useChat())
    await act(async () => { vi.advanceTimersByTime(300) })
    act(() => { result.current.setInputValue('Hello') })
    await act(async () => { result.current.send() })
    expect(result.current.inputValue).toBe('')
  })

  it('send() logs a frame', async () => {
    const { result } = renderHook(() => useChat())
    await act(async () => { vi.advanceTimersByTime(300) })
    act(() => { result.current.setInputValue('Hello') })
    await act(async () => { result.current.send() })
    expect(result.current.frames).toHaveLength(1)
    expect(result.current.frames[0].direction).toBe('sent')
  })

  it('bot reply logs a received frame', async () => {
    const { result } = renderHook(() => useChat())
    await act(async () => { vi.advanceTimersByTime(300) })
    act(() => { result.current.setInputValue('Hello') })
    await act(async () => { result.current.send() })
    await act(async () => { vi.advanceTimersByTime(800) })
    expect(result.current.frames).toHaveLength(2)
    expect(result.current.frames[1].direction).toBe('received')
  })

  it('reconnect() resets to connecting', async () => {
    const { result } = renderHook(() => useChat())
    await act(async () => { vi.advanceTimersByTime(300) })
    await act(async () => { result.current.reconnect() })
    expect(result.current.status).toBe('connecting')
  })
})
