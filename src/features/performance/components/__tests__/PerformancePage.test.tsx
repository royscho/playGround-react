import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import PerformancePage from '../PerformancePage'

beforeEach(() => {
  class MockIntersectionObserver {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver as any)
  vi.spyOn(performance, 'getEntriesByType').mockReturnValue([])
})

describe('PerformancePage', () => {
  it('renders page heading', () => {
    render(<PerformancePage />)
    expect(screen.getByRole('heading', { name: /performance/i, level: 1 })).toBeInTheDocument()
  })

  it('renders core web vitals section', () => {
    render(<PerformancePage />)
    expect(screen.getByTestId('core-web-vitals')).toBeInTheDocument()
  })

  it('renders debounce throttle section', () => {
    render(<PerformancePage />)
    expect(screen.getByTestId('debounce-throttle')).toBeInTheDocument()
  })

  it('renders lazy load section', () => {
    render(<PerformancePage />)
    expect(screen.getByTestId('lazy-load-section')).toBeInTheDocument()
  })
})
