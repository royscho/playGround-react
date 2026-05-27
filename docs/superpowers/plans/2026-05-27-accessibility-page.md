# Accessibility Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an `/accessibility` page with two interactive sections: an accessible modal dialog built from scratch and an accessible form with full ARIA error handling.

**Architecture:** `useFocusTrap` hook owns focus management logic and is used by `AccessibleModalSection`. `AccessibleFormSection` manages its own form state and ARIA attributes. Both compose into `AccessibilityPage` with no shared state.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v4, Vitest + Testing Library + userEvent.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/features/accessibility/hooks/useFocusTrap.ts` | Focus trap logic: Tab/Shift+Tab cycle within container |
| Create | `src/features/accessibility/components/AccessibleModalSection.tsx` | ARIA dialog + focus trap demo |
| Create | `src/features/accessibility/components/AccessibleFormSection.tsx` | ARIA form + live region demo |
| Create | `src/features/accessibility/components/AccessibilityPage.tsx` | Page shell |
| Create | `src/features/accessibility/index.ts` | Public re-export |
| Create | `src/features/accessibility/hooks/__tests__/useFocusTrap.test.tsx` | Focus trap unit tests |
| Create | `src/features/accessibility/components/__tests__/AccessibleModalSection.test.tsx` | Modal ARIA + keyboard tests |
| Create | `src/features/accessibility/components/__tests__/AccessibleFormSection.test.tsx` | Form ARIA + validation tests |
| Create | `src/features/accessibility/components/__tests__/AccessibilityPage.test.tsx` | Page integration tests |
| Modify | `src/app/router.tsx` | Add lazy import + `/accessibility` route |
| Modify | `src/app/layout/Sidebar.tsx` | Add `♿ Accessibility` nav item |

---

## Task 1: useFocusTrap hook

**Files:**
- Create: `src/features/accessibility/hooks/__tests__/useFocusTrap.test.tsx`
- Create: `src/features/accessibility/hooks/useFocusTrap.ts`

- [ ] **Step 1: Write failing tests**

```tsx
// src/features/accessibility/hooks/__tests__/useFocusTrap.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useRef } from 'react'
import { useFocusTrap } from '../useFocusTrap'

function TestTrap({ isOpen }: { isOpen: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, isOpen)
  return (
    <div ref={ref}>
      <button data-testid="btn-1">First</button>
      <button data-testid="btn-2">Second</button>
      <button data-testid="btn-3">Last</button>
    </div>
  )
}

describe('useFocusTrap', () => {
  it('focuses first element when isOpen becomes true', () => {
    render(<TestTrap isOpen={true} />)
    expect(screen.getByTestId('btn-1')).toHaveFocus()
  })

  it('does not steal focus when isOpen is false', () => {
    render(<TestTrap isOpen={false} />)
    expect(screen.getByTestId('btn-1')).not.toHaveFocus()
  })

  it('Tab from last element wraps to first', () => {
    render(<TestTrap isOpen={true} />)
    screen.getByTestId('btn-3').focus()
    fireEvent.keyDown(screen.getByTestId('btn-3').parentElement!, { key: 'Tab', shiftKey: false })
    expect(screen.getByTestId('btn-1')).toHaveFocus()
  })

  it('Shift+Tab from first element wraps to last', () => {
    render(<TestTrap isOpen={true} />)
    screen.getByTestId('btn-1').focus()
    fireEvent.keyDown(screen.getByTestId('btn-1').parentElement!, { key: 'Tab', shiftKey: true })
    expect(screen.getByTestId('btn-3')).toHaveFocus()
  })

  it('non-Tab keys are ignored', () => {
    render(<TestTrap isOpen={true} />)
    screen.getByTestId('btn-1').focus()
    fireEvent.keyDown(screen.getByTestId('btn-1').parentElement!, { key: 'Escape' })
    expect(screen.getByTestId('btn-1')).toHaveFocus()
  })
})
```

- [ ] **Step 2: Run — verify FAIL**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run src/features/accessibility/hooks/__tests__/useFocusTrap.test.tsx
```

Expected: FAIL — `Cannot find module '../useFocusTrap'`

- [ ] **Step 3: Write implementation**

```ts
// src/features/accessibility/hooks/useFocusTrap.ts
import { useEffect } from 'react'

const FOCUSABLE = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  isOpen: boolean
): void {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return

    const container = containerRef.current
    const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))

    if (focusable.length > 0) focusable[0].focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, containerRef])
}
```

- [ ] **Step 4: Run — verify PASS**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run src/features/accessibility/hooks/__tests__/useFocusTrap.test.tsx
```

Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/accessibility/hooks/useFocusTrap.ts \
        src/features/accessibility/hooks/__tests__/useFocusTrap.test.tsx
git commit -m "feat: add useFocusTrap hook for ARIA dialog focus management"
```

