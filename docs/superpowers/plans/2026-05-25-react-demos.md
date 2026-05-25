# React Demos Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/react-demos` page with three interactive demos: `useTransition`, virtualization with `@tanstack/react-virtual`, and compound components via a custom `Accordion`.

**Architecture:** New `src/features/react-demos/` feature following the css-examples pattern. One page composing three section components. `Accordion.tsx` is a self-contained compound component used by `CompoundComponentsSection`. No API calls, no MSW needed.

**Tech Stack:** React 18 (useTransition, createContext, useState), @tanstack/react-virtual v3, Vitest + Testing Library, React Router v6, Tailwind CSS v4.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/features/react-demos/components/Accordion.tsx` | Compound component: AccordionRoot + Item + Trigger + Content |
| Create | `src/features/react-demos/components/UseTransitionSection.tsx` | useTransition demo with search input + slow list |
| Create | `src/features/react-demos/components/VirtualizationSection.tsx` | Naive vs virtual list side-by-side |
| Create | `src/features/react-demos/components/CompoundComponentsSection.tsx` | Accordion demo + pattern explanation |
| Create | `src/features/react-demos/components/ReactDemosPage.tsx` | Page shell composing all 3 sections |
| Create | `src/features/react-demos/index.ts` | Public re-export |
| Create | `src/features/react-demos/components/__tests__/Accordion.test.tsx` | Accordion unit tests |
| Create | `src/features/react-demos/components/__tests__/UseTransitionSection.test.tsx` | Section render + interaction tests |
| Create | `src/features/react-demos/components/__tests__/VirtualizationSection.test.tsx` | Section render tests |
| Create | `src/features/react-demos/components/__tests__/CompoundComponentsSection.test.tsx` | Section render tests |
| Create | `src/features/react-demos/components/__tests__/ReactDemosPage.test.tsx` | Page integration tests |
| Modify | `src/app/router.tsx` | Add lazy import + `/react-demos` route |
| Modify | `src/app/layout/Sidebar.tsx` | Add React Demos nav item |

---

## Task 1: Accordion compound component

**Files:**
- Create: `src/features/react-demos/components/__tests__/Accordion.test.tsx`
- Create: `src/features/react-demos/components/Accordion.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/features/react-demos/components/__tests__/Accordion.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Accordion } from '../Accordion'

const TestAccordion = () => (
  <Accordion>
    <Accordion.Item id="a">
      <Accordion.Trigger>Question A</Accordion.Trigger>
      <Accordion.Content>Answer A</Accordion.Content>
    </Accordion.Item>
    <Accordion.Item id="b">
      <Accordion.Trigger>Question B</Accordion.Trigger>
      <Accordion.Content>Answer B</Accordion.Content>
    </Accordion.Item>
  </Accordion>
)

