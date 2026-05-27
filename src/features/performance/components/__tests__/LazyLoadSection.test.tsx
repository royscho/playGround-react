import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { LazyLoadSection } from '../LazyLoadSection'

let intersectCallback: IntersectionObserverCallback

beforeEach(() => {
  class MockIntersectionObserver {
    constructor(callback: IntersectionObserverCallback) {
      intersectCallback = callback
    }
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver as unknown as typeof IntersectionObserver)
})

describe('LazyLoadSection', () => {
  it('renders section', () => {
    render(<LazyLoadSection />)
    expect(screen.getByTestId('lazy-load-section')).toBeInTheDocument()
  })

  it('shows 0 / 20 loaded initially', () => {
    render(<LazyLoadSection />)
    expect(screen.getByTestId('loaded-count')).toHaveTextContent('0 / 20')
  })

  it('first card starts unloaded', () => {
    render(<LazyLoadSection />)
    expect(screen.getByTestId('lazy-card-0')).toHaveTextContent('Not loaded')
  })

  it('card shows Loaded state after intersection fires', () => {
    render(<LazyLoadSection />)
    const card = screen.getByTestId('lazy-card-0')
    act(() => {
      intersectCallback(
        [{ target: card, isIntersecting: true } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })
    expect(screen.getByTestId('lazy-card-0')).toHaveTextContent('Loaded ✓')
  })

  it('loaded count updates after intersection', () => {
    render(<LazyLoadSection />)
    const card = screen.getByTestId('lazy-card-0')
    act(() => {
      intersectCallback(
        [{ target: card, isIntersecting: true } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })
    expect(screen.getByTestId('loaded-count')).toHaveTextContent('1 / 20')
  })

  it('non-intersecting entry does not trigger load', () => {
    render(<LazyLoadSection />)
    const card = screen.getByTestId('lazy-card-0')
    act(() => {
      intersectCallback(
        [{ target: card, isIntersecting: false } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })
    expect(screen.getByTestId('lazy-card-0')).toHaveTextContent('Not loaded')
  })
})
