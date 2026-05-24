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
