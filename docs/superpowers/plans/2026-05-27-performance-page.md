# Performance Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/performance` page with three interactive sections demonstrating Core Web Vitals, debounce/throttle, and Intersection Observer lazy loading.

**Architecture:** Three section components compose into a page shell, following the same pattern as `src/features/react-demos/`. Debounce and throttle are pure utility functions in `utils/`. Each section is independently testable with no shared state.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v4, Vitest + Testing Library, fake timers for debounce/throttle tests.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/features/performance/utils/debounce.ts` | Pure debounce function |
| Create | `src/features/performance/utils/throttle.ts` | Pure throttle function |
| Create | `src/features/performance/components/CoreWebVitalsSection.tsx` | Metric table + live nav timing |
| Create | `src/features/performance/components/DebounceThrottleSection.tsx` | Three-input event counter demo |
| Create | `src/features/performance/components/LazyLoadSection.tsx` | IntersectionObserver grid |
| Create | `src/features/performance/components/PerformancePage.tsx` | Page shell |
| Create | `src/features/performance/index.ts` | Public re-export |
| Create | `src/features/performance/utils/__tests__/debounce.test.ts` | debounce unit tests |
| Create | `src/features/performance/utils/__tests__/throttle.test.ts` | throttle unit tests |
| Create | `src/features/performance/components/__tests__/CoreWebVitalsSection.test.tsx` | Section render tests |
| Create | `src/features/performance/components/__tests__/DebounceThrottleSection.test.tsx` | Counter behavior tests |
| Create | `src/features/performance/components/__tests__/LazyLoadSection.test.tsx` | Intersection trigger tests |
| Create | `src/features/performance/components/__tests__/PerformancePage.test.tsx` | Page integration tests |
| Modify | `src/app/router.tsx` | Add lazy import + `/performance` route |
| Modify | `src/app/layout/Sidebar.tsx` | Add `⚡ Performance` nav item |

---

## Task 1: debounce + throttle utils

**Files:**
- Create: `src/features/performance/utils/debounce.ts`
- Create: `src/features/performance/utils/throttle.ts`
- Create: `src/features/performance/utils/__tests__/debounce.test.ts`
- Create: `src/features/performance/utils/__tests__/throttle.test.ts`

- [ ] **Step 1: Write failing debounce tests**

```ts
// src/features/performance/utils/__tests__/debounce.test.ts
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
```

- [ ] **Step 2: Run — verify FAIL**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run src/features/performance/utils/__tests__/debounce.test.ts
```

Expected: FAIL — `Cannot find module '../debounce'`

- [ ] **Step 3: Write debounce implementation**

```ts
// src/features/performance/utils/debounce.ts
export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>
  return ((...args: unknown[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }) as T
}
```

- [ ] **Step 4: Run — verify PASS**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run src/features/performance/utils/__tests__/debounce.test.ts
```

Expected: PASS (4 tests)

- [ ] **Step 5: Write failing throttle tests**

```ts
// src/features/performance/utils/__tests__/throttle.test.ts
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
```

- [ ] **Step 6: Run — verify FAIL**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run src/features/performance/utils/__tests__/throttle.test.ts
```

Expected: FAIL — `Cannot find module '../throttle'`

- [ ] **Step 7: Write throttle implementation**

```ts
// src/features/performance/utils/throttle.ts
export function throttle<T extends (...args: unknown[]) => void>(fn: T, interval: number): T {
  let last = 0
  return ((...args: unknown[]) => {
    const now = Date.now()
    if (now - last >= interval) {
      last = now
      fn(...args)
    }
  }) as T
}
```

- [ ] **Step 8: Run — verify PASS**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run src/features/performance/utils/__tests__/
```

Expected: PASS (8 tests across 2 files)

- [ ] **Step 9: Commit**

```bash
git add src/features/performance/utils/debounce.ts \
        src/features/performance/utils/throttle.ts \
        src/features/performance/utils/__tests__/debounce.test.ts \
        src/features/performance/utils/__tests__/throttle.test.ts
