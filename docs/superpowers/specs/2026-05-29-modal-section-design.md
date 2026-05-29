# Modal Section Demo — Design

## Goal

Add a `ModalSection` to the React Demos page for interview prep. Showcases the shared `Modal` component with three variants — info, confirm, and form — triggered by buttons.

## Approach

Single self-contained component `ModalSection` dropped into `ReactDemosPage`, matching the existing `CompoundComponentsSection` pattern. No external state, no API. All state managed locally with one `useState`.

## Tech Stack

- Existing shared `Modal` component (`src/shared/components/Modal.tsx`)
- React `useState` for tracking which modal is open
- Tailwind 4 for styling
- Side-by-side grid layout (live demo left, code snippet right)

## File Structure

```
src/features/react-demos/components/
  ModalSection.tsx                          ← new: self-contained demo
  __tests__/
    ModalSection.test.tsx                   ← new: unit tests
  __stories__/
    ModalSection.stories.tsx                ← new: Default story
```

**Modified:**
- `src/features/react-demos/components/ReactDemosPage.tsx` — add `<ModalSection />`

## State

Single `useState<'info' | 'confirm' | 'form' | null>` — `null` means all closed.

```ts
const [open, setOpen] = useState<'info' | 'confirm' | 'form' | null>(null)
```

## Demo Variants

### Info Modal
- Button label: `Open Info Modal`
- Modal title: `What is a Modal?`
- Content: two sentences explaining modals (fixed copy)
- Footer: single `Close` button

### Confirm Modal
- Button label: `Open Confirm Modal`
- Modal title: `Delete Item`
- Content: "Are you sure you want to delete this item? This cannot be undone."
- Footer: `Cancel` button (closes modal) + `Delete` button (closes modal, no side effect)

### Form Modal
- Button label: `Open Form Modal`
- Modal title: `Edit Name`
- Content: label + text input (controlled, local state `name`)
- Footer: `Cancel` button + `Save` button (closes modal, no side effect)
- Input resets to empty when modal opens

## UI Layout

```
[Modal Demos]
Description text...

[ Live demo          | How it works         ]
[ [Open Info Modal]  | <code snippet>       ]
[ [Open Confirm]     |                      ]
[ [Open Form Modal]  |                      ]
```

Code snippet shows the `useState` + `Modal` usage pattern:

```tsx
const [open, setOpen] = useState<'info' | 'confirm' | 'form' | null>(null)

<Button onClick={() => setOpen('info')}>Open Info Modal</Button>

<Modal isOpen={open === 'info'} onClose={() => setOpen(null)} title="What is a Modal?">
  {/* content */}
</Modal>
```

## Testing

File: `src/features/react-demos/components/__tests__/ModalSection.test.tsx`

Tests:
- Renders section heading
- No modal visible on initial render
- Clicking "Open Info Modal" opens the info modal
- Clicking "Open Confirm Modal" opens the confirm modal
- Clicking "Open Form Modal" opens the form modal
- Closing modal via close button hides it
- Escape key closes modal
- Backdrop click closes modal

## Storybook

`ModalSection.stories.tsx` — single `Default` story, no args (all state internal).

## Out of Scope

- `createPortal` rendering
- Focus trapping
- Animation/transitions
- Multiple modals open simultaneously
- Async confirm callbacks
