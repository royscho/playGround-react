# CSS Examples Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/css-examples` page showcasing four interactive CSS3 feature demos (visual effects, transitions/animations, flexbox/grid, custom properties).

**Architecture:** New `src/features/css-examples/` feature with one page component composing four section components. Each section uses a `<style>` tag with raw CSS3 to demonstrate actual syntax (not Tailwind). Page is lazy-loaded, protected behind auth, and linked from the Sidebar.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v4 (layout only), Vitest + Testing Library, React Router v6.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/features/css-examples/components/VisualEffectsSection.tsx` | Gradient, border-radius, box-shadow, filter demos |
| Create | `src/features/css-examples/components/TransitionsSection.tsx` | transition + @keyframes demos |
| Create | `src/features/css-examples/components/FlexboxGridSection.tsx` | Flexbox vs Grid side-by-side |
| Create | `src/features/css-examples/components/CustomPropertiesSection.tsx` | CSS vars + live theme toggle |
| Create | `src/features/css-examples/components/CssExamplesPage.tsx` | Page shell composing all 4 sections |
| Create | `src/features/css-examples/index.ts` | Public re-export |
| Create | `src/features/css-examples/components/__tests__/VisualEffectsSection.test.tsx` | Section render tests |
| Create | `src/features/css-examples/components/__tests__/TransitionsSection.test.tsx` | Section render tests |
| Create | `src/features/css-examples/components/__tests__/FlexboxGridSection.test.tsx` | Section render + count tests |
| Create | `src/features/css-examples/components/__tests__/CustomPropertiesSection.test.tsx` | Theme toggle interaction tests |
| Create | `src/features/css-examples/components/__tests__/CssExamplesPage.test.tsx` | Page integration render tests |
| Modify | `src/app/router.tsx` | Add lazy import + `/css-examples` route |
| Modify | `src/app/layout/Sidebar.tsx` | Add CSS Examples nav item |

---

## Task 1: VisualEffectsSection

**Files:**
- Create: `src/features/css-examples/components/__tests__/VisualEffectsSection.test.tsx`
- Create: `src/features/css-examples/components/VisualEffectsSection.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/features/css-examples/components/__tests__/VisualEffectsSection.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VisualEffectsSection } from '../VisualEffectsSection'