git commit -m "feat: add debounce and throttle utility functions"
```

---

## Task 2: CoreWebVitalsSection

**Files:**
- Create: `src/features/performance/components/__tests__/CoreWebVitalsSection.test.tsx`
- Create: `src/features/performance/components/CoreWebVitalsSection.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// src/features/performance/components/__tests__/CoreWebVitalsSection.test.tsx
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
```

- [ ] **Step 2: Run — verify FAIL**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run src/features/performance/components/__tests__/CoreWebVitalsSection.test.tsx
```

Expected: FAIL — `Cannot find module '../CoreWebVitalsSection'`

- [ ] **Step 3: Write implementation**

```tsx
// src/features/performance/components/CoreWebVitalsSection.tsx
const METRICS = [
  { name: 'LCP', full: 'Largest Contentful Paint', good: 2500, poor: 4000, unit: 'ms' },
  { name: 'CLS', full: 'Cumulative Layout Shift', good: 0.1, poor: 0.25, unit: '' },
  { name: 'INP', full: 'Interaction to Next Paint', good: 200, poor: 500, unit: 'ms' },
]

function getTextColor(value: number, good: number, poor: number) {
  if (value <= good) return 'text-green-600 dark:text-green-400'
  if (value <= poor) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

function getBgColor(value: number, good: number, poor: number) {
  if (value <= good) return 'bg-green-50 dark:bg-green-900/20'
  if (value <= poor) return 'bg-yellow-50 dark:bg-yellow-900/20'
  return 'bg-red-50 dark:bg-red-900/20'
}

export function CoreWebVitalsSection() {
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined

  return (
    <section data-testid="core-web-vitals">
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Core Web Vitals</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Google's user-centric metrics. Measured in production via{' '}
        <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">PerformanceObserver</code>.
      </p>

      <div className="mb-6 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm" data-testid="vitals-table">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Metric</th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-green-600">Good</th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-yellow-600">Needs Improvement</th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-red-600">Poor</th>
            </tr>
          </thead>
          <tbody>
            {METRICS.map(m => (
              <tr key={m.name} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2">
                  <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{m.name}</span>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{m.full}</span>
                </td>
                <td className="px-4 py-2 text-green-600">≤ {m.good}{m.unit}</td>
                <td className="px-4 py-2 text-yellow-600">≤ {m.poor}{m.unit}</td>
                <td className="px-4 py-2 text-red-600">&gt; {m.poor}{m.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {nav && (
        <div className="mb-6" data-testid="nav-timing">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">This page's actual timing:</p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'TTFB', value: nav.responseStart - nav.requestStart },
              { label: 'DOM Ready', value: nav.domContentLoadedEventEnd - nav.startTime },
              { label: 'Load', value: nav.loadEventEnd - nav.startTime },
            ].map(({ label, value }) => (
              <div key={label} className={`rounded-lg px-4 py-2 text-sm ${getBgColor(value, 2500, 4000)}`}>
                <span className="font-medium text-gray-700 dark:text-gray-300">{label}: </span>
                <span className={`font-mono font-bold ${getTextColor(value, 2500, 4000)}`}>
                  {value.toFixed(0)}ms
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <pre
        className="overflow-auto rounded-lg bg-gray-900 p-4 text-xs text-green-400"
        data-testid="perf-observer-snippet"
      >{`const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.name, entry.startTime)
  }
})
observer.observe({ type: 'largest-contentful-paint', buffered: true })`}</pre>
    </section>
  )
}
```

- [ ] **Step 4: Run — verify PASS**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run src/features/performance/components/__tests__/CoreWebVitalsSection.test.tsx
```

Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/performance/components/CoreWebVitalsSection.tsx \
        src/features/performance/components/__tests__/CoreWebVitalsSection.test.tsx
git commit -m "feat: add CoreWebVitalsSection with metric table and live timing"
```

---

## Task 3: DebounceThrottleSection

**Files:**
- Create: `src/features/performance/components/__tests__/DebounceThrottleSection.test.tsx`
- Create: `src/features/performance/components/DebounceThrottleSection.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// src/features/performance/components/__tests__/DebounceThrottleSection.test.tsx
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
```

