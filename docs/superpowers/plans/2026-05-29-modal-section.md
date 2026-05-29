# Modal Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `ModalSection` to the React Demos page with three interactive modal variants (info, confirm, form) using the existing shared `Modal` component.

**Architecture:** Self-contained `ModalSection` component dropped into `ReactDemosPage`. Single `useState<'info' | 'confirm' | 'form' | null>` controls which modal is open. Side-by-side grid: live demo buttons left, code snippet right — matches `CompoundComponentsSection` pattern.

**Tech Stack:** React `useState`, existing `Modal` + `Button` shared components, Tailwind 4, Vitest + Testing Library, Storybook (import from `@storybook/react-vite`).

---

## File Map

| File | Action |
|------|--------|
| `src/shared/components/Modal.tsx` | Modify — add `data-testid="modal-backdrop"` to backdrop div |
| `src/features/react-demos/components/ModalSection.tsx` | Create |
| `src/features/react-demos/components/__tests__/ModalSection.test.tsx` | Create |
| `src/features/react-demos/components/__stories__/ModalSection.stories.tsx` | Create |
| `src/features/react-demos/components/ReactDemosPage.tsx` | Modify — add `<ModalSection />` |

---

### Task 1: Add backdrop testid to shared Modal

**Files:**
- Modify: `src/shared/components/Modal.tsx`

The shared `Modal` has a backdrop div without a testid, making backdrop-click tests fragile. Add `data-testid="modal-backdrop"` so tests can target it cleanly.

- [ ] **Step 1: Edit Modal.tsx backdrop div**

In `src/shared/components/Modal.tsx`, change line 24 from:

```tsx
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
```

To:

```tsx
      <div data-testid="modal-backdrop" className="absolute inset-0 bg-black/50" onClick={onClose} />
```

- [ ] **Step 2: Verify existing Modal tests still pass**

```bash
npx vitest run src/shared/components/__tests__/Modal.test.tsx
```

Expected: 3 tests PASS

- [ ] **Step 3: Commit**

```bash
git add src/shared/components/Modal.tsx
git commit -m "fix(modal): add data-testid to backdrop for testability"
```

---

### Task 2: ModalSection component (TDD)

**Files:**
- Create: `src/features/react-demos/components/__tests__/ModalSection.test.tsx`
- Create: `src/features/react-demos/components/ModalSection.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/features/react-demos/components/__tests__/ModalSection.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ModalSection } from '../ModalSection'

describe('ModalSection', () => {
  it('renders section heading', () => {
    render(<ModalSection />)
    expect(screen.getByRole('heading', { name: /modal/i })).toBeInTheDocument()
  })

  it('no modal visible on initial render', () => {
    render(<ModalSection />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('What is a Modal?')).not.toBeInTheDocument()
    expect(screen.queryByText('Delete Item')).not.toBeInTheDocument()
    expect(screen.queryByText('Edit Name')).not.toBeInTheDocument()
  })

  it('clicking Open Info Modal shows info modal', async () => {
    render(<ModalSection />)
    await userEvent.click(screen.getByRole('button', { name: /open info modal/i }))
    expect(screen.getByText('What is a Modal?')).toBeInTheDocument()
  })

  it('clicking Open Confirm Modal shows confirm modal', async () => {
    render(<ModalSection />)
    await userEvent.click(screen.getByRole('button', { name: /open confirm modal/i }))
    expect(screen.getByText('Delete Item')).toBeInTheDocument()
    expect(screen.getByText(/cannot be undone/i)).toBeInTheDocument()
  })

  it('clicking Open Form Modal shows form modal', async () => {
    render(<ModalSection />)
    await userEvent.click(screen.getByRole('button', { name: /open form modal/i }))
    expect(screen.getByText('Edit Name')).toBeInTheDocument()
    expect(screen.getByTestId('form-modal-input')).toBeInTheDocument()
  })

  it('close button on info modal hides it', async () => {
    render(<ModalSection />)
    await userEvent.click(screen.getByRole('button', { name: /open info modal/i }))
    await userEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(screen.queryByText('What is a Modal?')).not.toBeInTheDocument()
  })

  it('Escape key closes open modal', async () => {
    render(<ModalSection />)
    await userEvent.click(screen.getByRole('button', { name: /open info modal/i }))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByText('What is a Modal?')).not.toBeInTheDocument()
  })

  it('Cancel button on confirm modal closes it', async () => {
    render(<ModalSection />)
    await userEvent.click(screen.getByRole('button', { name: /open confirm modal/i }))
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(screen.queryByText('Delete Item')).not.toBeInTheDocument()
  })

  it('form modal input is empty when opened', async () => {
    render(<ModalSection />)
    await userEvent.click(screen.getByRole('button', { name: /open form modal/i }))
    expect(screen.getByTestId('form-modal-input')).toHaveValue('')
  })

  it('clicking backdrop closes modal', async () => {
    render(<ModalSection />)
    await userEvent.click(screen.getByRole('button', { name: /open info modal/i }))
    await userEvent.click(screen.getByTestId('modal-backdrop'))
    expect(screen.queryByText('What is a Modal?')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/features/react-demos/components/__tests__/ModalSection.test.tsx
```

