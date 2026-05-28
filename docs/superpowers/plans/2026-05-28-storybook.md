# Storybook Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Storybook 8 with 10 component stories for learning and interview prep.

**Architecture:** Storybook 8 with `@storybook/react-vite` builder. Stories live in `__stories__/` folders next to components (mirrors the existing `__tests__/` pattern). Tailwind 4 is wired via a CSS import in `.storybook/preview.ts`.

**Tech Stack:** Storybook 8, `@storybook/react-vite`, CSF3 story format, React Router v7 (MemoryRouter decorator for BottomNav), Zustand (store seeding for NotificationBadge)

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `.storybook/main.ts` | Create (via init + edit) | Builder config, story glob |
| `.storybook/preview.ts` | Create (via init + edit) | CSS import, background config |
| `src/shared/components/__stories__/Button.stories.tsx` | Create | Button variants, sizes, states |
| `src/shared/components/__stories__/Input.stories.tsx` | Create | Input variants |
| `src/shared/components/__stories__/Badge.stories.tsx` | Create | Badge color variants |
| `src/shared/components/__stories__/Modal.stories.tsx` | Create | Open/closed modal |
| `src/shared/components/__stories__/Table.stories.tsx` | Create | With data / empty |
| `src/shared/components/__stories__/Skeleton.stories.tsx` | Create | Different sizes/shapes |
| `src/features/analytics/components/__stories__/KpiCard.stories.tsx` | Create | All 4 metric types |
| `src/app/layout/__stories__/BottomNav.stories.tsx` | Create | With MemoryRouter decorator |
| `src/features/notifications/components/__stories__/NotificationBadge.stories.tsx` | Create | 0 count and 6 count |

---

### Task 1: Install Storybook and configure

**Files:**
- Create: `.storybook/main.ts`
- Create: `.storybook/preview.ts`
- Modify: `package.json` (scripts added by init)

- [ ] **Step 1: Create feature branch**

```bash
git checkout -b feat/storybook
```

- [ ] **Step 2: Run Storybook init**

```bash
npx storybook@latest init --yes
```

Expected: installs packages, creates `.storybook/`, creates `src/stories/` boilerplate. Takes 1-2 minutes.

- [ ] **Step 3: Delete boilerplate stories**

```bash
rm -rf src/stories
```

- [ ] **Step 4: Replace .storybook/main.ts**

```ts
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/__stories__/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}

export default config
```

- [ ] **Step 5: Replace .storybook/preview.ts**

```ts
import type { Preview } from '@storybook/react'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f3f4f6' },
        { name: 'dark', value: '#0f172a' },
      ],
    },
  },
}

export default preview
```

- [ ] **Step 6: Verify Storybook starts**

```bash
npm run storybook
```

Expected: browser opens at `http://localhost:6006`, shows empty Storybook (no stories yet). Stop with `Ctrl+C`.

- [ ] **Step 7: Commit**

```bash
git add .storybook package.json package-lock.json
git commit -m "feat(storybook): install Storybook 8 with Vite builder"
```

---

### Task 2: Button stories

**Files:**
- Create: `src/shared/components/__stories__/Button.stories.tsx`

Button props: `variant?: 'primary' | 'secondary' | 'ghost' | 'danger'`, `size?: 'sm' | 'md' | 'lg'`, `loading?: boolean`, `disabled?: boolean`, `children`

- [ ] **Step 1: Create `src/shared/components/__stories__/Button.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../Button'

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Button' },
}
export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { variant: 'primary' },
}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Ghost: Story = {
  args: { variant: 'ghost' },
}

export const Danger: Story = {
  args: { variant: 'danger' },
}

export const Small: Story = {
  args: { size: 'sm' },
}

export const Large: Story = {
  args: { size: 'lg' },
}

export const Loading: Story = {
  args: { loading: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}
```

- [ ] **Step 2: Verify in Storybook**

```bash
npm run storybook
```

Expected: "Button" appears in sidebar with 8 stories. Each renders correctly. Stop with `Ctrl+C`.

- [ ] **Step 3: Commit**

