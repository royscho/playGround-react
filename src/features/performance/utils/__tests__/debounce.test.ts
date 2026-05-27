import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce } from '../debounce'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('debounce', () => {
  it('does not call fn before delay elapses', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)
    debounced()
    expect(fn).not.toHaveBeenCalled()
  })

  it('calls fn once after delay', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)
    debounced()
    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledOnce()
  })

  it('resets timer on each call — only fires after final call + delay', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)
    debounced()
    vi.advanceTimersByTime(200)
    debounced()
    vi.advanceTimersByTime(200)
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledOnce()
  })

  it('passes arguments through', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)
    debounced('hello')
    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledWith('hello')
  })
})
