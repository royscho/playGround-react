# Animation Playground Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an `AnimationPlaygroundSection` to the CSS Examples page — an interactive playground with a live animation preview, controls for duration/delay/iteration-count, and a generated code snippet showing the inline style pattern.

**Architecture:** Self-contained `AnimationPlaygroundSection` with all state local (`useState`). Two-column layout: controls panel left, preview + code snippet right. Animation applied via Tailwind class + inline style override. `replayKey` increment forces demo element remount.

**Tech Stack:** React `useState`, Tailwind 4, Vitest + Testing Library, Storybook (`@storybook/react-vite`).

---

## File Map

| File | Action |
|------|--------|
| `src/features/css-examples/components/AnimationPlaygroundSection.tsx` | Create |
| `src/features/css-examples/components/__tests__/AnimationPlaygroundSection.test.tsx` | Create |
| `src/features/css-examples/components/__stories__/AnimationPlaygroundSection.stories.tsx` | Create |
| `src/features/css-examples/components/CssExamplesPage.tsx` | Modify — add `<AnimationPlaygroundSection />` |
| `src/features/css-examples/components/__tests__/CssExamplesPage.test.tsx` | Modify — update "five" → "six" section headings test |

---

### Task 1: AnimationPlaygroundSection component (TDD)

**Files:**
- Create: `src/features/css-examples/components/__tests__/AnimationPlaygroundSection.test.tsx`
- Create: `src/features/css-examples/components/AnimationPlaygroundSection.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/features/css-examples/components/__tests__/AnimationPlaygroundSection.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AnimationPlaygroundSection } from '../AnimationPlaygroundSection'

describe('AnimationPlaygroundSection', () => {
  it('renders section heading', () => {
    render(<AnimationPlaygroundSection />)
    expect(screen.getByRole('heading', { name: /animation playground/i })).toBeInTheDocument()
  })

  it('renders animation select with all 4 options', () => {
    render(<AnimationPlaygroundSection />)
    const select = screen.getByLabelText(/animation/i)
    expect(select).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Spin' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Bounce' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Pulse' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Ping' })).toBeInTheDocument()
  })

  it('renders duration slider', () => {
    render(<AnimationPlaygroundSection />)
    expect(screen.getByLabelText(/duration/i)).toBeInTheDocument()
  })

  it('renders delay slider', () => {
    render(<AnimationPlaygroundSection />)
    expect(screen.getByLabelText(/delay/i)).toBeInTheDocument()
  })

  it('renders iteration count select', () => {
    render(<AnimationPlaygroundSection />)
    expect(screen.getByLabelText(/iterations/i)).toBeInTheDocument()
  })

  it('renders Restart button', () => {
    render(<AnimationPlaygroundSection />)
    expect(screen.getByRole('button', { name: /restart/i })).toBeInTheDocument()
  })

  it('code snippet updates when duration slider changes', () => {
    render(<AnimationPlaygroundSection />)
    const slider = screen.getByLabelText(/duration/i)
    fireEvent.change(slider, { target: { value: '2.5' } })
    expect(screen.getByTestId('code-snippet').textContent).toContain('2.5s')
  })

  it('code snippet updates when animation selection changes', () => {
    render(<AnimationPlaygroundSection />)
    const select = screen.getByLabelText(/animation/i)
    fireEvent.change(select, { target: { value: 'spin' } })
    expect(screen.getByTestId('code-snippet').textContent).toContain('animate-spin')
  })

  it('Restart button changes demo data-key', () => {
    render(<AnimationPlaygroundSection />)
    const demo = screen.getByTestId('playground-demo')
    const initialKey = demo.getAttribute('data-key')
    fireEvent.click(screen.getByRole('button', { name: /restart/i }))
    expect(screen.getByTestId('playground-demo').getAttribute('data-key')).not.toBe(initialKey)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/features/css-examples/components/__tests__/AnimationPlaygroundSection.test.tsx
```

Expected: FAIL — `Cannot find module '../AnimationPlaygroundSection'`

- [ ] **Step 3: Implement AnimationPlaygroundSection.tsx**

Create `src/features/css-examples/components/AnimationPlaygroundSection.tsx`:

```tsx
import { useState } from 'react'
import type { CSSProperties } from 'react'

type AnimationName = 'spin' | 'bounce' | 'pulse' | 'ping'

const ANIMATIONS: { value: AnimationName; label: string }[] = [
  { value: 'spin', label: 'Spin' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'ping', label: 'Ping' },
]

const ITERATION_OPTIONS = ['1', '2', '3', '5', 'infinite'] as const

function buildCodeSnippet(
  name: AnimationName,
  duration: number,
  delay: number,
  iterationCount: number | 'infinite',
): string {
  const iterStr = iterationCount === 'infinite' ? `'infinite'` : String(iterationCount)
  return `<div
  className="animate-${name}"
  style={{
    animationDuration: '${duration.toFixed(1)}s',
    animationDelay: '${delay.toFixed(1)}s',
    animationIterationCount: ${iterStr},
  }}
