# React Interview Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a senior React frontend interview prep dashboard covering React 18, Zustand, TanStack Query, routing, forms, testing, and CSS fundamentals.

**Architecture:** Feature-based (`features/auth|users|analytics|settings|notifications`). Shared components are headless (no store access). Server state via TanStack Query, client/UI state via Zustand, form state via React Hook Form.

**Tech Stack:** Vite + React 18 + TypeScript, Tailwind CSS, Zustand, TanStack Query v5, React Router v6, React Hook Form + Zod, Recharts, Vitest + RTL, msw v2.

---

## File Map

```
src/
  app/
    router.tsx
    providers.tsx
    layout/
      AppLayout.tsx
      Sidebar.tsx
      TopBar.tsx
  features/
    auth/
      components/LoginForm.tsx
      components/ProtectedRoute.tsx
      hooks/useAuth.ts
      store/authStore.ts
      __tests__/authStore.test.ts
      __tests__/LoginForm.test.tsx
      index.ts
    users/
      components/UsersPage.tsx
      components/UsersTable.tsx
      components/UserFilters.tsx
      hooks/useUsers.ts
      store/usersStore.ts
      __tests__/useUsers.test.ts
      __tests__/UsersTable.test.tsx
      index.ts
    analytics/
      components/AnalyticsPage.tsx
      components/KpiCard.tsx
      components/RevenueChart.tsx
      components/DateRangeFilter.tsx
      hooks/useAnalytics.ts
      __tests__/useAnalytics.test.ts
      __tests__/AnalyticsPage.test.tsx
      index.ts
    settings/
      components/SettingsPage.tsx
      components/ProfileForm.tsx
      hooks/useSettings.ts
      __tests__/ProfileForm.test.tsx
      index.ts
    notifications/
      components/NotificationList.tsx
      components/NotificationItem.tsx
      components/NotificationBadge.tsx
      hooks/useNotifications.ts
      store/notificationsStore.ts
      __tests__/notificationsStore.test.ts
      __tests__/NotificationList.test.tsx
      index.ts
  shared/
    components/Button.tsx
    components/Input.tsx
    components/Modal.tsx
    components/Table.tsx
    components/Badge.tsx
    components/Skeleton.tsx
    components/ErrorBoundary.tsx
    components/__tests__/Button.test.tsx
    components/__tests__/Table.test.tsx
    components/__tests__/Modal.test.tsx
    hooks/useDebounce.ts
    hooks/usePagination.ts
    hooks/useLocalStorage.ts
    hooks/__tests__/useDebounce.test.ts
    hooks/__tests__/usePagination.test.ts
    hooks/__tests__/useLocalStorage.test.ts
    utils/formatters.ts
    utils/__tests__/formatters.test.ts
    types/api.ts
    types/common.ts
  store/
    uiStore.ts
  mocks/
    handlers/auth.ts
    handlers/users.ts
    handlers/analytics.ts
    handlers/settings.ts
    browser.ts
    server.ts
    data/users.ts
    data/analytics.ts
docs/
  css-notes.md
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `index.html`, `src/main.tsx`, `src/index.css`, `.eslintrc.cjs`, `vitest.setup.ts`

- [ ] **Step 1: Scaffold Vite project**

```bash
npm create vite@latest . -- --template react-ts
npm install
```

Expected: `src/App.tsx`, `src/main.tsx`, `vite.config.ts` created.

- [ ] **Step 2: Install all dependencies**

```bash
npm install react-router-dom @tanstack/react-query @tanstack/react-virtual zustand react-hook-form @hookform/resolvers zod recharts clsx
npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event msw jsdom
npx tailwindcss init -p
```

- [ ] **Step 3: Configure Tailwind**

Replace `tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--color-surface)',
      },
    },
  },
  plugins: [forms],
} satisfies Config
```

- [ ] **Step 4: Configure src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-surface: #ffffff;
  --color-bg: #f3f4f6;
}

.dark {
  --color-surface: #1f2937;
  --color-bg: #111827;
}

* {
  transition-property: color, background-color, border-color;
  transition-duration: 200ms;
}
```

- [ ] **Step 5: Configure Vitest**

Replace `vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['src/mocks/**', 'src/main.tsx'],
    },
  },
})
```

Create `vitest.setup.ts`:
```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Add scripts to package.json**

Merge into `package.json` scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src --ext ts,tsx"
  }
}
```

- [ ] **Step 7: Clean boilerplate**

Replace `src/App.tsx`:
```tsx
export default function App() {
  return <div>Dashboard</div>
}
```

Replace `src/main.tsx`:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite server running at `http://localhost:5173`

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React 18 + TypeScript + Tailwind + Vitest"
```

---

## Task 2: Shared Types

**Files:**
- Create: `src/shared/types/api.ts`, `src/shared/types/common.ts`

- [ ] **Step 1: Create API types**

Create `src/shared/types/api.ts`:
```ts
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiError {
  message: string
  status: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
}
```

- [ ] **Step 2: Create common types**

Create `src/shared/types/common.ts`:
```ts
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive'
  createdAt: string
}

export interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: string
  type: 'info' | 'warning' | 'error' | 'success'
}

export interface AnalyticsData {
  date: string
  revenue: number
  users: number
  sessions: number
}

export interface KpiMetric {
  label: string
  value: number
  change: number
  unit?: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor'
}
```

- [ ] **Step 3: Commit**

```bash
git add src/shared/types/
git commit -m "feat: add shared API and domain types"
```

---

## Task 3: Shared Utils (TDD)

**Files:**
- Create: `src/shared/utils/formatters.ts`, `src/shared/utils/__tests__/formatters.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/shared/utils/__tests__/formatters.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { formatCurrency, formatNumber, formatDate, formatPercent } from '../formatters'

describe('formatCurrency', () => {
  it('formats positive number as USD', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50')
  })
  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })
})

describe('formatNumber', () => {
  it('formats with thousands separator', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
  })
})

describe('formatDate', () => {
  it('formats ISO string to readable date', () => {
    expect(formatDate('2024-01-15T00:00:00Z')).toBe('Jan 15, 2024')
  })
})

