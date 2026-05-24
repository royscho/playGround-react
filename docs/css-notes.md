# CSS / Tailwind Interview Notes

## Flexbox

```css
display: flex;
flex-direction: row | column;
justify-content: flex-start | center | space-between | space-around;
align-items: stretch | center | flex-start | flex-end;
flex-wrap: nowrap | wrap;
gap: 1rem;
```

**Tailwind:**
```html
<div class="flex items-center justify-between gap-4">
<div class="flex flex-col gap-2">
```

**Key mental model:** `justify-content` = main axis, `align-items` = cross axis.

---

## Grid

```css
display: grid;
grid-template-columns: repeat(3, 1fr);
grid-template-rows: auto;
gap: 1rem;
```

**Tailwind:**
```html
<div class="grid grid-cols-3 gap-4">
<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">  <!-- responsive -->
```

`fr` = fractional unit — `1fr 2fr` gives 1/3 and 2/3 of available space.

---

## Spacing Scale

Tailwind base unit = 4px (`1 unit = 0.25rem`).

| class | px |
|-------|----|
| `p-1` | 4px |
| `p-2` | 8px |
| `p-4` | 16px |
| `p-6` | 24px |
| `p-8` | 32px |

Half-steps exist: `p-0.5` (2px), `p-1.5` (6px), `p-2.5` (10px).

---

## Responsive Prefixes

Mobile-first — unprefixed = all sizes, prefixed = that breakpoint and up.

| prefix | min-width |
|--------|-----------|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |
| `2xl:` | 1536px |

```html
<div class="hidden md:flex">          <!-- hidden on mobile, flex on md+ -->
<div class="text-sm lg:text-base">    <!-- smaller text on mobile -->
<div class="grid grid-cols-1 lg:grid-cols-3">
```

---

## Dark Mode

Tailwind v4 class-based dark mode — add `.dark` to root element:

```css
/* index.css */
@custom-variant dark (&:where(.dark, .dark *));
```

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

**In this project:** `AppLayout` toggles `.dark` on root div via `uiStore.darkMode`.

---

## CSS Variables

```css
:root {
  --color-primary: #3b82f6;
  --spacing-base: 1rem;
}

.element {
  color: var(--color-primary);
  padding: var(--spacing-base);
}
```

**Tailwind v4** defines theme via `@theme`:
```css
@theme {
  --color-surface: #ffffff;
}
```

---

## Animations

```css
/* keyframes */
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

**Tailwind built-ins:** `animate-spin`, `animate-pulse`, `animate-bounce`, `animate-ping`.

```html
<svg class="animate-spin h-4 w-4">   <!-- loading spinner -->
<div class="animate-pulse bg-gray-200">  <!-- skeleton -->
```

---

## Specificity

Order (lowest → highest):
1. Element selectors (`div`, `p`)
2. Class selectors (`.btn`)
3. ID selectors (`#header`)
4. Inline styles (`style="..."`)
5. `!important`

Tailwind avoids specificity wars — all utilities are single-class, same specificity. Use `className` prop merging (clsx) to combine without conflicts.

---

## Box Model

```
margin > border > padding > content
```

`box-sizing: border-box` (Tailwind default via preflight) — `width` includes padding + border, NOT margin.

```html
<div class="w-64 p-4 border">  <!-- total width = 256px including padding + border -->
```

---

## Positioning

| class | css | use case |
|-------|-----|----------|
| `static` | default | — |
| `relative` | `position: relative` | anchor for absolute children |
| `absolute` | `position: absolute` | overlay, badge on icon |
| `fixed` | `position: fixed` | sticky navbar, modal backdrop |
| `sticky` | `position: sticky` | table header that sticks on scroll |

```html
<!-- badge on button — parent needs relative -->
<div class="relative">
  <button>🔔</button>
  <span class="absolute -top-1 -right-1 ...">3</span>
</div>
```

---

## Common Interview Q&A

**Q: Flexbox vs Grid?**  
Flex = one dimension (row OR column). Grid = two dimensions (rows AND columns). Use flex for navbars/toolbars, grid for card layouts.

**Q: What is `z-index`?**  
Controls stacking order of positioned elements. Only works on elements with `position` ≠ `static`. Higher = on top.

**Q: What is `rem` vs `px` vs `em`?**  
`px` = absolute. `rem` = relative to root font size (16px default → `1rem = 16px`). `em` = relative to parent font size (can compound/cascade unpredictably). Prefer `rem` for font sizes.

**Q: How does Tailwind purge unused CSS?**  
Tailwind v4 scans source files for class names and only generates CSS for classes it finds. Zero dead CSS in production.

**Q: What is `will-change`?**  
Hints to the browser to promote an element to its own GPU layer for smoother animations. Use sparingly — `will-change: transform` before heavy animations, remove after.

**Q: BEM naming?**  
Block__Element--Modifier. `.card__title--highlighted`. Less relevant with Tailwind but appears in legacy codebases.

---

## Pseudo-classes & Pseudo-elements