- [ ] **Step 2: Run — verify FAIL**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run src/features/performance/components/__tests__/DebounceThrottleSection.test.tsx
```

Expected: FAIL — `Cannot find module '../DebounceThrottleSection'`

- [ ] **Step 3: Write implementation**

```tsx
// src/features/performance/components/DebounceThrottleSection.tsx
import { useState, useMemo } from 'react'
import { debounce } from '../utils/debounce'
import { throttle } from '../utils/throttle'

export function DebounceThrottleSection() {
  const [rawCount, setRawCount] = useState(0)
  const [debouncedCount, setDebouncedCount] = useState(0)
  const [throttledCount, setThrottledCount] = useState(0)

  const debouncedIncrement = useMemo(
    () => debounce(() => setDebouncedCount(c => c + 1), 300),
    []
  )
  const throttledIncrement = useMemo(
    () => throttle(() => setThrottledCount(c => c + 1), 300),
    []
  )

  return (
    <section data-testid="debounce-throttle">
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Debounce vs Throttle</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Type rapidly. Raw fires every keystroke. Debounced fires once after you stop.
        Throttled fires at most once per 300ms.
      </p>

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            label: 'Raw',
            description: 'Fires on every change event',
            testId: 'raw',
            count: rawCount,
            onChange: () => setRawCount(c => c + 1),
          },
          {
            label: 'Debounced (300ms)',
            description: 'Fires 300ms after last keystroke',
            testId: 'debounced',
            count: debouncedCount,
            onChange: debouncedIncrement,
          },
          {
            label: 'Throttled (300ms)',
            description: 'Fires at most once per 300ms',
            testId: 'throttled',
            count: throttledCount,
            onChange: throttledIncrement,
          },
        ].map(({ label, description, testId, count, onChange }) => (
          <div key={testId} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">{description}</p>
            <input
              type="text"
              onChange={onChange}
              placeholder="Type here..."
              className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              data-testid={`${testId}-input`}
            />
            <div
              className="rounded-md bg-gray-50 px-3 py-2 font-mono text-sm dark:bg-gray-800"
              data-testid={`${testId}-counter`}
            >
              {count}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run — verify PASS**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run src/features/performance/components/__tests__/DebounceThrottleSection.test.tsx
```

Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/performance/components/DebounceThrottleSection.tsx \
        src/features/performance/components/__tests__/DebounceThrottleSection.test.tsx
git commit -m "feat: add DebounceThrottleSection with live event counters"
```

---

## Task 4: LazyLoadSection

**Files:**
- Create: `src/features/performance/components/__tests__/LazyLoadSection.test.tsx`
- Create: `src/features/performance/components/LazyLoadSection.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// src/features/performance/components/__tests__/LazyLoadSection.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { LazyLoadSection } from '../LazyLoadSection'

let intersectCallback: IntersectionObserverCallback

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn().mockImplementation((callback: IntersectionObserverCallback) => {
      intersectCallback = callback
      return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() }
    })
  )
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
        [{ target: card, isIntersecting: true } as IntersectionObserverEntry],
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
        [{ target: card, isIntersecting: true } as IntersectionObserverEntry],
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
        [{ target: card, isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })
    expect(screen.getByTestId('lazy-card-0')).toHaveTextContent('Not loaded')
  })
})
```

- [ ] **Step 2: Run — verify FAIL**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run src/features/performance/components/__tests__/LazyLoadSection.test.tsx
```

Expected: FAIL — `Cannot find module '../LazyLoadSection'`

- [ ] **Step 3: Write implementation**

```tsx
// src/features/performance/components/LazyLoadSection.tsx
import { useState, useEffect, useRef, useCallback } from 'react'

const CARD_COUNT = 20

export function LazyLoadSection() {
  const [loadedCards, setLoadedCards] = useState<Set<number>>(new Set())
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const markLoaded = useCallback((index: number) => {
    setLoadedCards(prev => {
      if (prev.has(index)) return prev
      const next = new Set(prev)
      next.add(index)
      return next
    })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.cardIndex)
            markLoaded(index)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    cardRefs.current.forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [markLoaded])

  return (
    <section data-testid="lazy-load-section">
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
        Lazy Loading (IntersectionObserver)
      </h2>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        Scroll the grid. Cards load only when they enter the viewport.
      </p>
      <p className="mb-4 font-mono text-sm text-blue-600 dark:text-blue-400" data-testid="loaded-count">
        {loadedCards.size} / {CARD_COUNT}
      </p>

      <div className="h-72 overflow-y-auto rounded-lg border border-gray-200 p-3 dark:border-gray-700">
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: CARD_COUNT }, (_, i) => (
            <div
              key={i}
              ref={el => { cardRefs.current[i] = el }}
              data-card-index={i}
              data-testid={`lazy-card-${i}`}
              className="h-24 rounded-lg"
            >
              {loadedCards.has(i) ? (
                <div
                  className="flex h-full items-center justify-center rounded-lg text-xs font-medium text-white"
                  style={{ backgroundColor: `hsl(${(i * 37) % 360}, 60%, 55%)` }}
                >
                  Loaded ✓
                </div>
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-400 dark:bg-gray-700 dark:text-gray-500">
                  Not loaded
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run — verify PASS**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run src/features/performance/components/__tests__/LazyLoadSection.test.tsx
```

Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/performance/components/LazyLoadSection.tsx \
        src/features/performance/components/__tests__/LazyLoadSection.test.tsx
git commit -m "feat: add LazyLoadSection with IntersectionObserver"
```

---

## Task 5: PerformancePage + index.ts

**Files:**
- Create: `src/features/performance/components/__tests__/PerformancePage.test.tsx`
- Create: `src/features/performance/components/PerformancePage.tsx`
- Create: `src/features/performance/index.ts`

- [ ] **Step 1: Write failing tests**

```tsx
// src/features/performance/components/__tests__/PerformancePage.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import PerformancePage from '../PerformancePage'

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn().mockImplementation(() => ({ observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() }))
  )
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
```

- [ ] **Step 2: Run — verify FAIL**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run src/features/performance/components/__tests__/PerformancePage.test.tsx
```

Expected: FAIL — `Cannot find module '../PerformancePage'`

- [ ] **Step 3: Write PerformancePage**

```tsx
// src/features/performance/components/PerformancePage.tsx
import { CoreWebVitalsSection } from './CoreWebVitalsSection'
import { DebounceThrottleSection } from './DebounceThrottleSection'
import { LazyLoadSection } from './LazyLoadSection'

export default function PerformancePage() {
  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Performance</h1>
      <CoreWebVitalsSection />
      <DebounceThrottleSection />
      <LazyLoadSection />
    </div>
  )
}
```

- [ ] **Step 4: Write index.ts**

```ts
// src/features/performance/index.ts
export { default as PerformancePage } from './components/PerformancePage'
```

- [ ] **Step 5: Run all performance tests**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run src/features/performance
```

Expected: all pass (19 tests across 5 files)

- [ ] **Step 6: Commit**

```bash
git add src/features/performance/components/PerformancePage.tsx \
        src/features/performance/components/__tests__/PerformancePage.test.tsx \
        src/features/performance/index.ts
git commit -m "feat: add PerformancePage composing three demo sections"
```

---

## Task 6: Wire router + sidebar

**Files:**
- Modify: `src/app/router.tsx`
- Modify: `src/app/layout/Sidebar.tsx`

- [ ] **Step 1: Add lazy import to router**

In `src/app/router.tsx`, after the `ChatPage` lazy import line, add:

```tsx
const PerformancePage = lazy(() => import('../features/performance/components/PerformancePage'))
```

- [ ] **Step 2: Add route inside protected block**

In `src/app/router.tsx`, inside `<Route element={<AppLayout />}>`, after the `/chat` route, add:

```tsx
<Route
  path="/performance"
  element={
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <PerformancePage />
      </Suspense>
    </ErrorBoundary>
  }
/>
```

- [ ] **Step 3: Add sidebar nav item**

In `src/app/layout/Sidebar.tsx`, add to `navItems` after the Chat Demo entry:

```tsx
{ to: '/performance', label: 'Performance', icon: '⚡' },
```

- [ ] **Step 4: Run full test suite**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run
```

Expected: all tests pass, no regressions

- [ ] **Step 5: Commit**

```bash
git add src/app/router.tsx src/app/layout/Sidebar.tsx
git commit -m "feat: wire /performance route and sidebar nav link"
```