describe('formatPercent', () => {
  it('formats positive change with + sign', () => {
    expect(formatPercent(12.5)).toBe('+12.5%')
  })
  it('formats negative change', () => {
    expect(formatPercent(-3.2)).toBe('-3.2%')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test src/shared/utils/__tests__/formatters.test.ts
```

Expected: FAIL — "Cannot find module '../formatters'"

- [ ] **Step 3: Implement formatters**

Create `src/shared/utils/formatters.ts`:
```ts
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(isoString))
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value}%`
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test src/shared/utils/__tests__/formatters.test.ts
```

Expected: PASS — 5 tests

- [ ] **Step 5: Commit**

```bash
git add src/shared/utils/
git commit -m "feat: add shared formatters with tests"
```

---

## Task 4: Shared Hooks (TDD)

**Files:**
- Create: `src/shared/hooks/useDebounce.ts`, `src/shared/hooks/usePagination.ts`, `src/shared/hooks/useLocalStorage.ts` and their `__tests__/`

- [ ] **Step 1: Write useDebounce test**

Create `src/shared/hooks/__tests__/useDebounce.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300))
    expect(result.current).toBe('hello')
  })

  it('delays update by specified ms', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'hello' },
    })
    rerender({ value: 'world' })
    expect(result.current).toBe('hello')
    act(() => { vi.advanceTimersByTime(300) })
    expect(result.current).toBe('world')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test src/shared/hooks/__tests__/useDebounce.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement useDebounce**

Create `src/shared/hooks/useDebounce.ts`:
```ts
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test src/shared/hooks/__tests__/useDebounce.test.ts
```

Expected: PASS

- [ ] **Step 5: Write usePagination test**

Create `src/shared/hooks/__tests__/usePagination.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePagination } from '../usePagination'

describe('usePagination', () => {
  it('starts at page 1', () => {
    const { result } = renderHook(() => usePagination({ total: 100, pageSize: 10 }))
    expect(result.current.page).toBe(1)
    expect(result.current.totalPages).toBe(10)
  })

  it('goes to next page', () => {
    const { result } = renderHook(() => usePagination({ total: 100, pageSize: 10 }))
    act(() => result.current.nextPage())
    expect(result.current.page).toBe(2)
  })

  it('does not exceed totalPages', () => {
    const { result } = renderHook(() => usePagination({ total: 20, pageSize: 10 }))
    act(() => { result.current.nextPage(); result.current.nextPage() })
    expect(result.current.page).toBe(2)
  })

  it('does not go below page 1', () => {
    const { result } = renderHook(() => usePagination({ total: 20, pageSize: 10 }))
    act(() => result.current.prevPage())
    expect(result.current.page).toBe(1)
  })
})
```

- [ ] **Step 6: Implement usePagination**

Create `src/shared/hooks/usePagination.ts`:
```ts
import { useState } from 'react'

interface UsePaginationOptions {
  total: number
  pageSize: number
}

export function usePagination({ total, pageSize }: UsePaginationOptions) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(total / pageSize)

  return {
    page,
    totalPages,
    pageSize,
    nextPage: () => setPage(p => Math.min(p + 1, totalPages)),
    prevPage: () => setPage(p => Math.max(p - 1, 1)),
    goToPage: (n: number) => setPage(Math.max(1, Math.min(n, totalPages))),
    reset: () => setPage(1),
  }
}
```

- [ ] **Step 7: Write useLocalStorage test**

Create `src/shared/hooks/__tests__/useLocalStorage.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => localStorage.clear())

  it('returns default value when key absent', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage<string>('key', ''))
    act(() => result.current[1]('saved'))
    expect(localStorage.getItem('key')).toBe('"saved"')
  })

  it('reads existing localStorage value on mount', () => {
    localStorage.setItem('key', '"existing"')
    const { result } = renderHook(() => useLocalStorage('key', 'default'))
    expect(result.current[0]).toBe('existing')
  })
})
```

- [ ] **Step 8: Implement useLocalStorage**

Create `src/shared/hooks/useLocalStorage.ts`:
```ts
import { useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T) => {
    setStored(value)
    localStorage.setItem(key, JSON.stringify(value))
  }

  return [stored, setValue]
}
```

- [ ] **Step 9: Run all hook tests**

```bash
npm test src/shared/hooks/__tests__/
```

Expected: PASS — 8 tests

- [ ] **Step 10: Commit**

```bash
git add src/shared/hooks/
git commit -m "feat: add useDebounce, usePagination, useLocalStorage with tests"
```

---

## Task 5: Shared Components — Button, Input, Badge, Skeleton, ErrorBoundary (TDD)

**Files:**
- Create: `src/shared/components/Button.tsx`, `Input.tsx`, `Badge.tsx`, `Skeleton.tsx`, `ErrorBoundary.tsx`
- Create: `src/shared/components/__tests__/Button.test.tsx`

- [ ] **Step 1: Write Button tests**

Create `src/shared/components/__tests__/Button.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('is disabled when disabled prop set', () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows loading spinner when loading', () => {
    render(<Button loading>Click</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test src/shared/components/__tests__/Button.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Implement Button**

Create `src/shared/components/Button.tsx`:
```tsx
import { ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100': variant === 'secondary',
          'hover:bg-gray-100 dark:hover:bg-gray-800': variant === 'ghost',
          'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
          'px-2.5 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
          'opacity-50 cursor-not-allowed': disabled || loading,
        },
        className,
      )}
      {...props}
    >
      {loading && (
        <svg data-testid="spinner" className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test src/shared/components/__tests__/Button.test.tsx
```

Expected: PASS — 4 tests

- [ ] **Step 5: Implement Input (no separate test — covered in form feature tests)**

Create `src/shared/components/Input.tsx`:
```tsx
import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            'rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600',
            error ? 'border-red-500' : 'border-gray-300',
            className,
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    )
  },
)
Input.displayName = 'Input'
```

- [ ] **Step 6: Implement Badge**

Create `src/shared/components/Badge.tsx`:
```tsx
import { clsx } from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200': variant === 'default',
          'bg-green-100 text-green-800': variant === 'success',
          'bg-yellow-100 text-yellow-800': variant === 'warning',
          'bg-red-100 text-red-800': variant === 'error',
          'bg-blue-100 text-blue-800': variant === 'info',
        },
      )}
    >
      {children}
    </span>
  )
}
```

- [ ] **Step 7: Implement Skeleton**

Create `src/shared/components/Skeleton.tsx`:
```tsx
import { clsx } from 'clsx'

interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={clsx('rounded bg-gray-200 dark:bg-gray-700', className || 'h-4 w-full')} />
      ))}
    </div>
  )
}
```

- [ ] **Step 8: Implement ErrorBoundary**

Create `src/shared/components/ErrorBoundary.tsx`:
```tsx
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Something went wrong</p>
          <p className="mt-1 text-sm text-gray-500">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 text-sm text-blue-600 underline"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
```

- [ ] **Step 9: Commit**

```bash
git add src/shared/components/
git commit -m "feat: add shared Button, Input, Badge, Skeleton, ErrorBoundary components"
```

---

## Task 6: Shared Components — Table & Modal (TDD)

**Files:**
- Create: `src/shared/components/Table.tsx`, `src/shared/components/Modal.tsx`
- Create: `src/shared/components/__tests__/Table.test.tsx`, `Modal.test.tsx`

- [ ] **Step 1: Write Table tests**

Create `src/shared/components/__tests__/Table.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Table } from '../Table'

interface Row { id: string; name: string; age: number }

const columns = [
  { key: 'name' as const, header: 'Name' },
  { key: 'age' as const, header: 'Age' },
]
const data: Row[] = [
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
]

describe('Table', () => {
  it('renders column headers', () => {
    render(<Table columns={columns} data={data} keyExtractor={r => r.id} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
  })

  it('renders row data', () => {
    render(<Table columns={columns} data={data} keyExtractor={r => r.id} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('shows empty state when no data', () => {
    render(<Table columns={columns} data={[]} keyExtractor={r => r.id} emptyMessage="No results" />)
    expect(screen.getByText('No results')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test src/shared/components/__tests__/Table.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Implement Table (generic compound component)**

Create `src/shared/components/Table.tsx`:
```tsx
interface Column<T> {
  key: keyof T
  header: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
  className?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  emptyMessage?: string
  isLoading?: boolean
}

export function Table<T>({ columns, data, keyExtractor, emptyMessage = 'No data', isLoading }: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-500">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-200 dark:border-gray-700">
          <tr>
            {columns.map(col => (
              <th key={String(col.key)} className={`px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400 ${col.className ?? ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {data.map(row => (
            <tr key={keyExtractor(row)} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              {columns.map(col => (
                <td key={String(col.key)} className={`px-4 py-3 ${col.className ?? ''}`}>
                  {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 4: Write Modal tests**

Create `src/shared/components/__tests__/Modal.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '../Modal'

describe('Modal', () => {
  it('does not render when closed', () => {
    render(<Modal isOpen={false} onClose={vi.fn()} title="Test"><p>Content</p></Modal>)
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('renders children when open', () => {
    render(<Modal isOpen={true} onClose={vi.fn()} title="Test"><p>Content</p></Modal>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn()
    render(<Modal isOpen={true} onClose={onClose} title="Test"><p>Content</p></Modal>)
    await userEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 5: Implement Modal**

Create `src/shared/components/Modal.tsx`:
```tsx
import { ReactNode, useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Run all shared component tests**

```bash
npm test src/shared/components/__tests__/
```

Expected: PASS — 10 tests

- [ ] **Step 7: Commit**

```bash
git add src/shared/components/
git commit -m "feat: add generic Table and Modal shared components with tests"
```

---

## Task 7: Mock API Setup (msw v2)

**Files:**
- Create: `src/mocks/data/users.ts`, `src/mocks/data/analytics.ts`
- Create: `src/mocks/handlers/auth.ts`, `handlers/users.ts`, `handlers/analytics.ts`, `handlers/settings.ts`
- Create: `src/mocks/browser.ts`, `src/mocks/server.ts`

- [ ] **Step 1: Create mock data**

Create `src/mocks/data/users.ts`:
```ts
import type { User } from '../../shared/types/common'

export const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: ['Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Eve Davis'][i % 5] + (i > 4 ? ` ${i}` : ''),
  email: `user${i + 1}@example.com`,
  role: (['admin', 'editor', 'viewer'] as const)[i % 3],
  status: i % 7 === 0 ? 'inactive' : 'active',
  createdAt: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
}))
```

Create `src/mocks/data/analytics.ts`:
```ts
import type { AnalyticsData, KpiMetric } from '../../shared/types/common'

export const mockAnalyticsData: AnalyticsData[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2024, 11, i + 1).toISOString().split('T')[0],
  revenue: Math.floor(Math.random() * 10000) + 5000,
  users: Math.floor(Math.random() * 500) + 100,
  sessions: Math.floor(Math.random() * 2000) + 500,
}))

export const mockKpis: KpiMetric[] = [
  { label: 'Total Revenue', value: 284500, change: 12.5, unit: '$' },
  { label: 'Active Users', value: 12340, change: -3.2 },
  { label: 'Conversion Rate', value: 3.8, change: 0.6, unit: '%' },
  { label: 'Avg Session', value: 4.2, change: 8.1, unit: 'min' },
]
```

- [ ] **Step 2: Create auth handler**

Create `src/mocks/handlers/auth.ts`:
```ts
import { http, HttpResponse, delay } from 'msw'

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    await delay(400)
    const { email, password } = await request.json() as { email: string; password: string }
    if (email === 'admin@example.com' && password === 'password') {
      return HttpResponse.json({
        data: { id: '1', name: 'Admin User', email, role: 'admin' },
        token: 'mock-jwt-token',
      })
    }
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }),
  http.post('/api/auth/logout', () => HttpResponse.json({ message: 'Logged out' })),
]
```

- [ ] **Step 3: Create users handler**

Create `src/mocks/handlers/users.ts`:
```ts
import { http, HttpResponse, delay } from 'msw'
import { mockUsers } from '../data/users'

export const usersHandlers = [
  http.get('/api/users', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10')
    const search = url.searchParams.get('search') ?? ''

    const filtered = search
      ? mockUsers.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search))
      : mockUsers

    const start = (page - 1) * pageSize
    return HttpResponse.json({
      data: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    })
  }),
]
```

- [ ] **Step 4: Create analytics handler**

Create `src/mocks/handlers/analytics.ts`:
```ts
import { http, HttpResponse, delay } from 'msw'
import { mockAnalyticsData, mockKpis } from '../data/analytics'

export const analyticsHandlers = [
  http.get('/api/analytics', async () => {
    await delay(500)
    return HttpResponse.json({ data: mockAnalyticsData, kpis: mockKpis })
  }),
]
```

- [ ] **Step 5: Create settings handler**

Create `src/mocks/handlers/settings.ts`:
```ts
import { http, HttpResponse, delay } from 'msw'

export const settingsHandlers = [
  http.put('/api/settings', async ({ request }) => {
    await delay(600)
    if (Math.random() < 0.1) {
      return HttpResponse.json({ message: 'Server error' }, { status: 500 })
    }
    const body = await request.json()
    return HttpResponse.json({ data: body, message: 'Updated successfully' })
  }),
]
```

- [ ] **Step 6: Create msw browser + server instances**

Create `src/mocks/browser.ts`:
```ts
import { setupWorker } from 'msw/browser'
import { authHandlers } from './handlers/auth'
import { usersHandlers } from './handlers/users'
import { analyticsHandlers } from './handlers/analytics'
import { settingsHandlers } from './handlers/settings'

export const worker = setupWorker(
  ...authHandlers,
  ...usersHandlers,
  ...analyticsHandlers,
  ...settingsHandlers,
)
```

Create `src/mocks/server.ts`:
```ts
import { setupServer } from 'msw/node'
import { authHandlers } from './handlers/auth'
import { usersHandlers } from './handlers/users'
import { analyticsHandlers } from './handlers/analytics'
import { settingsHandlers } from './handlers/settings'

export const server = setupServer(
  ...authHandlers,
  ...usersHandlers,
  ...analyticsHandlers,
  ...settingsHandlers,
)
```

- [ ] **Step 7: Add msw to Vitest setup**

Update `vitest.setup.ts`:
```ts
import '@testing-library/jest-dom'
import { server } from './src/mocks/server'
import { beforeAll, afterAll, afterEach } from 'vitest'

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

- [ ] **Step 8: Start msw worker in dev**

Update `src/main.tsx`:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

async function prepare() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    return worker.start({ onUnhandledRequest: 'bypass' })
  }
}

