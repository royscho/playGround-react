import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { DebounceThrottleSection } from '../DebounceThrottleSection'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('DebounceThrottleSection', () => {
  it('renders section', () => {
    render(<DebounceThrottleSection />)
    expect(screen.getByTestId('debounce-throttle')).toBeInTheDocument()
  })

  it('raw counter increments immediately on each change', () => {
    render(<DebounceThrottleSection />)
    fireEvent.change(screen.getByTestId('raw-input'), { target: { value: 'a' } })
    fireEvent.change(screen.getByTestId('raw-input'), { target: { value: 'ab' } })
    expect(screen.getByTestId('raw-counter')).toHaveTextContent('2')
  })

  it('debounced counter is 0 before delay elapses', () => {
    render(<DebounceThrottleSection />)
    fireEvent.change(screen.getByTestId('debounced-input'), { target: { value: 'a' } })
    fireEvent.change(screen.getByTestId('debounced-input'), { target: { value: 'ab' } })
    expect(screen.getByTestId('debounced-counter')).toHaveTextContent('0')
  })

  it('debounced counter increments once after 300ms delay', () => {
    render(<DebounceThrottleSection />)
    fireEvent.change(screen.getByTestId('debounced-input'), { target: { value: 'a' } })
    fireEvent.change(screen.getByTestId('debounced-input'), { target: { value: 'ab' } })
    act(() => vi.advanceTimersByTime(300))
    expect(screen.getByTestId('debounced-counter')).toHaveTextContent('1')
  })

  it('throttled counter increments on first change', () => {
    render(<DebounceThrottleSection />)
    fireEvent.change(screen.getByTestId('throttled-input'), { target: { value: 'a' } })
    expect(screen.getByTestId('throttled-counter')).toHaveTextContent('1')
  })

  it('throttled counter does not increment again within interval', () => {
    render(<DebounceThrottleSection />)
    fireEvent.change(screen.getByTestId('throttled-input'), { target: { value: 'a' } })
    act(() => vi.advanceTimersByTime(100))
    fireEvent.change(screen.getByTestId('throttled-input'), { target: { value: 'ab' } })
    expect(screen.getByTestId('throttled-counter')).toHaveTextContent('1')
  })
})