```bash
git add src/shared/components/__stories__/Button.stories.tsx
git commit -m "feat(storybook): add Button stories"
```

---

### Task 3: Input stories

**Files:**
- Create: `src/shared/components/__stories__/Input.stories.tsx`

Input props: `label?: string`, `error?: string`, `placeholder?: string`, `disabled?: boolean`, `value?`

- [ ] **Step 1: Create `src/shared/components/__stories__/Input.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '../Input'

const meta: Meta<typeof Input> = {
  component: Input,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
}

export const WithLabel: Story = {
  args: {
    id: 'email',
    label: 'Email address',
    placeholder: 'you@example.com',
    type: 'email',
  },
}

export const WithValue: Story = {
  args: {
    id: 'name',
    label: 'Full name',
    defaultValue: 'Alice Johnson',
  },
}

export const Error: Story = {
  args: {
    id: 'email-error',
    label: 'Email address',
    defaultValue: 'not-an-email',
    error: 'Please enter a valid email address',
  },
}

export const Disabled: Story = {
  args: {
    id: 'disabled',
    label: 'Username',
    defaultValue: 'admin',
    disabled: true,
  },
}
```

- [ ] **Step 2: Verify in Storybook**

```bash
npm run storybook
```

Expected: "Input" in sidebar with 5 stories. Error story shows red border + error text. Stop with `Ctrl+C`.

- [ ] **Step 3: Commit**

```bash
git add src/shared/components/__stories__/Input.stories.tsx
git commit -m "feat(storybook): add Input stories"
```

---

### Task 4: Badge stories

**Files:**
- Create: `src/shared/components/__stories__/Badge.stories.tsx`

Badge props: `variant?: 'default' | 'success' | 'warning' | 'error' | 'info'`, `children`

- [ ] **Step 1: Create `src/shared/components/__stories__/Badge.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from '../Badge'

const meta: Meta<typeof Badge> = {
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Badge' },
}
export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: { variant: 'default' },
}

export const Success: Story = {
  args: { variant: 'success', children: 'Active' },
}

export const Warning: Story = {
  args: { variant: 'warning', children: 'Pending' },
}

export const Error: Story = {
  args: { variant: 'error', children: 'Failed' },
}

export const Info: Story = {
  args: { variant: 'info', children: 'Info' },
}
```

- [ ] **Step 2: Verify in Storybook**

```bash
npm run storybook
```

Expected: "Badge" with 5 stories, each showing a different color pill. Stop with `Ctrl+C`.

- [ ] **Step 3: Commit**

```bash
git add src/shared/components/__stories__/Badge.stories.tsx
git commit -m "feat(storybook): add Badge stories"
```

---

### Task 5: Modal stories

**Files:**
- Create: `src/shared/components/__stories__/Modal.stories.tsx`

Modal props: `isOpen: boolean`, `onClose: () => void`, `title: string`, `children: ReactNode`

Note: Modal renders `null` when `isOpen=false`. Use Storybook `args` to control state.

- [ ] **Step 1: Create `src/shared/components/__stories__/Modal.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from '../Modal'

const meta: Meta<typeof Modal> = {
  component: Modal,
  tags: ['autodocs'],
  args: {
    onClose: () => {},
    title: 'Confirm action',
    children: (
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Are you sure you want to delete this item? This action cannot be undone.
      </p>
    ),
  },
}
export default meta

type Story = StoryObj<typeof Modal>

export const Open: Story = {
  args: { isOpen: true },
}

export const Closed: Story = {
  args: { isOpen: false },
}
```

- [ ] **Step 2: Verify in Storybook**

```bash
npm run storybook
```

Expected: "Modal" with 2 stories. Open shows the modal overlay. Closed shows nothing (Modal returns null). Stop with `Ctrl+C`.

- [ ] **Step 3: Commit**

```bash
git add src/shared/components/__stories__/Modal.stories.tsx
git commit -m "feat(storybook): add Modal stories"
```

---

### Task 6: Table stories

**Files:**
- Create: `src/shared/components/__stories__/Table.stories.tsx`

