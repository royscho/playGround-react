# React Interview Prep Dashboard — Design Spec

**Date:** 2026-05-15  
**Author:** Senior React Native dev refreshing React for frontend interviews  
**Target role:** Senior Frontend Engineer

---

## Overview

Admin dashboard app built to cover every topic a senior React frontend interviewer will probe. Feature-based architecture, modern stack. The project itself is a portfolio piece and a live reference during interviews.

---

## Stack

| Tool | Purpose |
|---|---|
| Vite + React 18 + TypeScript | Build tooling + framework |
| Tailwind CSS | Styling (primary) |
| Raw CSS exercises | CSS fundamentals refresh (flexbox, grid, animations) |
| Zustand | Client/UI state |
| TanStack Query v5 | Server/async state |
| React Router v6 | Routing + protected routes |
| React Hook Form + Zod | Forms + schema validation |
| Recharts | Data visualization |
| Vitest + React Testing Library | Unit + component + integration tests |
| msw v2 | API mocking in tests |

---

## Architecture

### Folder Structure

```
src/
  features/
    auth/
      components/
      hooks/
      store/
      __tests__/
      index.ts
    users/
      components/
      hooks/
      store/
      __tests__/
      index.ts
    analytics/
      components/
      hooks/
      store/
      __tests__/
      index.ts
    settings/
      components/
      hooks/
      store/
      __tests__/
      index.ts
    notifications/
      components/
      hooks/
      store/
      __tests__/
      index.ts
  shared/
    components/    # Headless, no store access
    hooks/
    utils/
    types/
  app/
    router.tsx
    providers.tsx
    layout/
```

### Rules
- Features own their components, hooks, store slices, and tests
- Shared components are headless — no store access, props only
- No cross-feature imports (features communicate via stores or URL state)

---

## Features

### 1. Auth
- Login form (React Hook Form + Zod validation)
- JWT token stored in Zustand, persisted to localStorage
- Protected route wrapper using React Router v6 loaders
- Logout clears store + redirects

**Interview topics:** JWT handling, protected routes, auth state persistence

### 2. Users Table
- Paginated data table with sorting + column filtering
- TanStack Query with `placeholderData: keepPreviousData` for smooth pagination (v5 API)
- Row selection with Zustand (UI state)
- Virtualized list for large datasets (`@tanstack/react-virtual`)
- Search with `useDeferredValue` (React 18)

**Interview topics:** Pagination, virtualization, server vs client state separation, React 18 concurrent features

### 3. Analytics Dashboard
- KPI cards + line/bar/area charts (Recharts)
- Date range filter with `useTransition` (non-blocking UI update)
- `useMemo` for expensive chart data transformations
- Suspense boundaries per chart section
- Skeleton loaders during fetch

**Interview topics:** `useMemo`/`useCallback`, `useTransition`, `useDeferredValue`, Suspense, performance optimization

### 4. Settings / Profile
- Profile form with optimistic update (TanStack Query mutation)
- Controlled + uncontrolled field examples
- Zod schema validation with custom error messages
- Dirty state detection (warn before leaving with unsaved changes)

**Interview topics:** Optimistic updates, form state patterns, controlled vs uncontrolled

### 5. Notifications Panel
- Zustand slice for notification list
- Real-time simulation via `setInterval` + Zustand actions
- Compound component pattern for `<NotificationList>` / `<NotificationItem>` / `<NotificationBadge>`
- Mark as read, clear all, persist to sessionStorage

**Interview topics:** Compound components, Zustand slices, real-time patterns

---

## State Design

```
Server state  →  TanStack Query   (fetching, caching, background sync)
Client state  →  Zustand          (UI state, auth session, preferences)
Form state    →  React Hook Form  (local, uncontrolled by default)
```

### Zustand Stores
- `authStore` — user object, token, login/logout actions
- `uiStore` — sidebar open, dark mode toggle, notification count
- `usersStore` — selected rows, active filter state (UI only)
- `notificationsStore` — notification list, unread count, actions

### Data Flow Per Feature
```
Route → Feature page component
  → TanStack Query hook (async/server data)
  → Zustand selector (UI state)
  → Feature components (receive data via props)
  → Shared components (pure, props only, no store)
```

---

## React 18 Patterns (must-demonstrate)

| Pattern | Where used |
|---|---|
| `Suspense` + `ErrorBoundary` | Every async feature route |
| `useTransition` | Analytics date filter |
| `useDeferredValue` | Users search input |
| `React.lazy` | Each feature (code splitting) |
| Automatic batching | Notification bulk actions |

---

## CSS Refresh

Tailwind for production code. CSS fundamentals documented in `/docs/css-notes.md`:
- Flexbox: sidebar layout, nav bar, card rows
- CSS Grid: dashboard card grid, analytics layout
- Animations: skeleton loaders, toast slide-in, modal fade
- CSS Variables: dark mode theming (`--color-bg`, `--color-surface`)
- Specificity, cascade, BEM naming (reference only)

---

## Testing Strategy

### What to test
```
Unit           →  custom hooks (useDebounce, usePagination, useLocalStorage)
                  Zustand store actions
                  utility/formatter functions

Component      →  shared components (Button, Table, Modal, Input)
                  form validation behavior
                  error boundary fallback rendering

Integration    →  auth flow (login → protected route redirect)
                  users filter → query update → results render
                  settings save → optimistic update → rollback on error
```

### Tools
- **Vitest** — test runner (Vite-native, fast)
- **RTL** — behavior-driven component tests
- **msw v2** — API mocking (handler-based, no fetch monkey-patching)

### What NOT to test
- Implementation details (internal component state, private methods)
- Third-party library internals (Recharts output, RHF field state)
- Snapshot tests (fragile, low signal)

### Coverage target
~70% — shows discipline without killing velocity. Mention this number explicitly in interviews.

### Per-feature minimum
Each `features/*/` folder has `__tests__/` with at minimum:
- One custom hook test
- One component behavior test

---

## Advanced Patterns to Showcase

| Pattern | Implementation |
|---|---|
| Compound components | `<NotificationList>`, `<Table>` |
| Custom hook abstraction | `usePagination`, `useDebounce`, `useLocalStorage` |
| Error boundaries | Feature-level + global fallback |
| Code splitting | `React.lazy` per feature route |
| Render optimization | `React.memo` on table rows, `useCallback` on handlers |
| TypeScript generics | `useQuery<T>`, `Table<T>`, `ApiResponse<T>` |

---

## Dark Mode

- Tailwind `darkMode: 'class'` strategy
- Toggle stored in `uiStore`, persisted to localStorage
- CSS variables on `:root` and `.dark` for custom colors
- Smooth transition via `transition-colors duration-200`

---

## Mock API

No backend needed. `msw v2` service worker intercepts fetches:
- `GET /api/users` — paginated user list
- `GET /api/analytics` — chart data by date range  
- `PUT /api/settings` — profile update (simulated delay + occasional error for optimistic update demo)
- `POST /api/auth/login` — returns mock JWT