prepare().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
```

- [ ] **Step 9: Initialize msw service worker**

```bash
npx msw init public/ --save
```

- [ ] **Step 10: Commit**

```bash
git add src/mocks/ public/ vitest.setup.ts src/main.tsx
git commit -m "feat: add msw v2 mock API with handlers for auth, users, analytics, settings"
```

---

## Task 8: UI Store + App Layout

**Files:**
- Create: `src/store/uiStore.ts`
- Create: `src/app/layout/AppLayout.tsx`, `Sidebar.tsx`, `TopBar.tsx`

- [ ] **Step 1: Create uiStore**

Create `src/store/uiStore.ts`:
```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UiState {
  sidebarOpen: boolean
  darkMode: boolean
  toggleSidebar: () => void
  toggleDarkMode: () => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      darkMode: false,
      toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
      toggleDarkMode: () => set(s => ({ darkMode: !s.darkMode })),
    }),
    { name: 'ui-store' },
  ),
)
```

- [ ] **Step 2: Create Sidebar**

Create `src/app/layout/Sidebar.tsx`:
```tsx
import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/users', label: 'Users', icon: '👥' },
  { to: '/analytics', label: 'Analytics', icon: '📈' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

interface SidebarProps {
  isOpen: boolean
}

export function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside
      className={clsx(
        'flex h-screen flex-col border-r border-gray-200 bg-white transition-all dark:border-gray-700 dark:bg-gray-900',
        isOpen ? 'w-56' : 'w-16',
      )}
    >
      <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <span className="text-lg font-bold text-blue-600">{isOpen ? 'Dashboard' : 'D'}</span>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
              )
            }
          >
            <span className="text-base">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
```

- [ ] **Step 3: Create TopBar**

Create `src/app/layout/TopBar.tsx`:
```tsx
import { useUiStore } from '../../store/uiStore'
import { useAuthStore } from '../../features/auth/store/authStore'
import { Button } from '../../shared/components/Button'

