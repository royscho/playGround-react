# Animations Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an `AnimationsSection` to the CSS Examples page showcasing Tailwind 4 built-in animations and custom `@keyframes` animations with per-card replay buttons.

**Architecture:** Self-contained `AnimationsSection` with an internal `AnimationCard` sub-component that manages its own `replayKey` state. Two sub-sections: Tailwind built-ins (`animate-spin`, `animate-bounce`, `animate-pulse`, `animate-ping`) and custom `@keyframes` animations (fade-in, slide-up, shake, zoom-in). Replay works by incrementing a `key` prop to remount the animated element.

**Tech Stack:** React `useState`, Tailwind 4 animation utilities, inline `<style>` tag for custom `@keyframes`, Vitest + Testing Library, Storybook (`@storybook/react-vite`).

---

## File Map

| File | Action |
|------|--------|
| `src/features/css-examples/components/AnimationsSection.tsx` | Create |
| `src/features/css-examples/components/__tests__/AnimationsSection.test.tsx` | Create |
| `src/features/css-examples/components/__stories__/AnimationsSection.stories.tsx` | Create (directory is new) |
| `src/features/css-examples/components/CssExamplesPage.tsx` | Modify — add `<AnimationsSection />` |
| `src/features/css-examples/components/__tests__/CssExamplesPage.test.tsx` | Modify — update "four" → "five" section headings test |

---

### Task 1: AnimationsSection component (TDD)

**Files:**
- Create: `src/features/css-examples/components/__tests__/AnimationsSection.test.tsx`
- Create: `src/features/css-examples/components/AnimationsSection.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/features/css-examples/components/__tests__/AnimationsSection.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AnimationsSection } from '../AnimationsSection'

describe('AnimationsSection', () => {
  it('renders section heading', () => {
    render(<AnimationsSection />)
    expect(screen.getByRole('heading', { name: /css animations/i })).toBeInTheDocument()
  })

  it('renders Tailwind built-in sub-heading', () => {
    render(<AnimationsSection />)
    expect(screen.getByText(/tailwind built-ins/i)).toBeInTheDocument()
  })

  it('renders custom keyframes sub-heading', () => {
    render(<AnimationsSection />)
    expect(screen.getByText(/custom @keyframes/i)).toBeInTheDocument()
  })

  it('renders all 4 Tailwind animation labels', () => {
    render(<AnimationsSection />)
    expect(screen.getByText('Spin')).toBeInTheDocument()
    expect(screen.getByText('Bounce')).toBeInTheDocument()
    expect(screen.getByText('Pulse')).toBeInTheDocument()
    expect(screen.getByText('Ping')).toBeInTheDocument()
  })

  it('renders all 4 custom animation labels', () => {
    render(<AnimationsSection />)
    expect(screen.getByText('Fade In')).toBeInTheDocument()
    expect(screen.getByText('Slide Up')).toBeInTheDocument()
    expect(screen.getByText('Shake')).toBeInTheDocument()
    expect(screen.getByText('Zoom In')).toBeInTheDocument()
  })

  it('renders Tailwind class names in code elements', () => {
    render(<AnimationsSection />)
    expect(screen.getByText('animate-spin')).toBeInTheDocument()
    expect(screen.getByText('animate-bounce')).toBeInTheDocument()
    expect(screen.getByText('animate-pulse')).toBeInTheDocument()
    expect(screen.getByText('animate-ping')).toBeInTheDocument()
  })

  it('renders custom class names in code elements', () => {
    render(<AnimationsSection />)
    expect(screen.getByText('anim-fade-in')).toBeInTheDocument()
    expect(screen.getByText('anim-slide-up')).toBeInTheDocument()
    expect(screen.getByText('anim-shake')).toBeInTheDocument()
    expect(screen.getByText('anim-zoom-in')).toBeInTheDocument()
  })

  it('clicking Replay on Spin card re-renders its animation element', async () => {
    render(<AnimationsSection />)
    const replayButtons = screen.getAllByRole('button', { name: /replay/i })
    const spinDemo = screen.getByTestId('demo-spin')
    const initialKey = spinDemo.getAttribute('data-key')
    await userEvent.click(replayButtons[0])
    expect(screen.getByTestId('demo-spin').getAttribute('data-key')).not.toBe(initialKey)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/features/css-examples/components/__tests__/AnimationsSection.test.tsx
```

