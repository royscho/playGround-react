# Performance + Accessibility Demo Pages — Design Spec

**Date:** 2026-05-27
**Status:** Approved

## Overview

Add two new demo pages for senior frontend interview preparation:
- `/performance` — web performance optimization patterns with live demos
- `/accessibility` — ARIA, keyboard navigation, and focus management built from scratch

Both are protected routes inside `AppLayout`, lazy-loaded, following the same pattern as `/react-demos`.

---

## Route & Navigation

| Route | Sidebar label | Icon |
|-------|--------------|------|
| `/performance` | Performance | ⚡ |
| `/accessibility` | Accessibility | ♿ |

Both added to `src/app/router.tsx` (lazy import + route inside `<Route element={<AppLayout />}>`) and `src/app/layout/Sidebar.tsx` (navItems).

---

## Feature Structure

```
src/features/performance/
  components/
    PerformancePage.tsx              # page shell
    CoreWebVitalsSection.tsx         # LCP/CLS/INP + real nav timing
    DebounceThrottleSection.tsx      # side-by-side input demo
    LazyLoadSection.tsx              # IntersectionObserver grid
  index.ts

src/features/accessibility/
  components/
    AccessibilityPage.tsx            # page shell
    AccessibleModalSection.tsx       # focus trap + ARIA dialog
    AccessibleFormSection.tsx        # ARIA form + live regions
  hooks/
    useFocusTrap.ts                  # reusable focus trap hook
  index.ts
```

---

## Performance Page (`/performance`)

### CoreWebVitalsSection

Educational + live data section.

