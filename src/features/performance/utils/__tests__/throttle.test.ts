import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { throttle } from '../throttle'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('throttle', () => {
  it('calls fn immediately on first call', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 300)
    throttled()
    expect(fn).toHaveBeenCalledOnce()
  })

  it('ignores calls within interval', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 300)
    throttled()
    vi.advanceTimersByTime(100)
    throttled()
    vi.advanceTimersByTime(100)
    throttled()
    expect(fn).toHaveBeenCalledOnce()
  })

  it('allows a second call after interval elapses', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 300)
    throttled()
    vi.advanceTimersByTime(300)
    throttled()
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('passes arguments through', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 300)
    throttled('hello')
    expect(fn).toHaveBeenCalledWith('hello')
  })
})
