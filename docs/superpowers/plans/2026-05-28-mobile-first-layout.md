# Mobile-First Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a mobile bottom tab bar (< 768px) that replaces the left sidebar on small screens, with a slide-up "More" sheet for overflow nav items.

**Architecture:** New `navItems.ts` shared constant feeds Sidebar, BottomNav, and TopBar. Two new components — `BottomNav` and `BottomSheet` — are self-hiding on desktop via `md:hidden`. Sidebar gains `hidden md:flex`. AppLayout owns bottom sheet open/close state as local `useState`. Zero desktop behavior changes.

**Tech Stack:** React 18, React Router v7, Tailwind 4, clsx, Vitest + React Testing Library

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/app/layout/navItems.ts` | Create | Shared nav item definitions: all 9, primary 4, more 5 |
| `src/app/layout/BottomNav.tsx` | Create | Fixed bottom bar, 4 tabs + More button, `md:hidden` |
| `src/app/layout/BottomSheet.tsx` | Create | Slide-up overlay with overflow nav items, `md:hidden` |
| `src/app/layout/Sidebar.tsx` | Modify | Import from navItems.ts, add `hidden md:flex` |
| `src/app/layout/TopBar.tsx` | Modify | Hide hamburger on mobile, show page title on mobile |
| `src/app/layout/AppLayout.tsx` | Modify | Add BottomNav + BottomSheet, add `pb-16 md:pb-0` to main |
| `src/app/layout/__tests__/BottomNav.test.tsx` | Create | Unit tests for BottomNav |
| `src/app/layout/__tests__/BottomSheet.test.tsx` | Create | Unit tests for BottomSheet |

---

### Task 1: Extract navItems to shared constant and update Sidebar

**Files:**
- Create: `src/app/layout/navItems.ts`
- Modify: `src/app/layout/Sidebar.tsx`

- [ ] **Step 1: Create src/app/layout/navItems.ts**

```ts
export interface NavItem {
  to: string
  label: string
  icon: string
}

export const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/users', label: 'Users', icon: '👥' },
  { to: '/analytics', label: 'Analytics', icon: '📈' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
  { to: '/css-examples', label: 'CSS Examples', icon: '🎨' },
  { to: '/react-demos', label: 'React Demos', icon: '⚛️' },
  { to: '/chat', label: 'Chat Demo', icon: '💬' },
  { to: '/performance', label: 'Performance', icon: '⚡' },
  { to: '/accessibility', label: 'Accessibility', icon: '♿' },
]

export const primaryNavItems: NavItem[] = [
  navItems[0], // Dashboard
  navItems[2], // Analytics
  navItems[5], // React Demos
  navItems[3], // Settings
]

export const moreNavItems: NavItem[] = [
  navItems[1], // Users
  navItems[4], // CSS Examples
  navItems[6], // Chat Demo
  navItems[7], // Performance
  navItems[8], // Accessibility
]
```

- [ ] **Step 2: Update src/app/layout/Sidebar.tsx**

Replace the entire file:

```tsx
import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import { navItems } from './navItems'

interface SidebarProps {
  isOpen: boolean
}

export function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside
      className={clsx(
        'hidden h-screen flex-col border-r border-gray-200 bg-white transition-all dark:border-gray-700 dark:bg-gray-900 md:flex',
        isOpen ? 'w-56' : 'w-16'
      )}
    >
      <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <span className="text-lg font-bold text-blue-600">{isOpen ? 'Dashboard' : 'D'}</span>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
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

Key change: `flex h-screen flex-col` → `hidden h-screen flex-col ... md:flex` (hidden on mobile, flex on desktop).

- [ ] **Step 3: Verify TypeScript passes**

```bash
npx tsc --noEmit
```

Expected: no output (clean).

- [ ] **Step 4: Verify existing tests still pass**

```bash
npm test -- --run
```

Expected: 40 files, 183 tests, all passing.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout/navItems.ts src/app/layout/Sidebar.tsx
git commit -m "refactor(layout): extract navItems constant, hide Sidebar on mobile"
```

---

### Task 2: Create BottomNav component

**Files:**
- Create: `src/app/layout/BottomNav.tsx`
- Create: `src/app/layout/__tests__/BottomNav.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/app/layout/__tests__/BottomNav.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { BottomNav } from '../BottomNav'