/>`
}

function renderDemo(name: AnimationName, replayKey: number, style: CSSProperties) {
  switch (name) {
    case 'spin':
      return (
        <div key={replayKey} className="animate-spin text-3xl text-indigo-500" style={style}>
          ⟳
        </div>
      )
    case 'bounce':
      return <div key={replayKey} className="animate-bounce h-6 w-6 rounded-full bg-pink-500" style={style} />
    case 'pulse':
      return (
        <div
          key={replayKey}
          className="animate-pulse h-5 w-20 rounded bg-gray-300 dark:bg-gray-600"
          style={style}
        />
      )
    case 'ping':
      return (
        <div key={replayKey} className="relative flex h-8 w-8 items-center justify-center">
          <div
            className="animate-ping absolute h-full w-full rounded-full bg-sky-400 opacity-75"
            style={style}
          />
          <div className="relative h-4 w-4 rounded-full bg-sky-500" />
        </div>
      )
  }
}

export function AnimationPlaygroundSection() {
  const [selectedAnimation, setSelectedAnimation] = useState<AnimationName>('bounce')
  const [duration, setDuration] = useState(1)
  const [delay, setDelay] = useState(0)
  const [iterationCount, setIterationCount] = useState<number | 'infinite'>('infinite')
  const [replayKey, setReplayKey] = useState(0)

  const animStyle: CSSProperties = {
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    animationIterationCount: iterationCount,
  }

  const codeSnippet = buildCodeSnippet(selectedAnimation, duration, delay, iterationCount)

  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Animation Playground</h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Customize Tailwind animations with inline styles. Inline styles override the animation defaults.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <div>
            <label
              htmlFor="animation-select"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Animation
            </label>
            <select
              id="animation-select"
              value={selectedAnimation}
              onChange={e => setSelectedAnimation(e.target.value as AnimationName)}
              className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              {ANIMATIONS.map(a => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="duration-slider"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Duration: {duration.toFixed(1)}s
            </label>
            <input
              id="duration-slider"
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label
              htmlFor="delay-slider"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Delay: {delay.toFixed(1)}s
            </label>
            <input
              id="delay-slider"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={delay}
              onChange={e => setDelay(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label
              htmlFor="iteration-select"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Iterations
            </label>
            <select
              id="iteration-select"
              value={String(iterationCount)}
              onChange={e => {
                const val = e.target.value
                setIterationCount(val === 'infinite' ? 'infinite' : Number(val))
              }}
              className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              {ITERATION_OPTIONS.map(o => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setReplayKey(k => k + 1)}
            className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Restart
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div
            data-testid="playground-demo"
            data-key={replayKey}
            className="flex h-32 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700"
          >
            {renderDemo(selectedAnimation, replayKey, animStyle)}
          </div>
          <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-green-400">
            <code data-testid="code-snippet">{codeSnippet}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/features/css-examples/components/__tests__/AnimationPlaygroundSection.test.tsx
```

Expected: All 9 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/css-examples/components/AnimationPlaygroundSection.tsx \
        src/features/css-examples/components/__tests__/AnimationPlaygroundSection.test.tsx
git commit -m "feat(css-examples): add AnimationPlaygroundSection with live controls"
```

---

### Task 2: Storybook story

**Files:**
- Create: `src/features/css-examples/components/__stories__/AnimationPlaygroundSection.stories.tsx`

- [ ] **Step 1: Create the story file**

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnimationPlaygroundSection } from '../AnimationPlaygroundSection'

const meta: Meta<typeof AnimationPlaygroundSection> = {
  component: AnimationPlaygroundSection,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof AnimationPlaygroundSection>

export const Default: Story = {}
```

- [ ] **Step 2: Verify lint passes**

```bash
npm run lint
```

Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/features/css-examples/components/__stories__/AnimationPlaygroundSection.stories.tsx
git commit -m "feat(css-examples): add AnimationPlaygroundSection Storybook story"
```

---

### Task 3: Wire into CssExamplesPage

**Files:**
- Modify: `src/features/css-examples/components/CssExamplesPage.tsx`
- Modify: `src/features/css-examples/components/__tests__/CssExamplesPage.test.tsx`

- [ ] **Step 1: Update CssExamplesPage.tsx**

Replace the file with:

```tsx
import { VisualEffectsSection } from './VisualEffectsSection'
import { TransitionsSection } from './TransitionsSection'
import { FlexboxGridSection } from './FlexboxGridSection'
import { CustomPropertiesSection } from './CustomPropertiesSection'
import { AnimationsSection } from './AnimationsSection'
import { AnimationPlaygroundSection } from './AnimationPlaygroundSection'

export default function CssExamplesPage() {
  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">CSS3 Examples</h1>
      <VisualEffectsSection />
      <TransitionsSection />
      <FlexboxGridSection />
      <CustomPropertiesSection />
      <AnimationsSection />
      <AnimationPlaygroundSection />
    </div>
  )
}
```

- [ ] **Step 2: Update CssExamplesPage.test.tsx**

Replace the file with:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CssExamplesPage from '../CssExamplesPage'

describe('CssExamplesPage', () => {
  it('renders page heading', () => {
    render(<CssExamplesPage />)
    expect(screen.getByRole('heading', { name: /css3 examples/i })).toBeInTheDocument()
  })

  it('renders all six section headings', () => {
    render(<CssExamplesPage />)
    expect(screen.getByRole('heading', { name: /visual effects/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /transitions & animations/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /flexbox & grid/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /custom properties/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /css animations/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /animation playground/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run full test suite**

```bash
npm run test -- --run 2>&1 | tail -5
```

Expected: all tests pass (266 + 9 new = 275 tests)

- [ ] **Step 4: Commit**

```bash
git add src/features/css-examples/components/CssExamplesPage.tsx \
        src/features/css-examples/components/__tests__/CssExamplesPage.test.tsx
git commit -m "feat(css-examples): wire AnimationPlaygroundSection into CssExamplesPage"
```