export function TopBar() {
  const { toggleSidebar, toggleDarkMode, darkMode } = useUiStore()
  const { user, logout } = useAuthStore()

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900">
      <Button variant="ghost" size="sm" onClick={toggleSidebar} aria-label="Toggle sidebar">
        ☰
      </Button>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={toggleDarkMode} aria-label="Toggle dark mode">
          {darkMode ? '☀️' : '🌙'}
        </Button>
        <span className="text-sm text-gray-700 dark:text-gray-300">{user?.name}</span>
        <Button variant="secondary" size="sm" onClick={logout}>Logout</Button>
      </div>
    </header>
  )
}
```

- [ ] **Step 4: Create AppLayout**

Create `src/app/layout/AppLayout.tsx`:
```tsx
import { Outlet } from 'react-router-dom'
import { useUiStore } from '../../store/uiStore'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function AppLayout() {
  const { sidebarOpen, darkMode } = useUiStore()

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex h-screen bg-[var(--color-bg)]">
        <Sidebar isOpen={sidebarOpen} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/store/ src/app/layout/
git commit -m "feat: add uiStore (dark mode, sidebar) and AppLayout with Sidebar/TopBar"
```

---

## Task 9: Auth Feature (TDD)

**Files:**
- Create: `src/features/auth/store/authStore.ts`
- Create: `src/features/auth/hooks/useAuth.ts`
- Create: `src/features/auth/components/LoginForm.tsx`, `ProtectedRoute.tsx`
- Create: `src/features/auth/__tests__/authStore.test.ts`, `LoginForm.test.tsx`
- Create: `src/features/auth/index.ts`

- [ ] **Step 1: Write authStore tests**

Create `src/features/auth/__tests__/authStore.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../store/authStore'

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false })
    localStorage.clear()
  })

  it('starts unauthenticated', () => {
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('setAuth sets user and token', () => {
    const user = { id: '1', name: 'Alice', email: 'alice@example.com', role: 'admin' as const }
    useAuthStore.getState().setAuth(user, 'token-123')
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    expect(useAuthStore.getState().user).toEqual(user)
    expect(useAuthStore.getState().token).toBe('token-123')
  })

  it('logout clears state', () => {
    useAuthStore.getState().setAuth(
      { id: '1', name: 'Alice', email: 'alice@example.com', role: 'admin' },
      'token',
    )
    useAuthStore.getState().logout()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().token).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test src/features/auth/__tests__/authStore.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement authStore**

Create `src/features/auth/store/authStore.ts`:
```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '../../../shared/types/common'

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: AuthUser, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'auth-store' },
  ),
)
```

- [ ] **Step 4: Run authStore test to verify it passes**

```bash
npm test src/features/auth/__tests__/authStore.test.ts
```

Expected: PASS — 3 tests

- [ ] **Step 5: Write LoginForm test**

Create `src/features/auth/__tests__/LoginForm.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginForm } from '../components/LoginForm'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    <MemoryRouter>{children}</MemoryRouter>
  </QueryClientProvider>
)

describe('LoginForm', () => {
  it('shows validation errors on empty submit', async () => {
    render(<LoginForm />, { wrapper })
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
  })

  it('shows error on invalid credentials', async () => {
    render(<LoginForm />, { wrapper })
    await userEvent.type(screen.getByLabelText(/email/i), 'wrong@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpass')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument()
  })

  it('submits successfully with valid credentials', async () => {
    render(<LoginForm />, { wrapper })
    await userEvent.type(screen.getByLabelText(/email/i), 'admin@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 6: Implement useAuth hook**

Create `src/features/auth/hooks/useAuth.ts`:
```ts
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

async function loginApi(credentials: { email: string; password: string }) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'Login failed')
  }
  return res.json()
}

export function useLogin() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setAuth(data.data, data.token)
      navigate('/dashboard')
    },
  })
}
```

- [ ] **Step 7: Implement LoginForm**

Create `src/features/auth/components/LoginForm.tsx`:
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '../../../shared/components/Input'
import { Button } from '../../../shared/components/Button'
import { useLogin } from '../hooks/useAuth'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof schema>

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin()
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(data => login(data))} className="space-y-4">
      <Input
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />
      {error && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}
      <Button type="submit" loading={isPending} className="w-full">
        Sign in
      </Button>
      <p className="text-xs text-center text-gray-500">
        Demo: admin@example.com / password
      </p>
    </form>
  )
}
```

- [ ] **Step 8: Implement ProtectedRoute**

Create `src/features/auth/components/ProtectedRoute.tsx`:
```tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
```

- [ ] **Step 9: Create auth index**

Create `src/features/auth/index.ts`:
```ts
export { LoginForm } from './components/LoginForm'
export { ProtectedRoute } from './components/ProtectedRoute'
export { useAuthStore } from './store/authStore'
export { useLogin } from './hooks/useAuth'
```

- [ ] **Step 10: Run LoginForm tests**

```bash
npm test src/features/auth/__tests__/
```

Expected: PASS — 6 tests

- [ ] **Step 11: Commit**

```bash
git add src/features/auth/
git commit -m "feat: auth feature — Zustand store, login form with RHF+Zod, protected route"
```

---

## Task 10: Router + Providers

**Files:**
- Create: `src/app/router.tsx`, `src/app/providers.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create providers**

Create `src/app/providers.tsx`:
```tsx
import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

Install devtools:
```bash
npm install @tanstack/react-query-devtools
```

- [ ] **Step 2: Create router**

Create `src/app/router.tsx`:
```tsx
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { ProtectedRoute } from '../features/auth'
import { Skeleton } from '../shared/components/Skeleton'
import { ErrorBoundary } from '../shared/components/ErrorBoundary'

const LoginPage = lazy(() => import('../features/auth/components/LoginPage'))
const DashboardPage = lazy(() => import('../features/analytics/components/AnalyticsPage')) // /dashboard reuses analytics page
const UsersPage = lazy(() => import('../features/users/components/UsersPage'))
const AnalyticsPage = lazy(() => import('../features/analytics/components/AnalyticsPage'))
const SettingsPage = lazy(() => import('../features/settings/components/SettingsPage'))

const PageLoader = () => <Skeleton lines={4} className="h-8" />

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        } />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <DashboardPage />
                </Suspense>
              </ErrorBoundary>
            } />
            <Route path="/users" element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <UsersPage />
                </Suspense>
              </ErrorBoundary>
            } />
            <Route path="/analytics" element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <AnalyticsPage />
                </Suspense>
              </ErrorBoundary>
            } />
            <Route path="/settings" element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <SettingsPage />
                </Suspense>
              </ErrorBoundary>
            } />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 3: Create LoginPage wrapper**

Create `src/features/auth/components/LoginPage.tsx`:
```tsx
import { LoginForm } from './LoginForm'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Sign in</h1>
        <LoginForm />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create placeholder pages for features not yet built**

Create `src/features/users/components/UsersPage.tsx`:
```tsx
export default function UsersPage() { return <div>Users — coming soon</div> }
```

Create `src/features/settings/components/SettingsPage.tsx`:
```tsx
export default function SettingsPage() { return <div>Settings — coming soon</div> }
```

- [ ] **Step 5: Update App.tsx**

Replace `src/App.tsx`:
```tsx
import { Providers } from './app/providers'
import { AppRouter } from './app/router'

export default function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  )
}
```

- [ ] **Step 6: Verify app runs end-to-end**

```bash
npm run dev
```

Visit `http://localhost:5173`. Expected: Redirect to `/login`. Login with `admin@example.com / password`. Expected: Redirect to `/dashboard`. Sidebar navigation works. Dark mode toggle works.

- [ ] **Step 7: Commit**

```bash
git add src/app/ src/App.tsx src/features/auth/components/LoginPage.tsx src/features/users/components/UsersPage.tsx src/features/settings/components/SettingsPage.tsx
git commit -m "feat: wired router, providers, lazy routes, Suspense + ErrorBoundary per feature"
```

---

## Task 11: Users Feature (TDD)

**Files:**
- Create: `src/features/users/store/usersStore.ts`
- Create: `src/features/users/hooks/useUsers.ts`
- Create: `src/features/users/components/UsersTable.tsx`, `UserFilters.tsx`
- Replace: `src/features/users/components/UsersPage.tsx`
- Create: `src/features/users/__tests__/useUsers.test.ts`, `UsersTable.test.tsx`
- Create: `src/features/users/index.ts`

- [ ] **Step 1: Create usersStore**

Create `src/features/users/store/usersStore.ts`:
```ts
import { create } from 'zustand'

interface UsersState {
  selectedIds: Set<string>
  search: string
  roleFilter: string
  setSearch: (search: string) => void
  setRoleFilter: (role: string) => void
  toggleSelected: (id: string) => void
  clearSelected: () => void
}

export const useUsersStore = create<UsersState>()((set) => ({
  selectedIds: new Set(),
  search: '',
  roleFilter: '',
  setSearch: (search) => set({ search }),
  setRoleFilter: (roleFilter) => set({ roleFilter }),
  toggleSelected: (id) =>
    set(s => {
      const next = new Set(s.selectedIds)
      next.has(id) ? next.delete(id) : next.add(id)
      return { selectedIds: next }
    }),
  clearSelected: () => set({ selectedIds: new Set() }),
}))
```