---

## Task 2: AccessibleModalSection

**Files:**
- Create: `src/features/accessibility/components/__tests__/AccessibleModalSection.test.tsx`
- Create: `src/features/accessibility/components/AccessibleModalSection.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// src/features/accessibility/components/__tests__/AccessibleModalSection.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AccessibleModalSection } from '../AccessibleModalSection'

describe('AccessibleModalSection', () => {
  it('renders trigger button', () => {
    render(<AccessibleModalSection />)
    expect(screen.getByTestId('modal-trigger')).toBeInTheDocument()
  })

  it('modal is not rendered initially', () => {
    render(<AccessibleModalSection />)
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('opens modal on trigger click', async () => {
    render(<AccessibleModalSection />)
    await userEvent.click(screen.getByTestId('modal-trigger'))
    expect(screen.getByTestId('modal')).toBeInTheDocument()
  })

  it('modal has role="dialog"', async () => {
    render(<AccessibleModalSection />)
    await userEvent.click(screen.getByTestId('modal-trigger'))
    expect(screen.getByTestId('modal')).toHaveAttribute('role', 'dialog')
  })

  it('modal has aria-modal="true"', async () => {
    render(<AccessibleModalSection />)
    await userEvent.click(screen.getByTestId('modal-trigger'))
    expect(screen.getByTestId('modal')).toHaveAttribute('aria-modal', 'true')
  })

  it('modal has aria-labelledby pointing to title id', async () => {
    render(<AccessibleModalSection />)
    await userEvent.click(screen.getByTestId('modal-trigger'))
    expect(screen.getByTestId('modal')).toHaveAttribute('aria-labelledby', 'modal-title')
    expect(document.getElementById('modal-title')).toBeInTheDocument()
  })

  it('Escape key closes modal', async () => {
    render(<AccessibleModalSection />)
    await userEvent.click(screen.getByTestId('modal-trigger'))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('Cancel button closes modal', async () => {
    render(<AccessibleModalSection />)
    await userEvent.click(screen.getByTestId('modal-trigger'))
    await userEvent.click(screen.getByTestId('modal-cancel'))
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — verify FAIL**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run src/features/accessibility/components/__tests__/AccessibleModalSection.test.tsx
```

Expected: FAIL — `Cannot find module '../AccessibleModalSection'`

- [ ] **Step 3: Write implementation**

```tsx
// src/features/accessibility/components/AccessibleModalSection.tsx
import { useState, useRef, useEffect } from 'react'
import { useFocusTrap } from '../hooks/useFocusTrap'

export function AccessibleModalSection() {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useFocusTrap(modalRef, isOpen)

  // Return focus to trigger on close
  useEffect(() => {
    if (!isOpen) triggerRef.current?.focus()
  }, [isOpen])

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) setIsOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen])

  return (
    <section data-testid="modal-section">
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Accessible Modal</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Built from scratch: <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">role="dialog"</code>,{' '}
        focus trap, keyboard navigation, and focus restoration.
      </p>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        data-testid="modal-trigger"
      >
        Open Dialog
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800"
            data-testid="modal"
          >
            <h2
              id="modal-title"
              className="mb-3 text-lg font-semibold text-gray-900 dark:text-white"
            >
              Confirm Action
            </h2>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
              This dialog demonstrates full accessibility: ARIA roles, focus trap (Tab cycles
              within modal only), and keyboard navigation.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                data-testid="modal-cancel"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                data-testid="modal-confirm"
              >
                Confirm
              </button>
            </div>
          </div>
        </>
      )}

      <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
        <strong>Screen reader hears:</strong> "Confirm Action, dialog" → reads description.
        Tab cycles only within modal. Escape closes and returns focus to the trigger button.
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run — verify PASS**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run src/features/accessibility/components/__tests__/AccessibleModalSection.test.tsx
```