Table props: `columns: Column<T>[]`, `data: T[]`, `keyExtractor: (row: T) => string`, `emptyMessage?: string`, `isLoading?: boolean`

- [ ] **Step 1: Create `src/shared/components/__stories__/Table.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Table } from '../Table'

interface User {
  id: string
  name: string
  email: string
  role: string
}

const columns = [
  { key: 'name' as const, header: 'Name' },
  { key: 'email' as const, header: 'Email' },
  { key: 'role' as const, header: 'Role' },
]

const sampleData: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', role: 'Viewer' },
]

const meta: Meta<typeof Table<User>> = {
  component: Table,
  tags: ['autodocs'],
  args: {
    columns,
    keyExtractor: (row) => row.id,
  },
}
export default meta

type Story = StoryObj<typeof Table<User>>

export const WithData: Story = {
  args: { data: sampleData },
}

export const Empty: Story = {
  args: { data: [], emptyMessage: 'No users found' },
}

export const Loading: Story = {
  args: { data: [], isLoading: true },
}
```

- [ ] **Step 2: Verify in Storybook**

```bash
npm run storybook
```

Expected: "Table" with 3 stories. WithData shows 3 rows, Empty shows "No users found", Loading shows pulse skeletons. Stop with `Ctrl+C`.

- [ ] **Step 3: Commit**

```bash
git add src/shared/components/__stories__/Table.stories.tsx
git commit -m "feat(storybook): add Table stories"
```

---

### Task 7: Skeleton stories

**Files:**
- Create: `src/shared/components/__stories__/Skeleton.stories.tsx`

Skeleton props: `className?: string`, `lines?: number`

- [ ] **Step 1: Create `src/shared/components/__stories__/Skeleton.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from '../Skeleton'

const meta: Meta<typeof Skeleton> = {
  component: Skeleton,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Skeleton>

export const SingleLine: Story = {
  args: {},
}

export const MultiLine: Story = {
  args: { lines: 4 },
}

export const Card: Story = {
  args: { className: 'h-32 w-64' },
}

export const Avatar: Story = {
  args: { className: 'h-12 w-12 rounded-full' },
}
```

- [ ] **Step 2: Verify in Storybook**

```bash
npm run storybook
```

Expected: "Skeleton" with 4 stories, all showing pulsing gray shapes. Stop with `Ctrl+C`.

- [ ] **Step 3: Commit**

```bash
git add src/shared/components/__stories__/Skeleton.stories.tsx
git commit -m "feat(storybook): add Skeleton stories"
```

---

### Task 8: KpiCard stories

**Files:**
- Create: `src/features/analytics/components/__stories__/KpiCard.stories.tsx`

KpiCard props: `metric: KpiMetric` where `KpiMetric = { label: string, value: number, change: number, unit?: string }`

- [ ] **Step 1: Create `src/features/analytics/components/__stories__/KpiCard.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { KpiCard } from '../KpiCard'

const meta: Meta<typeof KpiCard> = {
  component: KpiCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof KpiCard>

export const Revenue: Story = {
  args: {
    metric: { label: 'Total Revenue', value: 284500, change: 12.5, unit: '$' },
  },
}

export const Users: Story = {
  args: {
    metric: { label: 'Active Users', value: 12340, change: -3.2, unit: '' },
  },
}

export const Conversion: Story = {
  args: {
    metric: { label: 'Conversion Rate', value: 3.8, change: 0.6, unit: '%' },
  },
}

export const Session: Story = {
  args: {
    metric: { label: 'Avg Session', value: 4.2, change: 8.1, unit: 'min' },
  },
}

export const NegativeChange: Story = {
  args: {
    metric: { label: 'Total Revenue', value: 198000, change: -8.3, unit: '$' },
  },
}
```

- [ ] **Step 2: Verify in Storybook**

```bash
npm run storybook
```

Expected: "KpiCard" with 5 stories. Revenue/Conversion/Session show green change, Users/NegativeChange show red. Stop with `Ctrl+C`.

- [ ] **Step 3: Commit**