Expected: FAIL — `Cannot find module '../AnimationsSection'`

- [ ] **Step 3: Implement AnimationsSection.tsx**

Create `src/features/css-examples/components/AnimationsSection.tsx`:

```tsx
import { useState } from 'react'

interface AnimationCardProps {
  label: string
  codeLabel: string
  testId: string
  children: (replayKey: number) => React.ReactNode
}

function AnimationCard({ label, codeLabel, testId, children }: AnimationCardProps) {
  const [replayKey, setReplayKey] = useState(0)
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <div
        data-testid={testId}
        data-key={replayKey}
        className="flex h-16 w-full items-center justify-center"
      >
        {children(replayKey)}
      </div>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
      <code className="text-xs text-indigo-600 dark:text-indigo-400">{codeLabel}</code>
      <button
        onClick={() => setReplayKey(k => k + 1)}
        className="rounded px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        Replay
      </button>
    </div>
  )
}

export function AnimationsSection() {
  return (
    <section>
      <style>{`
        @keyframes anim-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes anim-slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes anim-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes anim-zoom-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .anim-fade-in  { animation: anim-fade-in  0.6s ease forwards; }
        .anim-slide-up { animation: anim-slide-up 0.6s ease forwards; }
        .anim-shake    { animation: anim-shake    0.5s ease; }
        .anim-zoom-in  { animation: anim-zoom-in  0.5s ease forwards; }
      `}</style>

      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">CSS Animations</h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Tailwind 4 ships four animation utilities. Custom effects use{' '}
        <code>@keyframes</code> + a class that sets the <code>animation</code> property.
      </p>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Tailwind Built-ins
      </h3>
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <AnimationCard label="Spin" codeLabel="animate-spin" testId="demo-spin">
          {key => (
            <div key={key} className="animate-spin text-3xl text-indigo-500">⟳</div>
          )}
        </AnimationCard>

        <AnimationCard label="Bounce" codeLabel="animate-bounce" testId="demo-bounce">
          {key => (
            <div key={key} className="animate-bounce h-6 w-6 rounded-full bg-pink-500" />
          )}
        </AnimationCard>

        <AnimationCard label="Pulse" codeLabel="animate-pulse" testId="demo-pulse">
          {key => (
            <div key={key} className="animate-pulse h-5 w-20 rounded bg-gray-300 dark:bg-gray-600" />
          )}
        </AnimationCard>

        <AnimationCard label="Ping" codeLabel="animate-ping" testId="demo-ping">
          {key => (
            <div key={key} className="relative flex h-5 w-5 items-center justify-center">
              <div className="animate-ping absolute h-full w-full rounded-full bg-sky-400 opacity-75" />
              <div className="relative h-3 w-3 rounded-full bg-sky-500" />
            </div>
          )}
        </AnimationCard>
      </div>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Custom @keyframes
      </h3>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <AnimationCard label="Fade In" codeLabel="anim-fade-in" testId="demo-fade-in">
          {key => (
            <span key={key} className="anim-fade-in text-lg font-semibold text-gray-800 dark:text-gray-200">
              Hello
            </span>
          )}
        </AnimationCard>

        <AnimationCard label="Slide Up" codeLabel="anim-slide-up" testId="demo-slide-up">
          {key => (
            <span key={key} className="anim-slide-up text-lg font-semibold text-gray-800 dark:text-gray-200">
              World
            </span>
          )}
        </AnimationCard>

        <AnimationCard label="Shake" codeLabel="anim-shake" testId="demo-shake">
          {key => (
            <span key={key} className="anim-shake text-lg font-semibold text-red-500">
              Error!
            </span>
          )}
        </AnimationCard>

        <AnimationCard label="Zoom In" codeLabel="anim-zoom-in" testId="demo-zoom-in">
          {key => (
            <span key={key} className="anim-zoom-in text-3xl">
              🎉
            </span>
          )}
        </AnimationCard>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/features/css-examples/components/__tests__/AnimationsSection.test.tsx
```

