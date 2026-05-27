import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CoreWebVitalsSection } from '../CoreWebVitalsSection'

afterEach(() => vi.restoreAllMocks())

describe('CoreWebVitalsSection', () => {
  it('renders section container', () => {
    render(<CoreWebVitalsSection />)
    expect(screen.getByTestId('core-web-vitals')).toBeInTheDocument()
  })

  it('renders metric table with LCP, CLS, INP rows', () => {
    render(<CoreWebVitalsSection />)
    expect(screen.getByTestId('vitals-table')).toBeInTheDocument()
    expect(screen.getByText('LCP')).toBeInTheDocument()
    expect(screen.getByText('CLS')).toBeInTheDocument()
    expect(screen.getByText('INP')).toBeInTheDocument()
  })

  it('shows nav timing panel when performance.getEntriesByType returns data', () => {
    vi.spyOn(performance, 'getEntriesByType').mockReturnValue([
      { requestStart: 0, responseStart: 80, domContentLoadedEventEnd: 400, loadEventEnd: 700, startTime: 0 } as unknown as PerformanceNavigationTiming,
    ])
    render(<CoreWebVitalsSection />)
    expect(screen.getByTestId('nav-timing')).toBeInTheDocument()
  })

  it('hides nav timing panel when no navigation entry', () => {
    vi.spyOn(performance, 'getEntriesByType').mockReturnValue([])
    render(<CoreWebVitalsSection />)
    expect(screen.queryByTestId('nav-timing')).not.toBeInTheDocument()
  })

  it('renders PerformanceObserver code snippet', () => {
    render(<CoreWebVitalsSection />)
    expect(screen.getByTestId('perf-observer-snippet')).toBeInTheDocument()
  })
})