```css
/* pseudo-classes — state */
a:hover   { }        /* mouse over */
a:focus   { }        /* keyboard focus */
li:first-child { }   /* first sibling */
li:last-child  { }
li:nth-child(2n) { } /* every even item */
input:disabled { }
input:checked  { }
input:invalid  { }

/* pseudo-elements — virtual elements */
p::before { content: '→ '; }   /* insert before content */
p::after  { content: ' ←'; }   /* insert after content */
p::first-line { }
input::placeholder { color: gray; }
```

**Tailwind:**
```html
<a class="hover:text-blue-600 focus:ring-2">
<li class="odd:bg-gray-50 even:bg-white">
<input class="disabled:opacity-50 invalid:border-red-500">
```

---

## Transitions

Smooth property change over time:

```css
.btn {
  background: blue;
  transition: background 200ms ease, transform 150ms ease;
}
.btn:hover {
  background: darkblue;
  transform: scale(1.02);
}
```

`transition: property duration timing-function delay`

Common timing functions: `ease` (default), `linear`, `ease-in`, `ease-out`, `ease-in-out`.

**Tailwind:**
```html
<button class="transition-colors duration-200 hover:bg-blue-700">
<div class="transition-transform duration-150 hover:scale-105">
```

---

## Stacking Context

`z-index` only works within the same stacking context. A new context is created by:
- `position` + `z-index` (not `auto`)
- `opacity` < 1
- `transform`, `filter`, `will-change`
- `isolation: isolate`

**Common bug:** modal has `z-index: 9999` but still appears behind a sidebar — because the sidebar's parent created a stacking context with `transform`.

**Fix:**
```css
.modal-wrapper { isolation: isolate; } /* creates own context */
```

**Tailwind:** `isolate` class.

---

## Overflow & Scrolling

```css
overflow: visible | hidden | scroll | auto;
overflow-x: hidden;   /* clip horizontal only */
overflow-y: auto;     /* scroll vertical only when needed */

/* smooth scrolling */
html { scroll-behavior: smooth; }

/* custom scrollbar (webkit) */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-thumb { background: #888; border-radius: 3px; }
```

**Tailwind:** `overflow-hidden`, `overflow-y-auto`, `overflow-x-scroll`.

---

## The Cascade

Three factors decide which rule wins (in order):

1. **Origin** — browser default < author stylesheet < inline style
2. **Specificity** — calculated score: `(IDs, classes, elements)`
   - `#nav .link a` → (1, 1, 1)
   - `.btn.active` → (0, 2, 0) ← wins over above? No — compare left to right
3. **Order** — later rule wins when specificity is equal

```css
/* specificity: 0,1,0 */
.red { color: red; }

/* specificity: 0,1,0 — same, but declared later → wins */
.blue { color: blue; }
```

---

## CSS Performance

**Expensive to animate** (triggers layout → paint → composite):
- `width`, `height`, `margin`, `padding`, `top`, `left`

**Cheap to animate** (composite only — GPU handles it):
- `transform: translate/scale/rotate`
- `opacity`

**Rule:** always prefer `transform` over `top/left` for movement.

```css
/* BAD — causes layout recalc every frame */
.moving { transition: left 300ms; }

/* GOOD — GPU composited */
.moving { transition: transform 300ms; }
```

**`will-change`:** promotes element to GPU layer before animation starts:
```css
.card:hover { will-change: transform; }  /* prep on hover */
.card { transition: transform 200ms; }
```

---

## Modern CSS (2024+)

**Container queries** — style based on parent size, not viewport:
```css
.card-wrapper { container-type: inline-size; }

@container (min-width: 400px) {
  .card { flex-direction: row; }
}
```

**`:has()` selector** — "parent" selector:
```css
/* form that contains an invalid input */
form:has(input:invalid) { border-color: red; }

/* li that contains a checked checkbox */
li:has(input:checked) { background: lightblue; }
```

**Logical properties** — direction-agnostic (RTL/LTR support):
```css
/* instead of margin-left */
margin-inline-start: 1rem;

/* instead of padding-top + padding-bottom */
padding-block: 0.5rem;
```

**CSS nesting** (now native, no preprocessor needed):
```css
.button {
  background: blue;

  &:hover { background: darkblue; }
  &.active { font-weight: bold; }
}
```

---

## Tailwind Patterns Used in This Project

```html
<!-- card pattern -->
<div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm
            dark:border-gray-700 dark:bg-gray-800">

<!-- responsive grid -->
<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">

<!-- centered page with max width -->
<div class="mx-auto max-w-lg p-6">

<!-- flex toolbar -->
<div class="flex items-center justify-between gap-3">

<!-- truncate long text -->
<p class="truncate">Very long text that gets cut off...</p>

<!-- visually hidden but accessible -->
<span class="sr-only">Screen reader only text</span>

<!-- aspect ratio -->
<div class="aspect-video">  <!-- 16:9 -->
<div class="aspect-square"> <!-- 1:1 -->
```