describe('Accordion', () => {
  it('renders triggers', () => {
    render(<TestAccordion />)
    expect(screen.getByText('Question A')).toBeInTheDocument()
    expect(screen.getByText('Question B')).toBeInTheDocument()
  })

  it('content hidden by default', () => {
    render(<TestAccordion />)
    expect(screen.queryByText('Answer A')).not.toBeInTheDocument()
    expect(screen.queryByText('Answer B')).not.toBeInTheDocument()
  })

  it('shows content when trigger clicked', async () => {
    render(<TestAccordion />)
    await userEvent.click(screen.getByText('Question A'))
    expect(screen.getByText('Answer A')).toBeInTheDocument()
  })

  it('closes when same trigger clicked again', async () => {
    render(<TestAccordion />)
    await userEvent.click(screen.getByText('Question A'))
    await userEvent.click(screen.getByText('Question A'))
    expect(screen.queryByText('Answer A')).not.toBeInTheDocument()
  })

  it('closes previous when different trigger clicked', async () => {
    render(<TestAccordion />)
    await userEvent.click(screen.getByText('Question A'))
    await userEvent.click(screen.getByText('Question B'))
    expect(screen.queryByText('Answer A')).not.toBeInTheDocument()
    expect(screen.getByText('Answer B')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run src/features/react-demos/components/__tests__/Accordion.test.tsx
```

Expected: FAIL — `Cannot find module '../Accordion'`

- [ ] **Step 3: Write implementation**

```tsx
// src/features/react-demos/components/Accordion.tsx
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface AccordionCtx {
  openId: string | null
  toggle: (id: string) => void
}

interface ItemCtx {
  id: string
}

const AccordionContext = createContext<AccordionCtx | null>(null)
const AccordionItemContext = createContext<ItemCtx | null>(null)

function useAccordionContext() {
  const ctx = useContext(AccordionContext)
  if (!ctx) throw new Error('Must be used inside <Accordion>')
  return ctx
}

function useItemContext() {
  const ctx = useContext(AccordionItemContext)
  if (!ctx) throw new Error('Must be used inside <Accordion.Item>')
  return ctx
}

function AccordionRoot({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id))
  return (
    <AccordionContext.Provider value={{ openId, toggle }}>
      <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

function Item({ id, children }: { id: string; children: ReactNode }) {
  return (
    <AccordionItemContext.Provider value={{ id }}>
      <div className="px-4">{children}</div>
    </AccordionItemContext.Provider>
  )
}

function Trigger({ children }: { children: ReactNode }) {
  const { openId, toggle } = useAccordionContext()
  const { id } = useItemContext()
  return (
    <button
      className="flex w-full items-center justify-between py-3 text-left text-sm font-medium text-gray-900 dark:text-white"
      onClick={() => toggle(id)}
      aria-expanded={openId === id}
    >
      {children}
      <span className="ml-2 text-xs text-gray-400">{openId === id ? '▲' : '▼'}</span>
    </button>
  )
}

function Content({ children }: { children: ReactNode }) {
  const { openId } = useAccordionContext()
  const { id } = useItemContext()
  if (openId !== id) return null
  return (
    <div className="pb-3 text-sm text-gray-600 dark:text-gray-400">
      {children}
    </div>
  )
}

export const Accordion = Object.assign(AccordionRoot, { Item, Trigger, Content })
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx vitest run src/features/react-demos/components/__tests__/Accordion.test.tsx
```

Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/react-demos/components/Accordion.tsx \
        src/features/react-demos/components/__tests__/Accordion.test.tsx
git commit -m "feat: add Accordion compound component"
```

---

## Task 2: UseTransitionSection

**Files:**
- Create: `src/features/react-demos/components/__tests__/UseTransitionSection.test.tsx`
- Create: `src/features/react-demos/components/UseTransitionSection.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/features/react-demos/components/__tests__/UseTransitionSection.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UseTransitionSection } from '../UseTransitionSection'

describe('UseTransitionSection', () => {
  it('renders section heading', () => {
    render(<UseTransitionSection />)
    expect(screen.getByRole('heading', { name: /usetransition/i })).toBeInTheDocument()
  })

  it('renders search input', () => {
    render(<UseTransitionSection />)
    expect(screen.getByTestId('search-input')).toBeInTheDocument()
  })

  it('renders mode toggle button', () => {
    render(<UseTransitionSection />)
    expect(screen.getByTestId('mode-toggle')).toBeInTheDocument()
  })

  it('default mode is transition', () => {
    render(<UseTransitionSection />)
    expect(screen.getByTestId('mode-toggle')).toHaveTextContent(/transition/i)
  })

  it('toggles mode on button click', async () => {
    render(<UseTransitionSection />)
    await userEvent.click(screen.getByTestId('mode-toggle'))
    expect(screen.getByTestId('mode-toggle')).toHaveTextContent(/normal/i)
  })

  it('updates input value on type', async () => {
    render(<UseTransitionSection />)
    const input = screen.getByTestId('search-input')
    await userEvent.type(input, 'Alice')
    expect(input).toHaveValue('Alice')
  })

  it('renders results list', () => {
    render(<UseTransitionSection />)
    expect(screen.getByTestId('results-list')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run src/features/react-demos/components/__tests__/UseTransitionSection.test.tsx
```

Expected: FAIL — `Cannot find module '../UseTransitionSection'`

- [ ] **Step 3: Write implementation**

```tsx
// src/features/react-demos/components/UseTransitionSection.tsx
import { useState, useTransition, useMemo } from 'react'

const NAMES = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Hank', 'Ivy', 'Jack']
const ALL_ITEMS = Array.from({ length: 10_000 }, (_, i) => `${NAMES[i % NAMES.length]} #${i + 1}`)

type Mode = 'normal' | 'transition'

// Simulates an expensive component render (for demo purposes only).
// Each item takes ~0.3ms — 100 items = ~30ms total, enough to feel as lag.
function SlowItem({ text }: { text: string }) {
  const start = performance.now()
  while (performance.now() - start < 0.3) {}
  return (
    <div className="border-b border-gray-100 px-3 py-1 text-sm dark:border-gray-800 dark:text-gray-300">
      {text}
    </div>
  )
}

export function UseTransitionSection() {
  const [inputValue, setInputValue] = useState('')
  const [listQuery, setListQuery] = useState('')
  const [mode, setMode] = useState<Mode>('transition')
  const [isPending, startTransition] = useTransition()

  const filtered = useMemo(
    () => ALL_ITEMS.filter(item => item.toLowerCase().includes(listQuery.toLowerCase())).slice(0, 100),
    [listQuery]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    if (mode === 'transition') {
      startTransition(() => setListQuery(val))
    } else {
      setListQuery(val)
    }
  }

  const toggleMode = () => {
    setMode(prev => (prev === 'transition' ? 'normal' : 'transition'))
    setInputValue('')
    setListQuery('')
  }

  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">useTransition</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Filter 10,000 items. In <strong>transition</strong> mode the input stays responsive —
        list updates are deferred so React can process keystrokes first.
        Switch to <strong>normal</strong> mode to feel the blocking lag.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Type to filter..."
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          data-testid="search-input"
        />
        <button
          onClick={toggleMode}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
          data-testid="mode-toggle"
        >
          Mode: <span className="font-bold text-blue-600">{mode}</span>
        </button>
        {isPending && (
          <span className="text-xs text-gray-400" data-testid="pending-indicator">
            updating list…
          </span>
        )}
      </div>

      <div
        className="h-64 overflow-auto rounded-md border border-gray-200 dark:border-gray-700"
        data-testid="results-list"
        style={{ opacity: isPending ? 0.6 : 1 }}
      >
        {filtered.map(item => (
          <SlowItem key={item} text={item} />
        ))}
      </div>

      <p className="mt-2 text-xs text-gray-400">
        Showing first 100 of {ALL_ITEMS.filter(i => i.toLowerCase().includes(listQuery.toLowerCase())).length.toLocaleString()} results
      </p>
    </section>
  )
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx vitest run src/features/react-demos/components/__tests__/UseTransitionSection.test.tsx
```

Expected: PASS (7 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/react-demos/components/UseTransitionSection.tsx \
        src/features/react-demos/components/__tests__/UseTransitionSection.test.tsx
git commit -m "feat: add UseTransitionSection demo"
```

---

## Task 3: VirtualizationSection

**Files:**
- Create: `src/features/react-demos/components/__tests__/VirtualizationSection.test.tsx`
- Create: `src/features/react-demos/components/VirtualizationSection.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/features/react-demos/components/__tests__/VirtualizationSection.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VirtualizationSection } from '../VirtualizationSection'

describe('VirtualizationSection', () => {
  it('renders section heading', () => {
    render(<VirtualizationSection />)
    expect(screen.getByRole('heading', { name: /virtualization/i })).toBeInTheDocument()
  })

  it('renders naive panel', () => {
    render(<VirtualizationSection />)
    expect(screen.getByTestId('naive-panel')).toBeInTheDocument()
  })

  it('renders virtual panel', () => {
    render(<VirtualizationSection />)
    expect(screen.getByTestId('virtual-panel')).toBeInTheDocument()
  })

  it('naive panel shows dom node count badge', () => {
    render(<VirtualizationSection />)
    expect(screen.getByTestId('naive-count')).toBeInTheDocument()
  })

  it('virtual panel shows dom node count badge', () => {
    render(<VirtualizationSection />)
    expect(screen.getByTestId('virtual-count')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run src/features/react-demos/components/__tests__/VirtualizationSection.test.tsx
```

Expected: FAIL — `Cannot find module '../VirtualizationSection'`

- [ ] **Step 3: Write implementation**

```tsx
// src/features/react-demos/components/VirtualizationSection.tsx
import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

const NAIVE_ITEMS = Array.from({ length: 2_000 }, (_, i) => `Row ${i + 1}`)
const VIRTUAL_ITEMS = Array.from({ length: 10_000 }, (_, i) => `Row ${i + 1}`)
const ROW_HEIGHT = 32

function NaiveList() {
  return (
    <div
      className="h-72 overflow-auto rounded border border-gray-200 dark:border-gray-700"
      data-testid="naive-list"
    >
      {NAIVE_ITEMS.map(item => (
        <div
          key={item}
          className="border-b border-gray-100 px-3 text-sm dark:border-gray-800 dark:text-gray-300"
          style={{ height: ROW_HEIGHT, lineHeight: `${ROW_HEIGHT}px` }}
        >
          {item}
        </div>
      ))}
    </div>
  )
}

function VirtualList() {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: VIRTUAL_ITEMS.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
  })

  return (
    <div
      ref={parentRef}
      className="h-72 overflow-auto rounded border border-gray-200 dark:border-gray-700"
      data-testid="virtual-list"
    >
      <div style={{ height: virtualizer.getTotalSize(), width: '100%', position: 'relative' }}>
        {virtualizer.getVirtualItems().map(row => (
          <div
            key={row.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${row.size}px`,
              transform: `translateY(${row.start}px)`,
            }}
            className="border-b border-gray-100 px-3 text-sm dark:border-gray-800 dark:text-gray-300"
          >
            {VIRTUAL_ITEMS[row.index]}
          </div>
        ))}
      </div>
    </div>
  )
}