Expected: PASS (8 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/accessibility/components/AccessibleModalSection.tsx \
        src/features/accessibility/components/__tests__/AccessibleModalSection.test.tsx
git commit -m "feat: add AccessibleModalSection with focus trap and ARIA dialog"
```

---

## Task 3: AccessibleFormSection

**Files:**
- Create: `src/features/accessibility/components/__tests__/AccessibleFormSection.test.tsx`
- Create: `src/features/accessibility/components/AccessibleFormSection.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// src/features/accessibility/components/__tests__/AccessibleFormSection.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AccessibleFormSection } from '../AccessibleFormSection'

describe('AccessibleFormSection', () => {
  it('renders form section', () => {
    render(<AccessibleFormSection />)
    expect(screen.getByTestId('a11y-form')).toBeInTheDocument()
  })

  it('name field has aria-required="true"', () => {
    render(<AccessibleFormSection />)
    expect(screen.getByTestId('field-name')).toHaveAttribute('aria-required', 'true')
  })

  it('email field has aria-required="true"', () => {
    render(<AccessibleFormSection />)
    expect(screen.getByTestId('field-email')).toHaveAttribute('aria-required', 'true')
  })

  it('empty submit shows name error with role="alert"', async () => {
    render(<AccessibleFormSection />)
    await userEvent.click(screen.getByTestId('submit-button'))
    expect(screen.getByTestId('error-name')).toBeInTheDocument()
    expect(screen.getByTestId('error-name')).toHaveAttribute('role', 'alert')
  })

  it('invalid field gets aria-invalid="true"', async () => {
    render(<AccessibleFormSection />)
    await userEvent.click(screen.getByTestId('submit-button'))
    expect(screen.getByTestId('field-name')).toHaveAttribute('aria-invalid', 'true')
  })

  it('field gets aria-describedby linking to error id', async () => {
    render(<AccessibleFormSection />)
    await userEvent.click(screen.getByTestId('submit-button'))
    expect(screen.getByTestId('field-name')).toHaveAttribute('aria-describedby', 'error-name')
  })

  it('live region announces error count on failed submit', async () => {
    render(<AccessibleFormSection />)
    await userEvent.click(screen.getByTestId('submit-button'))
    expect(screen.getByTestId('form-live-region')).toHaveTextContent(/2 errors/)
  })

  it('invalid email shows email error', async () => {
    render(<AccessibleFormSection />)
    await userEvent.type(screen.getByTestId('field-name'), 'Roy')
    await userEvent.type(screen.getByTestId('field-email'), 'notanemail')
    await userEvent.click(screen.getByTestId('submit-button'))
    expect(screen.getByTestId('error-email')).toHaveTextContent(/valid/)
  })

  it('valid submit shows success message', async () => {
    render(<AccessibleFormSection />)
    await userEvent.type(screen.getByTestId('field-name'), 'Roy')
    await userEvent.type(screen.getByTestId('field-email'), 'roy@example.com')
    await userEvent.click(screen.getByTestId('submit-button'))
    expect(screen.getByText(/Message sent/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — verify FAIL**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run src/features/accessibility/components/__tests__/AccessibleFormSection.test.tsx
```

Expected: FAIL — `Cannot find module '../AccessibleFormSection'`

- [ ] **Step 3: Write implementation**

```tsx
// src/features/accessibility/components/AccessibleFormSection.tsx
import { useState } from 'react'

interface FormValues {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
}

export function AccessibleFormSection() {
  const [values, setValues] = useState<FormValues>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [liveMessage, setLiveMessage] = useState('')

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!values.name.trim()) e.name = 'Name is required'
    if (!values.email.trim()) e.email = 'Email is required'
    else if (!values.email.includes('@')) e.email = 'Email must be a valid address'
    return e
  }

  const handleChange = (field: keyof FormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)

    const count = Object.keys(newErrors).length
    if (count > 0) {
      setLiveMessage(`Form has ${count} error${count > 1 ? 's' : ''}`)
      if (newErrors.name) document.getElementById('field-name')?.focus()
      else if (newErrors.email) document.getElementById('field-email')?.focus()
      return
    }

    setSubmitted(true)
    setLiveMessage('Message sent!')
  }

  if (submitted) {
    return (
      <section data-testid="a11y-form">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Accessible Form</h2>
        <div
          role="status"
          aria-live="polite"
          className="rounded-lg bg-green-100 p-4 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400"
        >
          Message sent! ✓
        </div>
      </section>
    )
  }

  return (
    <section data-testid="a11y-form">
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Accessible Form</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Full ARIA error handling: <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">aria-invalid</code>,{' '}
        <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">aria-describedby</code>,{' '}
        <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">role="alert"</code>, and a live region.
      </p>

      {/* Live region — screen reader announces changes politely */}
      <div
        role="status"
        aria-live="polite"
        className="sr-only"
        data-testid="form-live-region"
      >
        {liveMessage}
      </div>

      <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="field-name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Name <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            id="field-name"
            type="text"
            value={values.name}
            onChange={handleChange('name')}
            aria-required="true"
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? 'error-name' : undefined}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            data-testid="field-name"
          />
          {errors.name && (
            <p
              id="error-name"
              role="alert"
              className="mt-1 text-xs text-red-600 dark:text-red-400"
              data-testid="error-name"
            >
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="field-email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            id="field-email"
            type="email"
            value={values.email}
            onChange={handleChange('email')}
            aria-required="true"
            aria-invalid={errors.email ? 'true' : undefined}
            aria-describedby={errors.email ? 'error-email' : undefined}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            data-testid="field-email"
          />
          {errors.email && (
            <p
              id="error-email"
              role="alert"
              className="mt-1 text-xs text-red-600 dark:text-red-400"
              data-testid="error-email"
            >
              {errors.email}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="field-message"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Message
          </label>
          <textarea
            id="field-message"
            value={values.message}
            onChange={handleChange('message')}
            rows={3}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            data-testid="field-message"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          data-testid="submit-button"
        >
          Send Message
        </button>
      </form>

      <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
        <strong>Screen reader hears on error:</strong> <code>role="alert"</code> fires immediately.
        Field announces label + error via <code>aria-describedby</code>.
        Live region announces total error count politely after current speech.
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run — verify PASS**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run src/features/accessibility/components/__tests__/AccessibleFormSection.test.tsx
```

Expected: PASS (9 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/accessibility/components/AccessibleFormSection.tsx \
        src/features/accessibility/components/__tests__/AccessibleFormSection.test.tsx
git commit -m "feat: add AccessibleFormSection with ARIA validation and live regions"
```

---

## Task 4: AccessibilityPage + index.ts

**Files:**
- Create: `src/features/accessibility/components/__tests__/AccessibilityPage.test.tsx`
- Create: `src/features/accessibility/components/AccessibilityPage.tsx`
- Create: `src/features/accessibility/index.ts`

- [ ] **Step 1: Write failing tests**

```tsx
// src/features/accessibility/components/__tests__/AccessibilityPage.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AccessibilityPage from '../AccessibilityPage'

describe('AccessibilityPage', () => {
  it('renders page heading', () => {
    render(<AccessibilityPage />)
    expect(screen.getByRole('heading', { name: /accessibility/i, level: 1 })).toBeInTheDocument()
  })

  it('renders modal section', () => {
    render(<AccessibilityPage />)
    expect(screen.getByTestId('modal-section')).toBeInTheDocument()
  })

  it('renders form section', () => {
    render(<AccessibilityPage />)
    expect(screen.getByTestId('a11y-form')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — verify FAIL**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run src/features/accessibility/components/__tests__/AccessibilityPage.test.tsx
```

Expected: FAIL — `Cannot find module '../AccessibilityPage'`

- [ ] **Step 3: Write AccessibilityPage**

```tsx
// src/features/accessibility/components/AccessibilityPage.tsx
import { AccessibleModalSection } from './AccessibleModalSection'
import { AccessibleFormSection } from './AccessibleFormSection'

export default function AccessibilityPage() {
  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Accessibility</h1>
      <AccessibleModalSection />
      <AccessibleFormSection />
    </div>
  )
}
```

- [ ] **Step 4: Write index.ts**

```ts
// src/features/accessibility/index.ts
export { default as AccessibilityPage } from './components/AccessibilityPage'
```

- [ ] **Step 5: Run all accessibility tests**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run src/features/accessibility
```

Expected: all pass (25 tests across 4 files)

- [ ] **Step 6: Commit**

```bash
git add src/features/accessibility/components/AccessibilityPage.tsx \
        src/features/accessibility/components/__tests__/AccessibilityPage.test.tsx \
        src/features/accessibility/index.ts
git commit -m "feat: add AccessibilityPage composing modal and form demos"
```

---

## Task 5: Wire router + sidebar

**Files:**
- Modify: `src/app/router.tsx`
- Modify: `src/app/layout/Sidebar.tsx`

- [ ] **Step 1: Add lazy import to router**

In `src/app/router.tsx`, after the `PerformancePage` lazy import, add:

```tsx
const AccessibilityPage = lazy(() => import('../features/accessibility/components/AccessibilityPage'))
```

- [ ] **Step 2: Add route inside protected block**

In `src/app/router.tsx`, inside `<Route element={<AppLayout />}>`, after the `/performance` route, add:

```tsx
<Route
  path="/accessibility"
  element={
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <AccessibilityPage />
      </Suspense>
    </ErrorBoundary>
  }
/>
```

- [ ] **Step 3: Add sidebar nav item**

In `src/app/layout/Sidebar.tsx`, add to `navItems` after the Performance entry:

```tsx
{ to: '/accessibility', label: 'Accessibility', icon: '♿' },
```

- [ ] **Step 4: Run full test suite**

```bash
cd /Users/roys/repos/playGround-react && npx vitest run
```

Expected: all tests pass, no regressions

- [ ] **Step 5: Commit**

```bash
git add src/app/router.tsx src/app/layout/Sidebar.tsx
git commit -m "feat: wire /accessibility route and sidebar nav link"
```