**Static content:**
- Table of the three Core Web Vitals with threshold bands:

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | ≤ 2.5s | ≤ 4s | > 4s |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |
| INP (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms |

Each metric row color-coded green/yellow/red based on its threshold band.

**Live data:**
Reads `performance.getEntriesByType('navigation')[0]` on mount and displays:
- TTFB (Time to First Byte)
- DOM Content Loaded
- Total Load Time

Each displayed as a colored badge (green/yellow/red) against the LCP thresholds for reference.

**Code pattern shown:**
```ts
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.name, entry.startTime)
  }
})
observer.observe({ type: 'largest-contentful-paint', buffered: true })
```

`data-testid="core-web-vitals"`

### DebounceThrottleSection

Three side-by-side inputs: **Raw** / **Debounced (300ms)** / **Throttled (300ms)**.

Each input shows:
- Event counter ("Fired: N times")
- Visual flash indicator when the handler fires (brief highlight)

Both `debounce` and `throttle` implemented from scratch (no lodash):
```ts
function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>
  return ((...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay) }) as T
}

function throttle<T extends (...args: unknown[]) => void>(fn: T, interval: number): T {
  let last = 0
  return ((...args) => { const now = Date.now(); if (now - last >= interval) { last = now; fn(...args) } }) as T
}
```

`data-testid="debounce-throttle"`

### LazyLoadSection

Scrollable grid of 20 placeholder cards. Each card:
- **Unloaded state**: gray placeholder box, "Not loaded" label
- **Loaded state**: colored box (hue based on index), "Loaded ✓" badge

Cards load when they enter the viewport via `IntersectionObserver`. Once loaded, observer disconnects for that element (load once, not repeatedly).

Counter at top: "X / 20 loaded"

`IntersectionObserver` constructed once on mount, cleaned up on unmount.

`data-testid="lazy-load-section"`, each card `data-testid="lazy-card-{i}"`

---

## Accessibility Page (`/accessibility`)

### useFocusTrap (`hooks/useFocusTrap.ts`)

```ts
function useFocusTrap(containerRef: React.RefObject<HTMLElement>, isOpen: boolean): void
```

- When `isOpen` is true: queries all focusable elements inside `containerRef` (selects `button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`)
- Handles `keydown` on the container: Tab moves to next focusable, wraps from last to first; Shift+Tab wraps from first to last
- Focuses first focusable element when `isOpen` becomes true
- Cleans up event listener when `isOpen` becomes false or on unmount

### AccessibleModalSection

Button labeled "Open Dialog" triggers a modal. The modal:

**ARIA attributes:**
- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby` pointing to modal's `<h2>` id

**Behavior:**
- Uses `useFocusTrap` — Tab/Shift+Tab cycle only within modal
- Escape key closes modal
- Click on backdrop closes modal
- On close: focus returns to the trigger button (`triggerRef.current?.focus()`)
- Background: `aria-hidden="true"` set on `<div id="root">` while open

**Modal content:** simple dialog with title, description paragraph, "Confirm" button, "Cancel" button.

**"What the screen reader hears" callout:** explains `role="dialog"` announces "dialog", `aria-labelledby` reads the title, `aria-modal` tells SR to ignore background content.

`data-testid="modal-section"`, trigger `data-testid="modal-trigger"`, modal `data-testid="modal"`, close button `data-testid="modal-close"`

### AccessibleFormSection

Form with three fields: **Name** (required), **Email** (required), **Message** (optional).

**Per-field ARIA:**
- `aria-required="true"` on required fields
- `aria-invalid="true"` set when field has a validation error
- `aria-describedby` links each field to its error element id
- Error element: `role="alert"` (announced immediately by screen readers on appearance)

**Live region:**
- `aria-live="polite"` region at top of form
- Shows "Form has N errors" during invalid submission attempt
- Shows "Message sent!" on successful submit

**Validation rules:**
- Name: non-empty
- Email: non-empty + basic format (`includes('@')`)
- Message: no validation

**Submit behavior:** validates all fields on submit; if errors, announces them and focuses first invalid field; if valid, shows success state in live region.

**"What the screen reader hears" callout:** explains `role="alert"` fires immediately, `aria-live="polite"` waits for current speech to finish, `aria-describedby` reads the error after the field label.

`data-testid="a11y-form"`, fields `data-testid="field-name"`, `data-testid="field-email"`, `data-testid="field-message"`, live region `data-testid="form-live-region"`

---

## Data Flow

```
PerformancePage
  ├── CoreWebVitalsSection   (reads window.performance on mount)
  ├── DebounceThrottleSection (owns 3 counters + debounce/throttle fns)
  └── LazyLoadSection        (owns IntersectionObserver + loaded[] state)

AccessibilityPage
  ├── AccessibleModalSection  (owns isOpen state + triggerRef)
  │     └── useFocusTrap(modalRef, isOpen)
  └── AccessibleFormSection   (owns field values + errors + submitState)
```

---

## Testing

### Performance tests

- `CoreWebVitalsSection.test.tsx` — renders section, displays metric table, shows navigation timing (mock `performance.getEntriesByType`)
- `DebounceThrottleSection.test.tsx` — debounced counter increments once after delay (fake timers), throttled counter respects interval, raw counter increments immediately
- `LazyLoadSection.test.tsx` — cards start unloaded, `IntersectionObserver` mock triggers load, counter updates

### Accessibility tests

- `useFocusTrap.test.ts` — Tab moves forward through focusable elements, wraps at end; Shift+Tab wraps at start; disabled when `isOpen=false`
- `AccessibleModalSection.test.tsx` — modal has `role="dialog"`, `aria-modal="true"`, `aria-labelledby`; Escape closes; focus returns to trigger
- `AccessibleFormSection.test.tsx` — submit with empty fields sets `aria-invalid="true"`, shows `role="alert"` errors, links via `aria-describedby`; valid submit shows success in live region

### Test setup

`IntersectionObserver` mocked in `vitest.setup.ts` with a controllable trigger:
```ts
// Default mock: does NOT auto-trigger. Tests call triggerIntersection(el) manually.
const intersectionCallbacks = new Map<Element, IntersectionObserverCallback>()
const mockIntersectionObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn((el: Element) => intersectionCallbacks.set(el, callback)),
  unobserve: vi.fn((el: Element) => intersectionCallbacks.delete(el)),
  disconnect: vi.fn(),
}))
window.IntersectionObserver = mockIntersectionObserver

// Helper for tests: simulate an element entering the viewport
export function triggerIntersection(el: Element) {
  intersectionCallbacks.get(el)?.([{ target: el, isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)
}
```

---

## Out of Scope

- Real Lighthouse integration
- `axe-core` automated a11y audit
- Screen reader testing (NVDA/VoiceOver)
- WCAG 2.2 full compliance audit
- Color contrast checker tool
- Reduced motion (`prefers-reduced-motion`) demos