Expected: FAIL — `Cannot find module '../ModalSection'`

- [ ] **Step 3: Implement ModalSection.tsx**

Create `src/features/react-demos/components/ModalSection.tsx`:

```tsx
import { useState } from 'react'
import { Modal } from '../../../shared/components/Modal'
import { Button } from '../../../shared/components/Button'

type ModalType = 'info' | 'confirm' | 'form' | null

const CODE = `const [open, setOpen] = useState<ModalType>(null)

<Button onClick={() => setOpen('info')}>
  Open Info Modal
</Button>

<Modal
  isOpen={open === 'info'}
  onClose={() => setOpen(null)}
  title="What is a Modal?"
>
  {/* content */}
</Modal>`

export function ModalSection() {
  const [open, setOpen] = useState<ModalType>(null)
  const [name, setName] = useState('')

  const close = () => setOpen(null)

  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Modal</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Controlled visibility via <code>useState</code>. The shared <code>Modal</code> handles
        Escape key and backdrop click. Three variants: info, confirm, and form.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div data-testid="modal-demos">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Live demo</p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => setOpen('info')}>Open Info Modal</Button>
            <Button onClick={() => setOpen('confirm')}>Open Confirm Modal</Button>
            <Button onClick={() => { setName(''); setOpen('form') }}>Open Form Modal</Button>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">How it works</p>
          <pre className="overflow-auto rounded-lg bg-gray-900 p-4 text-xs text-green-400 dark:bg-gray-950">
            <code>{CODE}</code>
          </pre>
        </div>
      </div>

      <Modal isOpen={open === 'info'} onClose={close} title="What is a Modal?">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          A modal is a dialog that overlays the page and requires the user to interact with it
          before returning to the main content.
        </p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          It uses a fixed backdrop, Escape key, and a close button for dismissal.
        </p>
        <div className="mt-4 flex justify-end">
          <Button onClick={close}>Close</Button>
        </div>
      </Modal>

      <Modal isOpen={open === 'confirm'} onClose={close} title="Delete Item">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Are you sure you want to delete this item? This cannot be undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={close}>Cancel</Button>
          <Button variant="danger" onClick={close}>Delete</Button>
        </div>
      </Modal>

      <Modal isOpen={open === 'form'} onClose={close} title="Edit Name">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Name
          <input
            data-testid="form-modal-input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </label>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={close}>Cancel</Button>
          <Button onClick={close}>Save</Button>
        </div>
      </Modal>
    </section>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/features/react-demos/components/__tests__/ModalSection.test.tsx
```

Expected: All 9 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/react-demos/components/ModalSection.tsx \
        src/features/react-demos/components/__tests__/ModalSection.test.tsx
git commit -m "feat(react-demos): add ModalSection with info, confirm, and form variants"
```

---

### Task 3: Storybook story

**Files:**
- Create: `src/features/react-demos/components/__stories__/ModalSection.stories.tsx`

- [ ] **Step 1: Create the story file**

Create `src/features/react-demos/components/__stories__/ModalSection.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ModalSection } from '../ModalSection'

const meta: Meta<typeof ModalSection> = {
  component: ModalSection,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ModalSection>

export const Default: Story = {}
```

- [ ] **Step 2: Verify lint passes (catches wrong Storybook import)**

```bash
npm run lint
```

Expected: no errors (import is from `@storybook/react-vite`, not `@storybook/react`)

- [ ] **Step 3: Commit**

```bash
git add src/features/react-demos/components/__stories__/ModalSection.stories.tsx
git commit -m "feat(react-demos): add ModalSection Storybook story"
```

---

### Task 4: Wire into ReactDemosPage

**Files:**
- Modify: `src/features/react-demos/components/ReactDemosPage.tsx`

Current file content:

```tsx
import { UseTransitionSection } from './UseTransitionSection'
import { VirtualizationSection } from './VirtualizationSection'
import { CompoundComponentsSection } from './CompoundComponentsSection'
import { TanStackTableSection } from './TanStackTableSection'

export default function ReactDemosPage() {
  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">React Demos</h1>
      <UseTransitionSection />
      <VirtualizationSection />
      <CompoundComponentsSection />
      <TanStackTableSection />
    </div>
  )
}
```

- [ ] **Step 1: Add ModalSection import and component**

Replace the entire file with:

```tsx
import { UseTransitionSection } from './UseTransitionSection'
import { VirtualizationSection } from './VirtualizationSection'
import { CompoundComponentsSection } from './CompoundComponentsSection'
import { TanStackTableSection } from './TanStackTableSection'
import { ModalSection } from './ModalSection'

export default function ReactDemosPage() {
  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">React Demos</h1>
      <UseTransitionSection />
      <VirtualizationSection />
      <CompoundComponentsSection />
      <TanStackTableSection />
      <ModalSection />
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Run full test suite**

```bash
npm run test -- --run
```

Expected: all tests pass

- [ ] **Step 4: Commit**

```bash
git add src/features/react-demos/components/ReactDemosPage.tsx
git commit -m "feat(react-demos): wire ModalSection into ReactDemosPage"
```