- [ ] **Step 2: Write useUsers test**

Create `src/features/users/__tests__/useUsers.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUsers } from '../hooks/useUsers'
import { createElement } from 'react'

const wrapper = ({ children }: { children: React.ReactNode }) =>
  createElement(QueryClientProvider, {
    client: new QueryClient({ defaultOptions: { queries: { retry: false } } }),
    children,
  })

describe('useUsers', () => {
  it('fetches paginated users', async () => {
    const { result } = renderHook(() => useUsers({ page: 1, pageSize: 10, search: '' }), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(10)
    expect(result.current.data?.total).toBe(50)
  })

  it('filters by search term', async () => {
    const { result } = renderHook(() => useUsers({ page: 1, pageSize: 10, search: 'Alice' }), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    result.current.data?.data.forEach(u => {
      expect(u.name.toLowerCase()).toContain('alice')
    })
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npm test src/features/users/__tests__/useUsers.test.ts
```

Expected: FAIL

- [ ] **Step 4: Implement useUsers hook**

Create `src/features/users/hooks/useUsers.ts`:
```ts
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import type { PaginatedResponse } from '../../../shared/types/api'
import type { User } from '../../../shared/types/common'

interface UseUsersParams {
  page: number
  pageSize: number
  search: string
}

async function fetchUsers(params: UseUsersParams): Promise<PaginatedResponse<User>> {
  const url = new URL('/api/users', window.location.origin)
  url.searchParams.set('page', String(params.page))
  url.searchParams.set('pageSize', String(params.pageSize))
  if (params.search) url.searchParams.set('search', params.search)
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

export function useUsers(params: UseUsersParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
    placeholderData: keepPreviousData,
  })
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npm test src/features/users/__tests__/useUsers.test.ts
```

Expected: PASS — 2 tests

- [ ] **Step 6: Write UsersTable test**

Create `src/features/users/__tests__/UsersTable.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import UsersPage from '../components/UsersPage'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    <MemoryRouter>{children}</MemoryRouter>
  </QueryClientProvider>
)

describe('UsersPage', () => {
  it('renders users table after loading', async () => {
    render(<UsersPage />, { wrapper })
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(), { timeout: 2000 })
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
  })

  it('shows pagination controls', async () => {
    render(<UsersPage />, { wrapper })
    await waitFor(() => expect(screen.getByText('Alice Johnson')).toBeInTheDocument(), { timeout: 2000 })
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 7: Implement UserFilters**

Create `src/features/users/components/UserFilters.tsx`:
```tsx
import { useUsersStore } from '../store/usersStore'
import { Input } from '../../../shared/components/Input'

export function UserFilters() {
  const { search, setSearch, roleFilter, setRoleFilter } = useUsersStore()

  return (
    <div className="flex gap-3">
      <Input
        placeholder="Search users..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-64"
      />
      <select
        value={roleFilter}
        onChange={e => setRoleFilter(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
      >
        <option value="">All roles</option>
        <option value="admin">Admin</option>
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
      </select>
    </div>
  )
}
```

- [ ] **Step 8: Implement UsersPage with table, pagination, useDeferredValue**

Replace `src/features/users/components/UsersPage.tsx`:
```tsx
import { useDeferredValue } from 'react'
import { useUsers } from '../hooks/useUsers'
import { useUsersStore } from '../store/usersStore'
import { usePagination } from '../../../shared/hooks/usePagination'
import { Table } from '../../../shared/components/Table'
import { Badge } from '../../../shared/components/Badge'
import { Button } from '../../../shared/components/Button'
import { UserFilters } from './UserFilters'
import { formatDate } from '../../../shared/utils/formatters'
import type { User } from '../../../shared/types/common'

const PAGE_SIZE = 10

export default function UsersPage() {
  const { search } = useUsersStore()
  const deferredSearch = useDeferredValue(search)
  const { page, totalPages, nextPage, prevPage } = usePagination({
    total: 50,
    pageSize: PAGE_SIZE,
  })

  const { data, isLoading, isFetching } = useUsers({
    page,
    pageSize: PAGE_SIZE,
    search: deferredSearch,
  })

  const columns = [
    { key: 'name' as const, header: 'Name' },
    { key: 'email' as const, header: 'Email' },
    {
      key: 'role' as const,
      header: 'Role',
      render: (value: User['role']) => (
        <Badge variant={value === 'admin' ? 'info' : 'default'}>{value}</Badge>
      ),
    },
    {
      key: 'status' as const,
      header: 'Status',
      render: (value: User['status']) => (
        <Badge variant={value === 'active' ? 'success' : 'warning'}>{value}</Badge>
      ),
    },
    {
      key: 'createdAt' as const,
      header: 'Joined',
      render: (value: string) => formatDate(value),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
        <span className="text-sm text-gray-500">
          {data?.total ?? 0} total {isFetching && '(refreshing...)'}
        </span>
      </div>
      <UserFilters />
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {isLoading
          ? <p className="p-4 text-sm text-gray-500">Loading users...</p>
          : (
            <Table
              columns={columns}
              data={data?.data ?? []}
              keyExtractor={u => u.id}
              emptyMessage="No users found"
            />
          )}
      </div>
      <div className="flex items-center justify-between">
        <Button variant="secondary" size="sm" onClick={prevPage} disabled={page === 1}>← Prev</Button>
        <span className="text-sm text-gray-600 dark:text-gray-400">Page {page} of {totalPages}</span>
        <Button variant="secondary" size="sm" onClick={nextPage} disabled={page === totalPages}>Next →</Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 9: Run users tests**

```bash
npm test src/features/users/__tests__/
```

Expected: PASS — 4 tests

- [ ] **Step 10: Commit**

```bash
git add src/features/users/
git commit -m "feat: users feature — paginated table, search with useDeferredValue, Zustand filters"
```

---

## Task 12: Analytics Feature (TDD)

**Files:**
- Create: `src/features/analytics/hooks/useAnalytics.ts`
- Create: `src/features/analytics/components/KpiCard.tsx`, `RevenueChart.tsx`, `DateRangeFilter.tsx`, `AnalyticsPage.tsx`
- Create: `src/features/analytics/__tests__/useAnalytics.test.ts`, `AnalyticsPage.test.tsx`
- Create: `src/features/analytics/index.ts`

- [ ] **Step 1: Write useAnalytics test**

Create `src/features/analytics/__tests__/useAnalytics.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAnalytics } from '../hooks/useAnalytics'
import { createElement } from 'react'

const wrapper = ({ children }: { children: React.ReactNode }) =>
  createElement(QueryClientProvider, {
    client: new QueryClient({ defaultOptions: { queries: { retry: false } } }),
    children,
  })

describe('useAnalytics', () => {
  it('fetches analytics data and KPIs', async () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 3000 })
    expect(result.current.data?.data).toHaveLength(30)
    expect(result.current.data?.kpis).toHaveLength(4)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test src/features/analytics/__tests__/useAnalytics.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement useAnalytics**

Create `src/features/analytics/hooks/useAnalytics.ts`:
```ts
import { useQuery } from '@tanstack/react-query'
import type { AnalyticsData, KpiMetric } from '../../../shared/types/common'

interface AnalyticsResponse {
  data: AnalyticsData[]
  kpis: KpiMetric[]
}

async function fetchAnalytics(): Promise<AnalyticsResponse> {
  const res = await fetch('/api/analytics')
  if (!res.ok) throw new Error('Failed to fetch analytics')
  return res.json()
}

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics,
    staleTime: 1000 * 60 * 5,
  })
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test src/features/analytics/__tests__/useAnalytics.test.ts
```

Expected: PASS — 1 test

- [ ] **Step 5: Implement KpiCard**

Create `src/features/analytics/components/KpiCard.tsx`:
```tsx
import { formatCurrency, formatNumber, formatPercent } from '../../../shared/utils/formatters'
import type { KpiMetric } from '../../../shared/types/common'
import { clsx } from 'clsx'

export function KpiCard({ label, value, change, unit }: KpiMetric) {
  const formatted = unit === '$' ? formatCurrency(value) : unit === '%' ? `${value}%` : formatNumber(value)
  const isPositive = change >= 0

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{formatted}</p>
      <p className={clsx('mt-1 text-sm font-medium', isPositive ? 'text-green-600' : 'text-red-500')}>
        {formatPercent(change)} vs last month
      </p>
    </div>
  )
}
```

- [ ] **Step 6: Implement RevenueChart**

Create `src/features/analytics/components/RevenueChart.tsx`:
```tsx
import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { AnalyticsData } from '../../../shared/types/common'

interface RevenueChartProps {
  data: AnalyticsData[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = useMemo(
    () => data.map(d => ({ ...d, date: d.date.slice(5) })),
    [data],
  )

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">Revenue (30 days)</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']} />
          <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
```

- [ ] **Step 7: Implement AnalyticsPage with useTransition + Suspense**

Create `src/features/analytics/components/AnalyticsPage.tsx`:
```tsx
import { Suspense, useTransition, useState } from 'react'
import { useAnalytics } from '../hooks/useAnalytics'
import { KpiCard } from './KpiCard'
import { RevenueChart } from './RevenueChart'
import { Skeleton } from '../../../shared/components/Skeleton'
import { Button } from '../../../shared/components/Button'

function AnalyticsContent() {
  const { data } = useAnalytics()
  if (!data) return null

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.kpis.map(kpi => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>
      <RevenueChart data={data.data} />
    </>
  )
}

export default function AnalyticsPage() {
  const [isPending, startTransition] = useTransition()
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d')

  const handleRangeChange = (newRange: '7d' | '30d' | '90d') => {
    startTransition(() => setRange(newRange))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map(r => (
            <Button
              key={r}
              variant={range === r ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleRangeChange(r)}
            >
              {r}
            </Button>
          ))}
        </div>
      </div>
      {isPending && <p className="text-xs text-gray-400">Updating...</p>}
      <Suspense fallback={<Skeleton lines={4} className="h-24" />}>
        <AnalyticsContent />
      </Suspense>
    </div>
  )
}
```

- [ ] **Step 8: Create analytics index**

Create `src/features/analytics/index.ts`:
```ts
export { default as AnalyticsPage } from './components/AnalyticsPage'
export { useAnalytics } from './hooks/useAnalytics'
```

- [ ] **Step 9: Run analytics tests**

```bash
npm test src/features/analytics/__tests__/
```

Expected: PASS

- [ ] **Step 10: Verify in browser**

```bash
npm run dev
```

Login and navigate to `/analytics`. Expected: KPI cards + revenue chart load. Date range buttons work (useTransition — no blocking).

- [ ] **Step 11: Commit**

```bash
git add src/features/analytics/
git commit -m "feat: analytics feature — KPI cards, Recharts, useTransition, Suspense"
```

---

## Task 13: Settings Feature (TDD)

**Files:**
- Create: `src/features/settings/hooks/useSettings.ts`
- Replace: `src/features/settings/components/SettingsPage.tsx`
- Create: `src/features/settings/components/ProfileForm.tsx`
- Create: `src/features/settings/__tests__/ProfileForm.test.tsx`
- Create: `src/features/settings/index.ts`

- [ ] **Step 1: Write ProfileForm tests**

Create `src/features/settings/__tests__/ProfileForm.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProfileForm } from '../components/ProfileForm'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}>
    {children}
  </QueryClientProvider>
)

