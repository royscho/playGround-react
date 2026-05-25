# CSS Examples Page — Design Spec

**Date:** 2026-05-25  
**Status:** Approved

## Overview

Add a `/css-examples` route to the playGround-react app showcasing interactive CSS3 features. Purpose: interview prep reference demonstrating real CSS3 (not Tailwind utilities).

## Route & Navigation

- Route: `/css-examples`
- Protected (requires auth, inside `AppLayout`)
- Sidebar nav link added alongside Dashboard / Users / Analytics / Settings

## Feature Structure

```
src/features/css-examples/
  components/
    CssExamplesPage.tsx          # page shell, composes 4 sections
    VisualEffectsSection.tsx     # gradients, border-radius, box-shadow, filter
    TransitionsSection.tsx       # hover transitions, @keyframes animations
    FlexboxGridSection.tsx       # flexbox vs grid side-by-side demo
    CustomPropertiesSection.tsx  # CSS variables, live theme switcher
  index.ts
```

## Sections

### 1. Visual Effects
Demos: gradient background card, `border-radius` pill shapes, `box-shadow` hover lift effect, `filter` blur/brightness/grayscale. No interactivity required — hover states sufficient.

### 2. Transitions & Animations
Demos: button with `transition` on hover (color + scale), `@keyframes` spinner, `@keyframes` bounce. Static display — animations run automatically or on hover.

### 3. Flexbox & Grid
Demos: side-by-side panels — left shows a flexbox layout (row, wrap, justify/align), right shows equivalent CSS Grid layout. Labels explain the CSS properties in use.

### 4. Custom Properties
Demos: live theme switcher — toggle button switches between two color themes by changing CSS custom property values (`--color-primary`, `--color-bg`, `--color-text`). React state drives a `data-theme` attribute; CSS vars handle the rest.

## Styling Approach

- Tailwind for page layout, spacing, and typography
- Raw `style={{}}` props or scoped `<style>` tags inside section components to demonstrate actual CSS3 syntax
- This makes CSS3 properties visible and educational

## Interactivity

Minimal React state:
- `CustomPropertiesSection`: one `useState` boolean for theme toggle
- All other sections: CSS-only interaction (`:hover`, `@keyframes` auto-play)

No API calls. No MSW handlers needed.

## Out of Scope

- CSS Grid subgrid
- CSS container queries
- Scroll-driven animations
- Persistence of theme choice