function renderBottomNav(onMoreClick = vi.fn()) {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <BottomNav onMoreClick={onMoreClick} />
    </MemoryRouter>
  )
}

describe('BottomNav', () => {
  it('renders 4 primary nav links', () => {
    renderBottomNav()
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /analytics/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /react demos/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument()
  })

  it('renders More button', () => {
    renderBottomNav()
    expect(screen.getByRole('button', { name: /more navigation items/i })).toBeInTheDocument()
  })

  it('calls onMoreClick when More button is clicked', async () => {
    const onMoreClick = vi.fn()
    renderBottomNav(onMoreClick)
    await userEvent.click(screen.getByRole('button', { name: /more navigation items/i }))
    expect(onMoreClick).toHaveBeenCalledOnce()
  })

  it('has md:hidden class to hide on desktop', () => {
    const { container } = renderBottomNav()
    expect(container.firstChild).toHaveClass('md:hidden')
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- --run src/app/layout/__tests__/BottomNav.test.tsx
```

Expected: FAIL — `BottomNav` not found.

- [ ] **Step 3: Create src/app/layout/BottomNav.tsx**

```tsx
import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import { primaryNavItems } from './navItems'

interface BottomNavProps {
  onMoreClick: () => void
}

export function BottomNav({ onMoreClick }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 md:hidden">
      {primaryNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          aria-label={item.label}
          className={({ isActive }) =>
            clsx(
              'flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-medium transition-colors',
              isActive
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            )
          }
        >
          <span className="text-lg leading-none">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
      <button
        onClick={onMoreClick}
        aria-label="More navigation items"
        className="flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <span className="text-lg leading-none">•••</span>
        <span>More</span>
      </button>
    </nav>
  )
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- --run src/app/layout/__tests__/BottomNav.test.tsx
```

Expected: 4 tests passing.

- [ ] **Step 5: Verify all tests still pass**

```bash
npm test -- --run
```

Expected: 40+ files, all passing.

- [ ] **Step 6: Commit**

```bash
git add src/app/layout/BottomNav.tsx src/app/layout/__tests__/BottomNav.test.tsx
git commit -m "feat(layout): add BottomNav component for mobile"
```

---

### Task 3: Create BottomSheet component

**Files:**
- Create: `src/app/layout/BottomSheet.tsx`
- Create: `src/app/layout/__tests__/BottomSheet.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/app/layout/__tests__/BottomSheet.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { BottomSheet } from '../BottomSheet'

function renderSheet(isOpen: boolean, onClose = vi.fn()) {
  return render(
    <MemoryRouter>
      <BottomSheet isOpen={isOpen} onClose={onClose} />
    </MemoryRouter>
  )
}

describe('BottomSheet', () => {
  it('renders all 5 overflow nav items', () => {
    renderSheet(true)
    expect(screen.getByRole('link', { name: /users/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /css examples/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /chat demo/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /performance/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /accessibility/i })).toBeInTheDocument()
  })

  it('applies translate-y-0 when open', () => {
    renderSheet(true)
    const sheet = screen.getByRole('navigation')
    expect(sheet).toHaveClass('translate-y-0')
  })

  it('applies translate-y-full when closed', () => {
    renderSheet(false)
    const sheet = screen.getByRole('navigation')
    expect(sheet).toHaveClass('translate-y-full')
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn()
    renderSheet(true, onClose)
    await userEvent.click(screen.getByRole('presentation'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when a nav item is clicked', async () => {
    const onClose = vi.fn()
    renderSheet(true, onClose)
    await userEvent.click(screen.getByRole('link', { name: /users/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- --run src/app/layout/__tests__/BottomSheet.test.tsx
```

Expected: FAIL — `BottomSheet` not found.

- [ ] **Step 3: Create src/app/layout/BottomSheet.tsx**

```tsx
import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import { moreNavItems } from './navItems'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function BottomSheet({ isOpen, onClose }: BottomSheetProps) {
  return (
    <>
      <div
        role="presentation"
        className={clsx(
          'fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />
      <nav
        className={clsx(
          'fixed bottom-16 left-0 right-0 z-50 rounded-t-xl border-t border-gray-200 bg-white transition-transform duration-300 dark:border-gray-700 dark:bg-gray-900 md:hidden',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="flex justify-center py-2">
          <div className="h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
        <div className="p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            More
          </p>
          <div className="grid grid-cols-2 gap-2">
            {moreNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                aria-label={item.label}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-2 rounded-lg p-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  )
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- --run src/app/layout/__tests__/BottomSheet.test.tsx
```

Expected: 5 tests passing.

- [ ] **Step 5: Verify all tests still pass**

```bash
npm test -- --run
```

Expected: all passing.

- [ ] **Step 6: Commit**

```bash
git add src/app/layout/BottomSheet.tsx src/app/layout/__tests__/BottomSheet.test.tsx
git commit -m "feat(layout): add BottomSheet component for mobile overflow nav"
```

---

### Task 4: Update TopBar — hide hamburger, show page title on mobile

**Files:**
- Modify: `src/app/layout/TopBar.tsx`

- [ ] **Step 1: Replace src/app/layout/TopBar.tsx**

```tsx
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useUiStore } from '../../store/uiStore'
import { useAuthStore } from '../../features/auth/store/authStore'
import { Button } from '../../shared/components/Button'
import { NotificationBadge, NotificationList } from '../../features/notifications/components/NotificationList'
import { useNotificationSimulator } from '../../features/notifications/hooks/useNotificationSimulator'
import { navItems } from './navItems'

export function TopBar() {
  const { toggleSidebar, toggleDarkMode, darkMode } = useUiStore()
  const { user, logout } = useAuthStore()
  const { pathname } = useLocation()
  const [notifOpen, setNotifOpen] = useState(false)

  useNotificationSimulator()

  const pageTitle = navItems.find((item) => pathname.startsWith(item.to))?.label ?? 'Dashboard'

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="hidden md:inline-flex"
        >
          ☰
        </Button>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 md:hidden">
          {pageTitle}
        </span>
      </div>
      <div className="relative flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={toggleDarkMode} aria-label="Toggle dark mode">
          {darkMode ? '☀️' : '🌙'}
        </Button>
        <NotificationBadge
          onClick={() => setNotifOpen((o) => !o)}
          isOpen={notifOpen}
        />
        <NotificationList isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
        <span className="text-sm text-gray-700 dark:text-gray-300">{user?.name}</span>
        <Button variant="secondary" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Verify TypeScript passes**

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 3: Verify all tests pass**

```bash
npm test -- --run
```

Expected: all passing.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout/TopBar.tsx
git commit -m "feat(layout): hide hamburger on mobile, show page title in TopBar"
```

---

### Task 5: Wire AppLayout — add BottomNav, BottomSheet, and bottom padding

**Files:**
- Modify: `src/app/layout/AppLayout.tsx`

- [ ] **Step 1: Replace src/app/layout/AppLayout.tsx**

```tsx
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useUiStore } from '../../store/uiStore'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { BottomSheet } from './BottomSheet'

export function AppLayout() {
  const { sidebarOpen, darkMode } = useUiStore()
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex h-screen bg-[var(--color-bg)]">
        <Sidebar isOpen={sidebarOpen} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">
            <Outlet />
          </main>
        </div>
      </div>
      <BottomNav onMoreClick={() => setSheetOpen(true)} />
      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  )
}
```

Note: `pb-20` (80px) gives clearance above the 64px (`h-16`) bottom nav. `md:pb-6` restores normal desktop padding.

- [ ] **Step 2: Verify TypeScript passes**

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 3: Verify all tests pass**

```bash
npm test -- --run
```

Expected: all passing.

- [ ] **Step 4: Manual verification — resize browser**

Run `npm run dev`, open `http://localhost:5173/playGround-react/`, login.

Check:
- Desktop (> 768px): sidebar visible, hamburger visible, bottom nav absent
- Mobile (< 768px): sidebar hidden, bottom nav visible, page title in topbar
- Tap "More" → sheet slides up with 5 items
- Tap item in sheet → navigates, sheet closes
- Tap backdrop → sheet closes
- Dark mode toggle works on mobile

- [ ] **Step 5: Commit**

```bash
git add src/app/layout/AppLayout.tsx
git commit -m "feat(layout): wire BottomNav and BottomSheet into AppLayout"
```