describe('ProfileForm', () => {
  it('renders name and email fields', () => {
    render(<ProfileForm />, { wrapper })
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('shows validation error on empty name', async () => {
    render(<ProfileForm />, { wrapper })
    await userEvent.clear(screen.getByLabelText(/name/i))
    await userEvent.click(screen.getByRole('button', { name: /save/i }))
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument()
  })

  it('shows success state after save', async () => {
    render(<ProfileForm />, { wrapper })
    await userEvent.type(screen.getByLabelText(/name/i), 'Alice')
    await userEvent.type(screen.getByLabelText(/email/i), 'alice@example.com')
    await userEvent.click(screen.getByRole('button', { name: /save/i }))
    await waitFor(() => {
      expect(screen.queryByText(/saving/i)).not.toBeInTheDocument()
    }, { timeout: 3000 })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test src/features/settings/__tests__/ProfileForm.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Implement useSettings**

Create `src/features/settings/hooks/useSettings.ts`:
```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface ProfileData {
  name: string
  email: string
}

async function updateProfile(data: ProfileData): Promise<ProfileData> {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to save settings')
  const json = await res.json()
  return json.data
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProfile,
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['profile'] })
      const previous = queryClient.getQueryData<ProfileData>(['profile'])
      queryClient.setQueryData(['profile'], newData)
      return { previous }
    },
    onError: (_err, _newData, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['profile'], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
```

- [ ] **Step 4: Implement ProfileForm**

Create `src/features/settings/components/ProfileForm.tsx`:
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUpdateProfile } from '../hooks/useSettings'
import { Input } from '../../../shared/components/Input'
import { Button } from '../../../shared/components/Button'
import { useAuthStore } from '../../auth/store/authStore'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
})

type FormValues = z.infer<typeof schema>

export function ProfileForm() {
  const { user } = useAuthStore()
  const { mutate: save, isPending, isSuccess, isError, error } = useUpdateProfile()

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  })

  return (
    <form onSubmit={handleSubmit(data => save(data))} className="space-y-4 max-w-md">
      <Input id="name" label="Name" error={errors.name?.message} {...register('name')} />
      <Input id="email" label="Email" type="email" error={errors.email?.message} {...register('email')} />
      {isError && <p className="text-sm text-red-500">{error?.message}</p>}
      {isSuccess && <p className="text-sm text-green-600">Saved successfully</p>}
      {isDirty && !isSuccess && (
        <p className="text-xs text-yellow-600">You have unsaved changes</p>
      )}
      <Button type="submit" loading={isPending} disabled={!isDirty}>
        Save changes
      </Button>
    </form>
  )
}
```

- [ ] **Step 5: Implement SettingsPage**

Replace `src/features/settings/components/SettingsPage.tsx`:
```tsx
import { ProfileForm } from './ProfileForm'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">Profile</h2>
        <ProfileForm />
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Create settings index**

Create `src/features/settings/index.ts`:
```ts
export { default as SettingsPage } from './components/SettingsPage'
export { ProfileForm } from './components/ProfileForm'
```

- [ ] **Step 7: Run settings tests**

```bash
npm test src/features/settings/__tests__/ProfileForm.test.tsx
```

Expected: PASS — 3 tests

- [ ] **Step 8: Commit**

```bash
git add src/features/settings/
git commit -m "feat: settings feature — ProfileForm with RHF+Zod, optimistic update, dirty state"
```

---

## Task 14: Notifications Feature (TDD)

**Files:**
- Create: `src/features/notifications/store/notificationsStore.ts`
- Create: `src/features/notifications/components/NotificationList.tsx`, `NotificationItem.tsx`, `NotificationBadge.tsx`
- Create: `src/features/notifications/hooks/useNotifications.ts`
- Create: `src/features/notifications/__tests__/notificationsStore.test.ts`, `NotificationList.test.tsx`
- Create: `src/features/notifications/index.ts`

- [ ] **Step 1: Write notificationsStore tests**

Create `src/features/notifications/__tests__/notificationsStore.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useNotificationsStore } from '../store/notificationsStore'

describe('notificationsStore', () => {
  beforeEach(() => {
    useNotificationsStore.setState({ notifications: [], unreadCount: 0 })
  })

  it('starts empty', () => {
    expect(useNotificationsStore.getState().notifications).toHaveLength(0)
    expect(useNotificationsStore.getState().unreadCount).toBe(0)
  })

  it('adds notification and increments unreadCount', () => {
    useNotificationsStore.getState().addNotification({
      title: 'Test', message: 'Hello', type: 'info',
    })
    expect(useNotificationsStore.getState().notifications).toHaveLength(1)
    expect(useNotificationsStore.getState().unreadCount).toBe(1)
  })

  it('markAsRead decrements unreadCount', () => {
    useNotificationsStore.getState().addNotification({
      title: 'Test', message: 'Hello', type: 'info',
    })
    const id = useNotificationsStore.getState().notifications[0].id
    useNotificationsStore.getState().markAsRead(id)
    expect(useNotificationsStore.getState().unreadCount).toBe(0)
    expect(useNotificationsStore.getState().notifications[0].read).toBe(true)
  })

  it('clearAll removes all notifications', () => {
    useNotificationsStore.getState().addNotification({ title: 'T', message: 'M', type: 'info' })
    useNotificationsStore.getState().clearAll()
    expect(useNotificationsStore.getState().notifications).toHaveLength(0)
    expect(useNotificationsStore.getState().unreadCount).toBe(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test src/features/notifications/__tests__/notificationsStore.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement notificationsStore**

Create `src/features/notifications/store/notificationsStore.ts`:
```ts
import { create } from 'zustand'
import type { Notification } from '../../../shared/types/common'

interface AddNotificationPayload {
  title: string
  message: string
  type: Notification['type']
}

interface NotificationsState {
  notifications: Notification[]
  unreadCount: number
  addNotification: (payload: AddNotificationPayload) => void
  markAsRead: (id: string) => void
  clearAll: () => void
}

export const useNotificationsStore = create<NotificationsState>()((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (payload) =>
    set(s => ({
      notifications: [
        { ...payload, id: crypto.randomUUID(), read: false, createdAt: new Date().toISOString() },
        ...s.notifications,
      ],
      unreadCount: s.unreadCount + 1,
    })),
  markAsRead: (id) =>
    set(s => ({
      notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n),
      unreadCount: Math.max(0, s.unreadCount - (s.notifications.find(n => n.id === id && !n.read) ? 1 : 0)),
    })),
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}))
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test src/features/notifications/__tests__/notificationsStore.test.ts
```

Expected: PASS — 4 tests

- [ ] **Step 5: Write NotificationList test**

Create `src/features/notifications/__tests__/NotificationList.test.tsx`:
```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NotificationList } from '../components/NotificationList'
import { useNotificationsStore } from '../store/notificationsStore'