export function VirtualizationSection() {
  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Virtualization</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Only render what's visible. Left: 2,000 real DOM nodes. Right: 10,000 items, ~15 DOM nodes at a time.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div data-testid="naive-panel">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Naive — all in DOM</p>
            <span
              className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400"
              data-testid="naive-count"
            >
              2,000 DOM nodes
            </span>
          </div>
          <NaiveList />
        </div>

        <div data-testid="virtual-panel">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Virtual — only visible rows</p>
            <span
              className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
              data-testid="virtual-count"
            >
              ~15 DOM nodes
            </span>
          </div>
          <VirtualList />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx vitest run src/features/react-demos/components/__tests__/VirtualizationSection.test.tsx
```

Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/react-demos/components/VirtualizationSection.tsx \
        src/features/react-demos/components/__tests__/VirtualizationSection.test.tsx
git commit -m "feat: add VirtualizationSection with naive vs virtual list"
```

---

## Task 4: CompoundComponentsSection

**Files:**
- Create: `src/features/react-demos/components/__tests__/CompoundComponentsSection.test.tsx`
- Create: `src/features/react-demos/components/CompoundComponentsSection.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/features/react-demos/components/__tests__/CompoundComponentsSection.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CompoundComponentsSection } from '../CompoundComponentsSection'

describe('CompoundComponentsSection', () => {
  it('renders section heading', () => {
    render(<CompoundComponentsSection />)
    expect(screen.getByRole('heading', { name: /compound components/i })).toBeInTheDocument()
  })

  it('renders accordion demo', () => {
    render(<CompoundComponentsSection />)
    expect(screen.getByTestId('accordion-demo')).toBeInTheDocument()
  })

  it('accordion items are collapsed by default', () => {
    render(<CompoundComponentsSection />)
    expect(screen.queryByText(/a javascript library/i)).not.toBeInTheDocument()
  })

  it('accordion item opens on trigger click', async () => {
    render(<CompoundComponentsSection />)
    await userEvent.click(screen.getByText('What is React?'))
    expect(screen.getByText(/a javascript library/i)).toBeInTheDocument()
  })

  it('renders code explanation panel', () => {
    render(<CompoundComponentsSection />)
    expect(screen.getByTestId('code-panel')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run src/features/react-demos/components/__tests__/CompoundComponentsSection.test.tsx
```

Expected: FAIL — `Cannot find module '../CompoundComponentsSection'`

- [ ] **Step 3: Write implementation**

```tsx
// src/features/react-demos/components/CompoundComponentsSection.tsx
import { Accordion } from './Accordion'

const FAQ = [
  { id: '1', q: 'What is React?', a: 'A JavaScript library for building user interfaces.' },
  { id: '2', q: 'What is a compound component?', a: 'Components that share implicit state via Context — no prop drilling needed.' },
  { id: '3', q: 'Why use Context here?', a: 'Each sub-component (Item, Trigger, Content) reads shared state without receiving explicit props.' },
]

const CODE = `const Accordion = Object.assign(AccordionRoot, {
  Item, Trigger, Content
})

// Usage — clean, no explicit state props:
<Accordion>
  <Accordion.Item id="1">
    <Accordion.Trigger>Question</Accordion.Trigger>
    <Accordion.Content>Answer</Accordion.Content>
  </Accordion.Item>
</Accordion>

// Internally uses two Contexts:
// AccordionContext  → { openId, toggle }
// AccordionItemContext → { id }
// Content reads both to decide whether to render.`

export function CompoundComponentsSection() {
  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Compound Components</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Sub-components share implicit state via Context. No prop drilling — the parent owns state,
        children read it through a shared context.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div data-testid="accordion-demo">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Live demo</p>
          <Accordion>
            {FAQ.map(({ id, q, a }) => (
              <Accordion.Item key={id} id={id}>
                <Accordion.Trigger>{q}</Accordion.Trigger>
                <Accordion.Content>{a}</Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>

        <div data-testid="code-panel">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">How it works</p>
          <pre className="overflow-auto rounded-lg bg-gray-900 p-4 text-xs text-green-400 dark:bg-gray-950">
            <code>{CODE}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx vitest run src/features/react-demos/components/__tests__/CompoundComponentsSection.test.tsx
```

Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/react-demos/components/CompoundComponentsSection.tsx \
        src/features/react-demos/components/__tests__/CompoundComponentsSection.test.tsx
git commit -m "feat: add CompoundComponentsSection with Accordion demo"
```

---

## Task 5: ReactDemosPage + index.ts

**Files:**
- Create: `src/features/react-demos/components/__tests__/ReactDemosPage.test.tsx`
- Create: `src/features/react-demos/components/ReactDemosPage.tsx`
- Create: `src/features/react-demos/index.ts`

- [ ] **Step 1: Write failing test**

```tsx
// src/features/react-demos/components/__tests__/ReactDemosPage.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ReactDemosPage from '../ReactDemosPage'

describe('ReactDemosPage', () => {
  it('renders page heading', () => {
    render(<ReactDemosPage />)
    expect(screen.getByRole('heading', { name: /react demos/i })).toBeInTheDocument()
  })

  it('renders all three section headings', () => {
    render(<ReactDemosPage />)
    expect(screen.getByRole('heading', { name: /usetransition/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /virtualization/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /compound components/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run src/features/react-demos/components/__tests__/ReactDemosPage.test.tsx
```

Expected: FAIL — `Cannot find module '../ReactDemosPage'`

- [ ] **Step 3: Write ReactDemosPage**

```tsx
// src/features/react-demos/components/ReactDemosPage.tsx
import { UseTransitionSection } from './UseTransitionSection'
import { VirtualizationSection } from './VirtualizationSection'
import { CompoundComponentsSection } from './CompoundComponentsSection'

export default function ReactDemosPage() {
  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">React Demos</h1>
      <UseTransitionSection />
      <VirtualizationSection />
      <CompoundComponentsSection />
    </div>
  )
}
```

- [ ] **Step 4: Write index.ts**

```ts
// src/features/react-demos/index.ts
export { default as ReactDemosPage } from './components/ReactDemosPage'
```

- [ ] **Step 5: Run test — verify it passes**

```bash
npx vitest run src/features/react-demos/components/__tests__/ReactDemosPage.test.tsx
```

Expected: PASS (2 tests)

- [ ] **Step 6: Run all react-demos tests**

```bash
npx vitest run src/features/react-demos
```

Expected: all pass (19 tests across 5 files)

- [ ] **Step 7: Commit**

```bash
git add src/features/react-demos/components/ReactDemosPage.tsx \
        src/features/react-demos/components/__tests__/ReactDemosPage.test.tsx \
        src/features/react-demos/index.ts
git commit -m "feat: add ReactDemosPage composing all three demos"
```

---

## Task 6: Wire router + sidebar

**Files:**
- Modify: `src/app/router.tsx`
- Modify: `src/app/layout/Sidebar.tsx`

- [ ] **Step 1: Add lazy import to router**

In `src/app/router.tsx`, add after the `CssExamplesPage` lazy import:

```tsx
const ReactDemosPage = lazy(() => import('../features/react-demos/components/ReactDemosPage'))
```

- [ ] **Step 2: Add route inside protected block**

In `src/app/router.tsx`, inside `<Route element={<AppLayout />}>`, add after the `/css-examples` route:

```tsx
<Route
  path="/react-demos"
  element={
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <ReactDemosPage />
      </Suspense>
    </ErrorBoundary>
  }
/>
```

- [ ] **Step 3: Add sidebar nav item**

In `src/app/layout/Sidebar.tsx`, add to `navItems` after the CSS Examples entry:

```tsx
{ to: '/react-demos', label: 'React Demos', icon: '⚛️' },
```

- [ ] **Step 4: Run all react-demos tests**

```bash
npx vitest run src/features/react-demos
```

Expected: all pass

- [ ] **Step 5: Run full test suite**

```bash
npx vitest run
```

Expected: all tests pass, no regressions

- [ ] **Step 6: Commit**

```bash
git add src/app/router.tsx src/app/layout/Sidebar.tsx
git commit -m "feat: wire /react-demos route and sidebar nav link"
```