```bash
git add src/features/analytics/components/__stories__/KpiCard.stories.tsx
git commit -m "feat(storybook): add KpiCard stories"
```

---

### Task 9: BottomNav stories

**Files:**
- Create: `src/app/layout/__stories__/BottomNav.stories.tsx`

BottomNav props: `onMoreClick: () => void`

Requires `MemoryRouter` because it uses `NavLink` from react-router-dom.

- [ ] **Step 1: Create `src/app/layout/__stories__/BottomNav.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { BottomNav } from '../BottomNav'

const meta: Meta<typeof BottomNav> = {
  component: BottomNav,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/dashboard']}>
        <div className="relative h-24">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  args: { onMoreClick: () => {} },
}
export default meta

type Story = StoryObj<typeof BottomNav>

export const Default: Story = {}

export const AnalyticsActive: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/analytics']}>
        <div className="relative h-24">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
}

export const SettingsActive: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/settings']}>
        <div className="relative h-24">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
}
```

Note: `BottomNav` is `fixed bottom-0` so the decorator wraps it in a positioned container to make it visible in the Storybook canvas.

- [ ] **Step 2: Verify in Storybook**

```bash
npm run storybook
```

Expected: "BottomNav" with 3 stories. Default shows Dashboard tab active. AnalyticsActive shows Analytics tab highlighted blue. Stop with `Ctrl+C`.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout/__stories__/BottomNav.stories.tsx
git commit -m "feat(storybook): add BottomNav stories"
```

---

### Task 10: NotificationBadge stories

**Files:**
- Create: `src/features/notifications/components/__stories__/NotificationBadge.stories.tsx`

`NotificationBadge` uses `useNotificationsStore` internally to get `unreadCount()`. Seed the Zustand store in a decorator to control the count shown.

- [ ] **Step 1: Create `src/features/notifications/components/__stories__/NotificationBadge.stories.tsx`**

```tsx
import type { Decorator, Meta, StoryObj } from '@storybook/react'
import { NotificationBadge } from '../NotificationList'
import { useNotificationsStore } from '../../store/notificationsStore'

const withCount = (count: number): Decorator =>
  (Story) => {
    useNotificationsStore.setState({
      notifications: Array.from({ length: count }, (_, i) => ({
        id: String(i),
        title: `Notification ${i + 1}`,
        message: 'Something happened that requires your attention.',
        type: 'info' as const,
        read: false,
        createdAt: new Date().toISOString(),
      })),
    })
    return <Story />
  }

const meta: Meta<typeof NotificationBadge> = {
  component: NotificationBadge,
  tags: ['autodocs'],
  args: { onClick: () => {}, isOpen: false },
}
export default meta

type Story = StoryObj<typeof NotificationBadge>

export const NoCount: Story = {
  decorators: [withCount(0)],
}

export const WithCount: Story = {
  decorators: [withCount(6)],
}

export const MaxCount: Story = {
  decorators: [withCount(12)],
}
```

- [ ] **Step 2: Verify in Storybook**

```bash
npm run storybook
```

Expected: "NotificationBadge" with 3 stories. NoCount shows bell with no badge. WithCount shows red badge with "6". MaxCount shows "9+". Stop with `Ctrl+C`.

- [ ] **Step 3: Commit**

```bash
git add src/features/notifications/components/__stories__/NotificationBadge.stories.tsx
git commit -m "feat(storybook): add NotificationBadge stories"
```

---

### Task 11: Verify build and finish

- [ ] **Step 1: Run existing tests — must all still pass**

```bash
npm test -- --run
```

Expected: 192 tests passing, 0 failures.

- [ ] **Step 2: Build Storybook static output**

```bash
npm run build-storybook
```

Expected: `storybook-static/` folder created, no errors.

- [ ] **Step 3: Delete build output (not committed)**

```bash
rm -rf storybook-static
```

- [ ] **Step 4: Add storybook-static to .gitignore**

Open `.gitignore`, add:
```
storybook-static
```

- [ ] **Step 5: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore storybook-static build output"
```