beforeEach(() => {
  useNotificationsStore.setState({ notifications: [], unreadCount: 0 })
  useNotificationsStore.getState().addNotification({ title: 'Alert', message: 'Something happened', type: 'info' })
})

describe('NotificationList', () => {
  it('renders notifications', () => {
    render(<NotificationList />)
    expect(screen.getByText('Alert')).toBeInTheDocument()
    expect(screen.getByText('Something happened')).toBeInTheDocument()
  })

  it('marks notification as read on click', async () => {
    render(<NotificationList />)
    await userEvent.click(screen.getByText('Alert'))
    expect(useNotificationsStore.getState().unreadCount).toBe(0)
  })

  it('clears all on clear button click', async () => {
    render(<NotificationList />)
    await userEvent.click(screen.getByRole('button', { name: /clear all/i }))
    expect(useNotificationsStore.getState().notifications).toHaveLength(0)
  })
})
```

- [ ] **Step 6: Implement compound notification components**

Create `src/features/notifications/components/NotificationItem.tsx`:
```tsx
import { clsx } from 'clsx'
import type { Notification } from '../../../shared/types/common'
import { Badge } from '../../../shared/components/Badge'

interface NotificationItemProps {
  notification: Notification
  onClick: (id: string) => void
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(notification.id)}
      onKeyDown={e => e.key === 'Enter' && onClick(notification.id)}
      className={clsx(
        'cursor-pointer rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50',
        !notification.read && 'bg-blue-50/50 dark:bg-blue-900/10',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
        <Badge variant={notification.type === 'error' ? 'error' : notification.type === 'warning' ? 'warning' : 'info'}>
          {notification.type}
        </Badge>
      </div>
      <p className="mt-0.5 text-xs text-gray-500">{notification.message}</p>
      {!notification.read && (
        <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
      )}
    </div>
  )
}
```

Create `src/features/notifications/components/NotificationBadge.tsx`:
```tsx
import { useNotificationsStore } from '../store/notificationsStore'

export function NotificationBadge() {
  const count = useNotificationsStore(s => s.unreadCount)
  if (count === 0) return null
  return (
    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
      {count > 9 ? '9+' : count}
    </span>
  )
}
```

Create `src/features/notifications/components/NotificationList.tsx`:
```tsx
import { useNotificationsStore } from '../store/notificationsStore'
import { NotificationItem } from './NotificationItem'
import { Button } from '../../../shared/components/Button'

