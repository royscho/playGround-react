# React Demos Page — Design Spec

**Date:** 2026-05-25  
**Status:** Approved

## Overview

Add a `/react-demos` route showcasing three senior React patterns: `useTransition`, virtualization, and compound components. Purpose: interview prep — each demo makes an abstract concept tangible and interactive.

## Route & Navigation

- Route: `/react-demos`
- Protected (requires auth, inside `AppLayout`)
- Sidebar nav link: `{ to: '/react-demos', label: 'React Demos', icon: '⚛️' }`

## Feature Structure

```
src/features/react-demos/
  components/
    ReactDemosPage.tsx              # page shell, composes 3 sections
    UseTransitionSection.tsx        # useTransition demo
    VirtualizationSection.tsx       # @tanstack/react-virtual demo
    CompoundComponentsSection.tsx   # Accordion compound component demo
    Accordion.tsx                   # reusable Accordion implementation
  index.ts
```

## Sections

### 1. UseTransitionSection

A search input filters a list of 10,000 generated items. Two modes toggled by a button:

- **Without transition:** `setState` called directly on input change — typing feels sluggish as React blocks to re-render the full filtered list
- **With transition:** input state updated immediately, list filter wrapped in `startTransition` — input stays responsive, `isPending` shows a spinner on the list while it catches up

User can toggle between modes to feel the difference. State: `query` (string), `mode` ('normal' | 'transition'), `isPending` (from `useTransition`).

### 2. VirtualizationSection

Same 10,000-item list rendered two ways in a side-by-side layout:

- **Left (naive):** all 10,000 `<div>` elements in the DOM, scrollable container
- **Right (virtual):** `@tanstack/react-virtual` — only ~15 visible rows rendered at a time

Each panel shows a live DOM node count badge. Makes the performance argument visible without needing DevTools.

> Note: The naive panel intentionally renders slowly to illustrate the problem. We cap it at 2,000 items to avoid freezing the browser.

### 3. CompoundComponentsSection

Custom `<Accordion>` built with the compound component pattern. Two side-by-side columns:

- **Left:** Compound API usage — clean, expressive, no prop drilling
- **Right:** Code snippet showing how `<Accordion>`, `<Accordion.Item>`, `<Accordion.Trigger>`, `<Accordion.Content>` are defined using React Context

`Accordion.tsx` implements the pattern:
- `Accordion` provides context (which item is open) via `AccordionContext`
- `Accordion.Item` provides its own `id` via `AccordionItemContext`
- `Accordion.Trigger` reads both contexts to toggle open state
- `Accordion.Content` reads item context to show/hide

### Accordion API (compound component pattern)

```tsx
<Accordion>
  <Accordion.Item id="1">
    <Accordion.Trigger>What is React?</Accordion.Trigger>
    <Accordion.Content>A JavaScript library for building UIs.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item id="2">
    <Accordion.Trigger>What is a compound component?</Accordion.Trigger>
    <Accordion.Content>Components that share implicit state via Context.</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

## State Summary

| Section | State |
|---------|-------|
| UseTransitionSection | `query`, `mode`, `isPending` |
| VirtualizationSection | `naiveCount` (computed), `virtualCount` (computed) |
| CompoundComponentsSection | `openId` inside Accordion context |

## Dependencies

- `@tanstack/react-virtual` — already installed
- No new dependencies needed

## Out of Scope

- `useDeferredValue` demo (similar concept to useTransition, not worth duplicating)
- Infinite scroll (separate feature)
- Accordion animations