describe('VisualEffectsSection', () => {
  it('renders section heading', () => {
    render(<VisualEffectsSection />)
    expect(screen.getByRole('heading', { name: /visual effects/i })).toBeInTheDocument()
  })

  it('renders gradient demo', () => {
    render(<VisualEffectsSection />)
    expect(screen.getByTestId('gradient-demo')).toBeInTheDocument()
  })

  it('renders shadow demo', () => {
    render(<VisualEffectsSection />)
    expect(screen.getByTestId('shadow-demo')).toBeInTheDocument()
  })

  it('renders filter demo', () => {
    render(<VisualEffectsSection />)
    expect(screen.getByTestId('filter-demo')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run src/features/css-examples/components/__tests__/VisualEffectsSection.test.tsx
```

Expected: FAIL — `Cannot find module '../VisualEffectsSection'`

- [ ] **Step 3: Write implementation**

```tsx
// src/features/css-examples/components/VisualEffectsSection.tsx
export function VisualEffectsSection() {
  return (
    <section>
      <style>{`
        .ve-gradient {
          background: linear-gradient(135deg, #6366f1, #ec4899);
          padding: 32px 24px;
          border-radius: 12px;
          color: white;
          text-align: center;
        }
        .ve-radius {
          background: #3b82f6;
          border-radius: 9999px;
          padding: 10px 24px;
          color: white;
          display: inline-block;
        }
        .ve-shadow {
          background: white;
          border-radius: 8px;
          padding: 32px 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
          transition: box-shadow 0.3s ease;
          text-align: center;
        }
        .ve-shadow:hover {
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.24);
        }
        .ve-filter {
          background: #f59e0b;
          border-radius: 8px;
          padding: 32px 24px;
          filter: saturate(2) hue-rotate(20deg);
          text-align: center;
        }
      `}</style>

      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Visual Effects</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        gradient, border-radius, box-shadow, filter
      </p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="ve-gradient" data-testid="gradient-demo">
          <code className="text-xs">linear-gradient</code>
        </div>
        <div className="flex items-center justify-center p-4" data-testid="radius-demo">
          <span className="ve-radius">
            <code className="text-xs">border-radius: 9999px</code>
          </span>
        </div>
        <div className="ve-shadow" data-testid="shadow-demo">
          <code className="text-xs">box-shadow + :hover</code>
        </div>
        <div className="ve-filter" data-testid="filter-demo">
          <code className="text-xs">filter: saturate + hue-rotate</code>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx vitest run src/features/css-examples/components/__tests__/VisualEffectsSection.test.tsx
```

Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/css-examples/components/VisualEffectsSection.tsx \
        src/features/css-examples/components/__tests__/VisualEffectsSection.test.tsx
git commit -m "feat: add VisualEffectsSection with CSS3 demos"
```

---

## Task 2: TransitionsSection

**Files:**
- Create: `src/features/css-examples/components/__tests__/TransitionsSection.test.tsx`
- Create: `src/features/css-examples/components/TransitionsSection.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/features/css-examples/components/__tests__/TransitionsSection.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TransitionsSection } from '../TransitionsSection'

describe('TransitionsSection', () => {
  it('renders section heading', () => {
    render(<TransitionsSection />)
    expect(screen.getByRole('heading', { name: /transitions & animations/i })).toBeInTheDocument()
  })

  it('renders transition button', () => {
    render(<TransitionsSection />)
    expect(screen.getByTestId('transition-button')).toBeInTheDocument()
  })

  it('renders spinner demo', () => {
    render(<TransitionsSection />)
    expect(screen.getByTestId('spinner-demo')).toBeInTheDocument()
  })

  it('renders bouncer demo', () => {
    render(<TransitionsSection />)
    expect(screen.getByTestId('bouncer-demo')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run src/features/css-examples/components/__tests__/TransitionsSection.test.tsx
```

Expected: FAIL — `Cannot find module '../TransitionsSection'`

- [ ] **Step 3: Write implementation**

```tsx
// src/features/css-examples/components/TransitionsSection.tsx
export function TransitionsSection() {
  return (
    <section>
      <style>{`
        .tr-button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
          font-size: 14px;
        }
        .tr-button:hover {
          background: #1d4ed8;
          transform: scale(1.05);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .tr-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e5e7eb;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .tr-bouncer {
          width: 32px;
          height: 32px;
          background: #ec4899;
          border-radius: 50%;
          animation: bounce 0.8s ease-in-out infinite;
        }
      `}</style>

      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
        Transitions &amp; Animations
      </h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        transition, @keyframes, animation
      </p>

      <div className="flex flex-wrap items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <button className="tr-button" data-testid="transition-button">Hover me</button>
          <code className="text-xs text-gray-500">transition + :hover</code>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="tr-spinner" data-testid="spinner-demo" aria-label="spinner" />
          <code className="text-xs text-gray-500">@keyframes spin</code>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="tr-bouncer" data-testid="bouncer-demo" aria-label="bouncer" />
          <code className="text-xs text-gray-500">@keyframes bounce</code>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx vitest run src/features/css-examples/components/__tests__/TransitionsSection.test.tsx
```

Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/css-examples/components/TransitionsSection.tsx \
        src/features/css-examples/components/__tests__/TransitionsSection.test.tsx
git commit -m "feat: add TransitionsSection with keyframes demos"
```

---

## Task 3: FlexboxGridSection

**Files:**
- Create: `src/features/css-examples/components/__tests__/FlexboxGridSection.test.tsx`
- Create: `src/features/css-examples/components/FlexboxGridSection.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/features/css-examples/components/__tests__/FlexboxGridSection.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FlexboxGridSection } from '../FlexboxGridSection'

describe('FlexboxGridSection', () => {
  it('renders section heading', () => {
    render(<FlexboxGridSection />)
    expect(screen.getByRole('heading', { name: /flexbox & grid/i })).toBeInTheDocument()
  })

  it('renders flex container', () => {
    render(<FlexboxGridSection />)
    expect(screen.getByTestId('flex-container')).toBeInTheDocument()
  })

  it('renders grid container', () => {
    render(<FlexboxGridSection />)
    expect(screen.getByTestId('grid-container')).toBeInTheDocument()
  })

  it('renders 6 boxes in each container', () => {
    render(<FlexboxGridSection />)
    const flexItems = screen.getByTestId('flex-container').querySelectorAll('.fg-box')
    const gridItems = screen.getByTestId('grid-container').querySelectorAll('.fg-box')
    expect(flexItems).toHaveLength(6)
    expect(gridItems).toHaveLength(6)
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run src/features/css-examples/components/__tests__/FlexboxGridSection.test.tsx
```

Expected: FAIL — `Cannot find module '../FlexboxGridSection'`

- [ ] **Step 3: Write implementation**

```tsx
// src/features/css-examples/components/FlexboxGridSection.tsx
const boxes = ['1', '2', '3', '4', '5', '6']

export function FlexboxGridSection() {
  return (
    <section>
      <style>{`
        .fg-box {
          background: #6366f1;
          color: white;
          padding: 12px;
          border-radius: 4px;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
        }
        .fg-flex-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px dashed #d1d5db;
        }
        .fg-grid-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px dashed #d1d5db;
        }
        .fg-grid-container .fg-box {
          background: #8b5cf6;
        }
      `}</style>

      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Flexbox &amp; Grid</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        display: flex vs display: grid
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <code>display: flex; flex-wrap: wrap</code>
          </p>
          <div className="fg-flex-container" data-testid="flex-container">
            {boxes.map((n) => (
              <div key={n} className="fg-box">{n}</div>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <code>display: grid; grid-template-columns: repeat(3, 1fr)</code>
          </p>
          <div className="fg-grid-container" data-testid="grid-container">
            {boxes.map((n) => (
              <div key={n} className="fg-box">{n}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx vitest run src/features/css-examples/components/__tests__/FlexboxGridSection.test.tsx
```

Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/css-examples/components/FlexboxGridSection.tsx \
        src/features/css-examples/components/__tests__/FlexboxGridSection.test.tsx
git commit -m "feat: add FlexboxGridSection with side-by-side layout demo"
```

---

## Task 4: CustomPropertiesSection

**Files:**
- Create: `src/features/css-examples/components/__tests__/CustomPropertiesSection.test.tsx`
- Create: `src/features/css-examples/components/CustomPropertiesSection.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/features/css-examples/components/__tests__/CustomPropertiesSection.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CustomPropertiesSection } from '../CustomPropertiesSection'

describe('CustomPropertiesSection', () => {
  it('renders section heading', () => {
    render(<CustomPropertiesSection />)
    expect(screen.getByRole('heading', { name: /custom properties/i })).toBeInTheDocument()
  })

  it('renders theme preview with default ocean theme', () => {
    render(<CustomPropertiesSection />)
    expect(screen.getByTestId('theme-preview')).toHaveAttribute('data-theme', 'ocean')
  })

  it('toggles to forest theme on button click', async () => {
    render(<CustomPropertiesSection />)
    await userEvent.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('theme-preview')).toHaveAttribute('data-theme', 'forest')
  })

  it('toggles back to ocean on second click', async () => {
    render(<CustomPropertiesSection />)
    await userEvent.click(screen.getByTestId('theme-toggle'))
    await userEvent.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('theme-preview')).toHaveAttribute('data-theme', 'ocean')
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run src/features/css-examples/components/__tests__/CustomPropertiesSection.test.tsx
```

Expected: FAIL — `Cannot find module '../CustomPropertiesSection'`

- [ ] **Step 3: Write implementation**

```tsx
// src/features/css-examples/components/CustomPropertiesSection.tsx
import { useState } from 'react'
import type { CSSProperties } from 'react'

const themes = {
  ocean: {
    '--cp-primary': '#0ea5e9',
    '--cp-bg': '#f0f9ff',
    '--cp-text': '#0c4a6e',
    '--cp-card': '#e0f2fe',
  },
  forest: {
    '--cp-primary': '#16a34a',
    '--cp-bg': '#f0fdf4',
    '--cp-text': '#14532d',
    '--cp-card': '#dcfce7',
  },
} as const

type Theme = keyof typeof themes

export function CustomPropertiesSection() {
  const [theme, setTheme] = useState<Theme>('ocean')
  const other: Theme = theme === 'ocean' ? 'forest' : 'ocean'

  return (
    <section>
      <style>{`
        .cp-card {
          background: var(--cp-card);
          border-radius: 12px;
          padding: 24px;
        }
        .cp-heading {
          color: var(--cp-primary);
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .cp-body {
          color: var(--cp-text);
          font-size: 14px;
          line-height: 1.6;
        }
        .cp-button {
          margin-top: 16px;
          background: var(--cp-primary);
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }
        .cp-vars {
          margin-top: 12px;
          font-family: monospace;
          font-size: 12px;
        }
      `}</style>

      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Custom Properties</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        CSS variables (--property) with live theme switching
      </p>

      <div
        data-testid="theme-preview"
        data-theme={theme}
        style={{ ...(themes[theme] as CSSProperties), background: 'var(--cp-bg)', padding: '24px', borderRadius: '12px' }}
      >
        <div className="cp-card">
          <p className="cp-heading">Theme: {theme}</p>
          <p className="cp-body">
            All colors come from CSS custom properties. Switching the theme updates the variables —
            no class changes on child elements needed.
          </p>
          <button
            className="cp-button"
            onClick={() => setTheme(other)}
            data-testid="theme-toggle"
          >
            Switch to {other}
          </button>
        </div>
        <div className="cp-vars" style={{ color: 'var(--cp-text)' }}>
          {Object.entries(themes[theme]).map(([k, v]) => (
            <p key={k}>{k}: {v}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx vitest run src/features/css-examples/components/__tests__/CustomPropertiesSection.test.tsx
```

Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/css-examples/components/CustomPropertiesSection.tsx \
        src/features/css-examples/components/__tests__/CustomPropertiesSection.test.tsx
git commit -m "feat: add CustomPropertiesSection with live theme toggle"
```

---

## Task 5: CssExamplesPage

**Files:**
- Create: `src/features/css-examples/components/__tests__/CssExamplesPage.test.tsx`
- Create: `src/features/css-examples/components/CssExamplesPage.tsx`
- Create: `src/features/css-examples/index.ts`

- [ ] **Step 1: Write failing test**

```tsx
// src/features/css-examples/components/__tests__/CssExamplesPage.test.tsx
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

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run src/features/css-examples/components/__tests__/CssExamplesPage.test.tsx
```

Expected: FAIL — `Cannot find module '../CssExamplesPage'`

- [ ] **Step 3: Write CssExamplesPage**

```tsx
// src/features/css-examples/components/CssExamplesPage.tsx
import { VisualEffectsSection } from './VisualEffectsSection'
import { TransitionsSection } from './TransitionsSection'
import { FlexboxGridSection } from './FlexboxGridSection'
import { CustomPropertiesSection } from './CustomPropertiesSection'

export default function CssExamplesPage() {
  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">CSS3 Examples</h1>
      <VisualEffectsSection />
      <TransitionsSection />
      <FlexboxGridSection />
      <CustomPropertiesSection />
    </div>
  )
}
```

- [ ] **Step 4: Write index.ts**

```ts
// src/features/css-examples/index.ts
export { default as CssExamplesPage } from './components/CssExamplesPage'
```

- [ ] **Step 5: Run test — verify it passes**

```bash
npx vitest run src/features/css-examples/components/__tests__/CssExamplesPage.test.tsx
```

Expected: PASS (2 tests)

- [ ] **Step 6: Commit**

```bash
git add src/features/css-examples/components/CssExamplesPage.tsx \
        src/features/css-examples/components/__tests__/CssExamplesPage.test.tsx \
        src/features/css-examples/index.ts
git commit -m "feat: add CssExamplesPage composing all CSS3 sections"
```

---

## Task 6: Wire Router + Sidebar

**Files:**
- Modify: `src/app/router.tsx`
- Modify: `src/app/layout/Sidebar.tsx`

- [ ] **Step 1: Add lazy import to router**

In `src/app/router.tsx`, add this line after the existing lazy imports (after line importing `SettingsPage`):

```tsx
const CssExamplesPage = lazy(() => import('../features/css-examples/components/CssExamplesPage'))
```

- [ ] **Step 2: Add route to router**

In `src/app/router.tsx`, inside the `<Route element={<AppLayout />}>` block, add after the `/settings` route:

```tsx
<Route
  path="/css-examples"
  element={
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <CssExamplesPage />
      </Suspense>
    </ErrorBoundary>
  }
/>
```

- [ ] **Step 3: Add nav item to Sidebar**

In `src/app/layout/Sidebar.tsx`, add to the `navItems` array (after the Settings entry):

```tsx
{ to: '/css-examples', label: 'CSS Examples', icon: '🎨' },
```

- [ ] **Step 4: Run all CSS examples tests**

```bash
npx vitest run src/features/css-examples
```

Expected: PASS (all 14 tests across 5 test files)

- [ ] **Step 5: Run full test suite**

```bash
npx vitest run
```

Expected: all tests pass (no regressions)

- [ ] **Step 6: Commit**

```bash
git add src/app/router.tsx src/app/layout/Sidebar.tsx
git commit -m "feat: wire /css-examples route and sidebar nav link"
```