export function NotificationList() {
  const { notifications, markAsRead, clearAll } = useNotificationsStore()

  return (
    <div className="w-80 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
        <Button variant="ghost" size="sm" onClick={clearAll}>Clear all</Button>
      </div>
      <div className="max-h-80 overflow-y-auto p-2">
        {notifications.length === 0
          ? <p className="p-4 text-center text-sm text-gray-500">No notifications</p>
          : notifications.map(n => (
              <NotificationItem key={n.id} notification={n} onClick={markAsRead} />
            ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Add real-time simulation hook**

Create `src/features/notifications/hooks/useNotifications.ts`:
```ts
import { useEffect } from 'react'
import { useNotificationsStore } from '../store/notificationsStore'

const SAMPLE_NOTIFICATIONS = [
  { title: 'New user registered', message: 'alice@example.com joined', type: 'success' as const },
  { title: 'Server warning', message: 'CPU usage above 80%', type: 'warning' as const },
  { title: 'Payment received', message: '$1,200 from Acme Corp', type: 'info' as const },
  { title: 'Export failed', message: 'PDF export timed out', type: 'error' as const },
]

export function useNotificationSimulator() {
  const { addNotification } = useNotificationsStore()

  useEffect(() => {
    const id = setInterval(() => {
      const sample = SAMPLE_NOTIFICATIONS[Math.floor(Math.random() * SAMPLE_NOTIFICATIONS.length)]
      addNotification(sample)
    }, 15000)
    return () => clearInterval(id)
  }, [addNotification])
}
```

- [ ] **Step 8: Wire NotificationBadge into TopBar**

Update `src/app/layout/TopBar.tsx` — add notification bell with badge:
```tsx
import { useState } from 'react'
import { useUiStore } from '../../store/uiStore'
import { useAuthStore } from '../../features/auth/store/authStore'
import { Button } from '../../shared/components/Button'
import { NotificationBadge } from '../../features/notifications/components/NotificationBadge'
import { NotificationList } from '../../features/notifications/components/NotificationList'
import { useNotificationSimulator } from '../../features/notifications/hooks/useNotifications'

export function TopBar() {
  const { toggleSidebar, toggleDarkMode, darkMode } = useUiStore()
  const { user, logout } = useAuthStore()
  const [showNotifications, setShowNotifications] = useState(false)
  useNotificationSimulator()

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900">
      <Button variant="ghost" size="sm" onClick={toggleSidebar} aria-label="Toggle sidebar">☰</Button>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={toggleDarkMode} aria-label="Toggle dark mode">
          {darkMode ? '☀️' : '🌙'}
        </Button>
        <div className="relative">
          <Button variant="ghost" size="sm" onClick={() => setShowNotifications(v => !v)} aria-label="Notifications">
            🔔
          </Button>
          <NotificationBadge />
          {showNotifications && (
            <div className="absolute right-0 top-10 z-50">
              <NotificationList />
            </div>
          )}
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-300">{user?.name}</span>
        <Button variant="secondary" size="sm" onClick={logout}>Logout</Button>
      </div>
    </header>
  )
}
```

- [ ] **Step 9: Create notifications index**

Create `src/features/notifications/index.ts`:
```ts
export { NotificationList } from './components/NotificationList'
export { NotificationBadge } from './components/NotificationBadge'
export { NotificationItem } from './components/NotificationItem'
export { useNotificationsStore } from './store/notificationsStore'
```

- [ ] **Step 10: Run all notification tests**

```bash
npm test src/features/notifications/__tests__/
```

Expected: PASS — 7 tests

- [ ] **Step 11: Commit**

```bash
git add src/features/notifications/ src/app/layout/TopBar.tsx
git commit -m "feat: notifications — Zustand store, compound components, real-time simulation"
```

---

## Task 15: CSS Notes Documentation

**Files:**
- Create: `docs/css-notes.md`

- [ ] **Step 1: Create CSS reference doc**

Create `docs/css-notes.md`:
```markdown
# CSS Fundamentals Reference

Interview-ready notes with live examples in the dashboard codebase.

---

## Flexbox

Mental model: main axis (default: horizontal) + cross axis (perpendicular).

| Property | Values | Effect |
|---|---|---|
| `display: flex` | — | Activate flex container |
| `flex-direction` | `row` \| `column` | Main axis direction |
| `justify-content` | `flex-start` \| `center` \| `space-between` \| `space-around` | Align on **main** axis |
| `align-items` | `stretch` \| `center` \| `flex-start` \| `flex-end` | Align on **cross** axis |
| `flex-wrap` | `nowrap` \| `wrap` | Allow wrapping |
| `gap` | `8px`, `1rem` | Space between items |
| `flex: 1` | shorthand for `flex-grow: 1 flex-shrink: 1 flex-basis: 0` | Fill remaining space |

**In this codebase:**
- `AppLayout.tsx` — `flex h-screen` (horizontal layout: sidebar + main)
- `TopBar.tsx` — `flex items-center justify-between` (ends of header)
- `KpiCard.tsx` — `flex flex-col` (stacked label/value/change)

---

## CSS Grid

Mental model: 2D layout — rows AND columns simultaneously.

| Property | Example | Effect |
|---|---|---|
| `display: grid` | — | Activate grid container |
| `grid-template-columns` | `repeat(4, 1fr)` | 4 equal columns |
| `grid-template-rows` | `auto 1fr auto` | Header, content, footer |
| `gap` | `1rem` | Gap between all cells |
| `grid-column` | `span 2` | Item spans 2 columns |
| `grid-area` | — | Named placement |

**In this codebase:**
- `AnalyticsPage.tsx` — `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` (KPI cards responsive grid)

**Flexbox vs Grid:**
- Flex: 1D, content-driven, nav bars, card rows
- Grid: 2D, layout-driven, page scaffolding, dashboards

---

## CSS Animations

### Transition (state change)
```css
.button {
  transition: background-color 200ms ease, transform 150ms ease;
}
.button:hover { transform: translateY(-1px); }
```

### Keyframe animation (continuous)
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.spinner { animation: spin 1s linear infinite; }
```

### Tailwind equivalents
- `transition-colors duration-200` — color transitions
- `animate-pulse` — skeleton loaders (opacity oscillation)
- `animate-spin` — loading spinner

**In this codebase:** `Skeleton.tsx` uses `animate-pulse`. `Button.tsx` spinner uses `animate-spin`.

---

## CSS Variables (Custom Properties)

```css
:root { --color-primary: #3b82f6; }
.dark { --color-primary: #60a5fa; }

.button { background: var(--color-primary); }
```

Key points:
- Defined on any element, scoped to subtree
- Cascade and inherit like regular properties
- JavaScript-readable/writable: `el.style.setProperty('--color', 'red')`

**In this codebase:** `index.css` defines `--color-surface` and `--color-bg`. Toggle dark mode adds `.dark` class to root → overrides variables → all components update via `var()`.

---

## Specificity

Calculated as `(inline, id, class/attr/pseudo, element)`:

| Selector | Score |
|---|---|
| `*` | 0-0-0-0 |
| `p` | 0-0-0-1 |
| `.btn` | 0-0-1-0 |
| `#nav` | 0-1-0-0 |
| `style=""` | 1-0-0-0 |
| `!important` | beats everything |

Higher score wins. Equal specificity: last rule wins.

**Gotcha:** Tailwind utility classes all have specificity `0-0-1-0`. Order in stylesheet decides conflicts (Tailwind handles this via PostCSS layer order).

---

## Box Model

```
margin > border > padding > content
```

- `box-sizing: border-box` — padding and border included in width (Tailwind default)
- `box-sizing: content-box` — padding and border added to width (browser default)

---

## Common Interview Questions

**Q: Flex vs Grid?**
Flex is 1D (row or column). Grid is 2D. Use flex for component-level layout, grid for page-level layout.

**Q: How does z-index work?**
Only applies to positioned elements (`relative`, `absolute`, `fixed`, `sticky`). Creates stacking contexts. Parent's z-index caps children.

**Q: What triggers reflow/repaint?**
Reflow (layout recalc): changing width, height, margin, padding, font-size, position. Expensive.
Repaint: changing color, background, visibility. Cheaper.
Compositor-only (cheapest): `transform`, `opacity`. Runs on GPU, no reflow.

**Q: How does `position: sticky` work?**
Behaves like `relative` until scroll threshold, then `fixed` within its scroll container. Requires a defined `top`/`bottom` offset. Breaks if parent has `overflow: hidden`.
```

- [ ] **Step 2: Commit**

```bash
git add docs/css-notes.md
git commit -m "docs: add CSS fundamentals reference (flexbox, grid, animations, variables, specificity)"
```

---

## Task 16: Final Wiring + Smoke Test

**Files:**
- Modify: `src/app/router.tsx` (ensure all lazy imports point to correct paths)

- [ ] **Step 1: Run full test suite**

```bash
npm run test
```

Expected: All tests pass. Note any failures and fix them.

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: Zero errors. Fix any type errors before proceeding.

- [ ] **Step 3: Verify full app in browser**

```bash
npm run dev
```

Walk through every route:
- `/login` — form validation works, demo credentials work
- `/dashboard` (analytics) — KPI cards load, charts render, date range buttons use useTransition
- `/users` — table loads, search debounces, pagination works, dark mode renders correctly
- `/settings` — form loads with user data, save triggers optimistic update
- Notification bell — click to open panel, auto-adds notification every 15s
- Dark mode toggle — all pages update

- [ ] **Step 4: Check coverage**

```bash
npm run test:coverage
```

Expected: ~70%+ coverage across shared hooks, utils, and feature stores.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: final wiring, all features integrated and smoke-tested"
```

---

## Interview Cheat Sheet

Key talking points for each senior frontend topic this project covers:

| Topic | What to say | Point to in code |
|---|---|---|
| **State architecture** | "Server state (TanStack Query) vs client state (Zustand) — never mix them" | `useUsers.ts` + `usersStore.ts` |
| **React 18** | "useTransition keeps UI responsive during expensive state transitions" | `AnalyticsPage.tsx` |
| **Code splitting** | "React.lazy + Suspense per route — each feature is its own bundle chunk" | `router.tsx` |
| **Testing philosophy** | "Test behavior, not implementation. ~70% coverage. Don't snapshot, don't mock internals." | Any `__tests__/` |
| **Compound components** | "Shared context through composition, not prop drilling" | `NotificationList` |
| **Optimistic updates** | "Update UI immediately, rollback on error — TanStack Query onMutate/onError" | `useSettings.ts` |
| **Folder structure** | "Features own their code. Shared is headless. No cross-feature imports." | `/src/features/` |
| **TypeScript generics** | "Table<T>, useQuery<T> — type-safe without duplication" | `Table.tsx` |
| **Dark mode** | "CSS variables on :root and .dark, Tailwind darkMode: class — toggle one class" | `uiStore.ts` + `index.css` |
| **Performance** | "useMemo for expensive transforms, React.memo on list rows, useCallback on handlers passed as props" | `RevenueChart.tsx` |
```