Expected: All 9 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/css-examples/components/AnimationsSection.tsx \
        src/features/css-examples/components/__tests__/AnimationsSection.test.tsx
git commit -m "feat(css-examples): add AnimationsSection with Tailwind built-ins and custom keyframes"
```

---

### Task 2: Storybook story

**Files:**
- Create: `src/features/css-examples/components/__stories__/AnimationsSection.stories.tsx`

Note: the `__stories__/` directory does not exist yet under `css-examples/components/` — you are creating it.

- [ ] **Step 1: Create the story file**

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnimationsSection } from '../AnimationsSection'

const meta: Meta<typeof AnimationsSection> = {
  component: AnimationsSection,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof AnimationsSection>

export const Default: Story = {}
```

- [ ] **Step 2: Verify lint passes**

```bash
npm run lint
```

Expected: no errors (import from `@storybook/react-vite`, not `@storybook/react`)

- [ ] **Step 3: Commit**

```bash
git add src/features/css-examples/components/__stories__/AnimationsSection.stories.tsx
git commit -m "feat(css-examples): add AnimationsSection Storybook story"
```

---

### Task 3: Wire into CssExamplesPage

**Files:**
- Modify: `src/features/css-examples/components/CssExamplesPage.tsx`
- Modify: `src/features/css-examples/components/__tests__/CssExamplesPage.test.tsx`

The existing `CssExamplesPage.test.tsx` has a test called `"renders all four section headings"` — this must be updated to reflect five sections.

- [ ] **Step 1: Update CssExamplesPage.tsx**

Replace the file with:

```tsx
import { VisualEffectsSection } from './VisualEffectsSection'
import { TransitionsSection } from './TransitionsSection'
import { FlexboxGridSection } from './FlexboxGridSection'
import { CustomPropertiesSection } from './CustomPropertiesSection'
import { AnimationsSection } from './AnimationsSection'

export default function CssExamplesPage() {
  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">CSS3 Examples</h1>
      <VisualEffectsSection />
      <TransitionsSection />
      <FlexboxGridSection />
      <CustomPropertiesSection />
      <AnimationsSection />
    </div>
  )
}
```

- [ ] **Step 2: Update CssExamplesPage.test.tsx**

The existing test file is at `src/features/css-examples/components/__tests__/CssExamplesPage.test.tsx`. It currently reads:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CssExamplesPage from '../CssExamplesPage'

describe('CssExamplesPage', () => {
  it('renders page heading', () => {
    render(<CssExamplesPage />)
    expect(screen.getByRole('heading', { name: /css3 examples/i })).toBeInTheDocument()
  })

  it('renders all four section headings', () => {
    render(<CssExamplesPage />)
    expect(screen.getByRole('heading', { name: /visual effects/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /transitions & animations/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /flexbox & grid/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /custom properties/i })).toBeInTheDocument()
  })
})
```

Replace it with:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CssExamplesPage from '../CssExamplesPage'

describe('CssExamplesPage', () => {
  it('renders page heading', () => {
    render(<CssExamplesPage />)
    expect(screen.getByRole('heading', { name: /css3 examples/i })).toBeInTheDocument()
  })

  it('renders all five section headings', () => {
    render(<CssExamplesPage />)
    expect(screen.getByRole('heading', { name: /visual effects/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /transitions & animations/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /flexbox & grid/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /custom properties/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /css animations/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run full test suite**

```bash
npm run test -- --run
```

Expected: all tests pass (257 + new AnimationsSection tests = 266 tests)

- [ ] **Step 4: Commit**

```bash
git add src/features/css-examples/components/CssExamplesPage.tsx \
        src/features/css-examples/components/__tests__/CssExamplesPage.test.tsx
git commit -m "feat(css-examples): wire AnimationsSection into CssExamplesPage"
```
