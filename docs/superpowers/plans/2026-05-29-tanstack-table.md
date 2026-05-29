# TanStack Table Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `TanStackTableSection` demo to the React Demos page showcasing TanStack Table v8 with sorting, global filtering, pagination, column visibility, and row selection.

**Architecture:** Single self-contained component `TanStackTableSection` with 20 hard-coded employee rows. All table state managed with `useState`. Wired into `ReactDemosPage` alongside existing demo sections. Matches the `VirtualizationSection` pattern — no API, no store.

**Tech Stack:** `@tanstack/react-table` v8, React 18 `useState`, existing shared `Input`/`Button`/`Badge` components, Tailwind 4, clsx

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/features/react-demos/components/TanStackTableSection.tsx` | Create | Self-contained demo with all 5 features |
| `src/features/react-demos/components/__tests__/TanStackTableSection.test.tsx` | Create | Behavioral tests for all 5 features |
| `src/features/react-demos/components/ReactDemosPage.tsx` | Modify | Add `<TanStackTableSection />` |
| `src/features/react-demos/components/__tests__/ReactDemosPage.test.tsx` | Modify | Add heading assertion |
| `src/features/react-demos/components/__stories__/TanStackTableSection.stories.tsx` | Create | Default story |
| `package.json` + `package-lock.json` | Modify | Add `@tanstack/react-table` |

---

### Task 1: Install @tanstack/react-table

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

```bash
npm install @tanstack/react-table
```

Expected: package added to `dependencies`, no errors.

- [ ] **Step 2: Verify TypeScript resolves types**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(tanstack-table): install @tanstack/react-table"
```

---

### Task 2: Write failing tests

**Files:**
- Create: `src/features/react-demos/components/__tests__/TanStackTableSection.test.tsx`

Write the full test suite before implementing. All tests will fail — that is expected.

Employee page-order reference (used to write correct assertions):
- Page 1 (default order): Mia Nelson, Bob Carter, Tina Underwood, Alice Brown, Quinn Reed
- Page 2: Frank Green, Grace Hall, Henry Irving, Carol Davis, Jack King
- Name sort ASC page 1: Alice Brown, Bob Carter, Carol Davis, Dan Evans, Eve Foster
- Name sort DESC page 1: Tina Underwood, Sam Turner, Rachel Stone, Quinn Reed, Paul Quinn

- [ ] **Step 1: Create the test file**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TanStackTableSection } from '../TanStackTableSection'

describe('TanStackTableSection', () => {
  it('renders section heading', () => {
    render(<TanStackTableSection />)
    expect(screen.getByRole('heading', { name: /tanstack table/i })).toBeInTheDocument()
  })

  it('shows 5 rows on first page', () => {
    render(<TanStackTableSection />)
    // getAllByRole('row') returns header row + 5 data rows = 6
    expect(screen.getAllByRole('row').length - 1).toBe(5)
  })

  it('first row on page 1 is Mia Nelson by default', () => {
    render(<TanStackTableSection />)
    const rows = screen.getAllByRole('row')
    expect(within(rows[1]).getByText('Mia Nelson')).toBeInTheDocument()
  })

  it('clicking name header once sorts ascending — Alice Brown is first', async () => {
    render(<TanStackTableSection />)
    await userEvent.click(screen.getByTestId('col-header-name'))
    const rows = screen.getAllByRole('row')
    expect(within(rows[1]).getByText('Alice Brown')).toBeInTheDocument()
  })

  it('clicking name header twice sorts descending — Tina Underwood is first', async () => {
    render(<TanStackTableSection />)
    await userEvent.click(screen.getByTestId('col-header-name'))
    await userEvent.click(screen.getByTestId('col-header-name'))
    const rows = screen.getAllByRole('row')
    expect(within(rows[1]).getByText('Tina Underwood')).toBeInTheDocument()
  })

  it('global filter shows matching row and hides non-matching', async () => {
    render(<TanStackTableSection />)
    await userEvent.type(screen.getByTestId('global-filter'), 'Alice')
    expect(screen.getByText('Alice Brown')).toBeInTheDocument()
    expect(screen.queryByText('Bob Carter')).not.toBeInTheDocument()
  })

  it('global filter resets to page 1', async () => {
    render(<TanStackTableSection />)
    await userEvent.click(screen.getByTestId('next-page'))
    await userEvent.type(screen.getByTestId('global-filter'), 'Alice')
    expect(screen.getByTestId('page-info')).toHaveTextContent('Page 1')
  })

  it('next page shows page 2 rows', async () => {
    render(<TanStackTableSection />)
    await userEvent.click(screen.getByTestId('next-page'))
    expect(screen.queryByText('Mia Nelson')).not.toBeInTheDocument()
    expect(screen.getByText('Frank Green')).toBeInTheDocument()
  })

  it('prev button is disabled on first page', () => {
    render(<TanStackTableSection />)
    expect(screen.getByTestId('prev-page')).toBeDisabled()
  })

  it('next button is disabled on last page', async () => {
    render(<TanStackTableSection />)
    // 20 rows / 5 per page = 4 pages; click next 3 times
    await userEvent.click(screen.getByTestId('next-page'))
    await userEvent.click(screen.getByTestId('next-page'))
    await userEvent.click(screen.getByTestId('next-page'))
    expect(screen.getByTestId('next-page')).toBeDisabled()
  })

  it('page info shows correct page and total', () => {
    render(<TanStackTableSection />)
    expect(screen.getByTestId('page-info')).toHaveTextContent('Page 1 of 4')
    expect(screen.getByTestId('page-info')).toHaveTextContent('20 employees')
  })

  it('unchecking name column removes name column header', async () => {
    render(<TanStackTableSection />)
    await userEvent.click(screen.getByRole('checkbox', { name: /toggle name column/i }))
    expect(screen.queryByTestId('col-header-name')).not.toBeInTheDocument()
  })

  it('selected count is empty when no rows selected', () => {
    render(<TanStackTableSection />)
    expect(screen.getByTestId('selected-count')).toHaveTextContent('')
  })

  it('selecting a row shows selected count', async () => {
    render(<TanStackTableSection />)
    await userEvent.click(screen.getByRole('checkbox', { name: /select mia nelson/i }))
    expect(screen.getByTestId('selected-count')).toHaveTextContent('1 selected')
  })

  it('select-all checkbox selects all 5 visible rows', async () => {
    render(<TanStackTableSection />)
    await userEvent.click(screen.getByRole('checkbox', { name: /select all/i }))
    expect(screen.getByTestId('selected-count')).toHaveTextContent('5 selected')
  })
})
```

- [ ] **Step 2: Run tests to confirm they all fail**

```bash
npx vitest run src/features/react-demos/components/__tests__/TanStackTableSection.test.tsx
```

Expected: all 14 tests FAIL with "Cannot find module" or "TanStackTableSection is not a function".

- [ ] **Step 3: Commit failing tests**

```bash
git add src/features/react-demos/components/__tests__/TanStackTableSection.test.tsx
git commit -m "test(tanstack-table): add failing tests for TanStackTableSection"
```

---

### Task 3: Implement TanStackTableSection

**Files:**
- Create: `src/features/react-demos/components/TanStackTableSection.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
} from '@tanstack/react-table'
import { clsx } from 'clsx'
import { Input } from '../../../shared/components/Input'
import { Button } from '../../../shared/components/Button'
import { Badge } from '../../../shared/components/Badge'

interface Employee {
  id: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
  department: string
  status: 'active' | 'inactive'
  salary: number
}

const EMPLOYEES: Employee[] = [
  { id: '1',  name: 'Mia Nelson',     role: 'admin',  department: 'Engineering', status: 'active',   salary: 125000 },
  { id: '2',  name: 'Bob Carter',     role: 'editor', department: 'Design',      status: 'active',   salary: 95000  },
  { id: '3',  name: 'Tina Underwood', role: 'editor', department: 'Product',     status: 'active',   salary: 94000  },
  { id: '4',  name: 'Alice Brown',    role: 'admin',  department: 'Engineering', status: 'active',   salary: 120000 },
  { id: '5',  name: 'Quinn Reed',     role: 'editor', department: 'Engineering', status: 'active',   salary: 96000  },
  { id: '6',  name: 'Frank Green',    role: 'viewer', department: 'Design',      status: 'inactive', salary: 68000  },
  { id: '7',  name: 'Grace Hall',     role: 'admin',  department: 'Marketing',   status: 'active',   salary: 130000 },
  { id: '8',  name: 'Henry Irving',   role: 'editor', department: 'Product',     status: 'active',   salary: 92000  },
  { id: '9',  name: 'Carol Davis',    role: 'viewer', department: 'Marketing',   status: 'inactive', salary: 72000  },
  { id: '10', name: 'Jack King',      role: 'admin',  department: 'Design',      status: 'inactive', salary: 110000 },
  { id: '11', name: 'Kate Lane',      role: 'editor', department: 'Marketing',   status: 'active',   salary: 88000  },
  { id: '12', name: 'Leo Martin',     role: 'viewer', department: 'Product',     status: 'active',   salary: 71000  },
  { id: '13', name: 'Dan Evans',      role: 'admin',  department: 'Product',     status: 'active',   salary: 115000 },
  { id: '14', name: 'Nick Owen',      role: 'editor', department: 'Design',      status: 'inactive', salary: 90000  },
  { id: '15', name: 'Olivia Park',    role: 'viewer', department: 'Marketing',   status: 'active',   salary: 69000  },
  { id: '16', name: 'Paul Quinn',     role: 'admin',  department: 'Product',     status: 'active',   salary: 118000 },
  { id: '17', name: 'Eve Foster',     role: 'editor', department: 'Engineering', status: 'active',   salary: 98000  },
  { id: '18', name: 'Rachel Stone',   role: 'viewer', department: 'Design',      status: 'inactive', salary: 73000  },
  { id: '19', name: 'Sam Turner',     role: 'admin',  department: 'Marketing',   status: 'active',   salary: 122000 },
  { id: '20', name: 'Iris Johnson',   role: 'viewer', department: 'Engineering', status: 'active',   salary: 75000  },
]

const PAGE_SIZE = 5

const columns: ColumnDef<Employee>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        aria-label="Select all"
        className="cursor-pointer"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        aria-label={`Select ${row.original.name}`}
        className="cursor-pointer"
      />
    ),
    enableSorting: false,
    enableGlobalFilter: false,
  },
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ getValue }) => {
      const role = getValue<string>()
      return (
        <Badge variant={role === 'admin' ? 'info' : role === 'editor' ? 'success' : 'default'}>
          {role}
        </Badge>
      )
    },
  },
  { accessorKey: 'department', header: 'Department' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<string>()
      return <Badge variant={status === 'active' ? 'success' : 'error'}>{status}</Badge>
    },
  },
  {
    accessorKey: 'salary',
    header: 'Salary',
    cell: ({ getValue }) => `$${(getValue<number>() / 1000).toFixed(0)}k`,
  },
]

export function TanStackTableSection() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const table = useReactTable({
    data: EMPLOYEES,
    columns,
    state: { sorting, globalFilter, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  })

  const selectedCount = Object.keys(rowSelection).length

  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">TanStack Table</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Headless table built with TanStack Table v8. Sorting, global filtering, pagination, column
        visibility, and row selection — all composed from primitives.
      </p>

      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <Input
          placeholder="Search all columns…"
          value={globalFilter}
          onChange={(e) => {
            setGlobalFilter(e.target.value)
            table.setPageIndex(0)
          }}
          className="w-56"
          data-testid="global-filter"
        />
        <div className="flex flex-wrap gap-x-4 gap-y-1" data-testid="column-visibility">
          {table
            .getAllLeafColumns()
            .filter((col) => col.id !== 'select')
            .map((column) => (
              <label
                key={column.id}
                className="flex cursor-pointer items-center gap-1 text-sm text-gray-700 dark:text-gray-300"
              >
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                  aria-label={`Toggle ${column.id} column`}
                  className="cursor-pointer"
                />
                {column.id.charAt(0).toUpperCase() + column.id.slice(1)}
              </label>
            ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm" data-testid="tanstack-table">
          <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    data-testid={`col-header-${header.id}`}
                    className={clsx(
                      'px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400',
                      header.column.getCanSort() && 'cursor-pointer select-none'
                    )}
                    onClick={
                      header.column.getCanSort()
                        ? () => header.column.toggleSorting()
                        : undefined
                    }
                  >
                    {header.isPlaceholder ? null : (
                      <span className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="text-xs text-gray-400">
                            {header.column.getIsSorted() === 'asc'
                              ? '↑'
                              : header.column.getIsSorted() === 'desc'
                                ? '↓'
                                : '↕'}
                          </span>
                        )}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={clsx(
                  'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                  row.getIsSelected() && 'bg-blue-50 dark:bg-blue-900/20'
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 dark:text-gray-300">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span data-testid="selected-count" className="min-w-[6rem]">
          {selectedCount > 0 ? `${selectedCount} selected` : ''}
        </span>
        <div className="flex items-center gap-3">
          <span data-testid="page-info">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} —{' '}
            {table.getFilteredRowModel().rows.length} employees
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            data-testid="prev-page"
          >
            ← Prev
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            data-testid="next-page"
          >
            Next →
          </Button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Run tests**

```bash
npx vitest run src/features/react-demos/components/__tests__/TanStackTableSection.test.tsx
```

Expected: all 14 tests PASS.

- [ ] **Step 3: Run full suite to check no regressions**

```bash
npm test -- --run
```

Expected: all tests pass (230 + 14 = 244 total).

- [ ] **Step 4: Commit**

```bash
git add src/features/react-demos/components/TanStackTableSection.tsx
git commit -m "feat(tanstack-table): implement TanStackTableSection with all 5 features"
```

---

### Task 4: Wire into ReactDemosPage

**Files:**
- Modify: `src/features/react-demos/components/ReactDemosPage.tsx`
- Modify: `src/features/react-demos/components/__tests__/ReactDemosPage.test.tsx`

- [ ] **Step 1: Update the failing test first**

Open `src/features/react-demos/components/__tests__/ReactDemosPage.test.tsx` and replace the "renders all three section headings" test with one that checks all four:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ReactDemosPage from '../ReactDemosPage'

describe('ReactDemosPage', () => {
  it('renders page heading', () => {
    render(<ReactDemosPage />)
    expect(screen.getByRole('heading', { name: /react demos/i })).toBeInTheDocument()
  })

  it('renders all four section headings', () => {
    render(<ReactDemosPage />)
    expect(screen.getByRole('heading', { name: /usetransition/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /virtualization/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /compound components/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /tanstack table/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to confirm new assertion fails**

```bash
npx vitest run src/features/react-demos/components/__tests__/ReactDemosPage.test.tsx
```

Expected: "renders all four section headings" FAILS.

- [ ] **Step 3: Update ReactDemosPage**

```tsx
import { UseTransitionSection } from './UseTransitionSection'
import { VirtualizationSection } from './VirtualizationSection'
import { CompoundComponentsSection } from './CompoundComponentsSection'
import { TanStackTableSection } from './TanStackTableSection'

export default function ReactDemosPage() {
  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">React Demos</h1>
      <UseTransitionSection />
      <VirtualizationSection />
      <CompoundComponentsSection />
      <TanStackTableSection />
    </div>
  )
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/features/react-demos/components/__tests__/ReactDemosPage.test.tsx
```

Expected: both tests PASS.

- [ ] **Step 5: Run full suite**

```bash
npm test -- --run
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/features/react-demos/components/ReactDemosPage.tsx \
        src/features/react-demos/components/__tests__/ReactDemosPage.test.tsx
git commit -m "feat(tanstack-table): add TanStackTableSection to ReactDemosPage"
```

---

### Task 5: Add Storybook story

**Files:**
- Create: `src/features/react-demos/components/__stories__/TanStackTableSection.stories.tsx`

- [ ] **Step 1: Create the story file**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { TanStackTableSection } from '../TanStackTableSection'

const meta: Meta<typeof TanStackTableSection> = {
  component: TanStackTableSection,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof TanStackTableSection>

export const Default: Story = {}
```

- [ ] **Step 2: Run full test suite (Storybook picks up the story automatically)**

```bash
npm test -- --run
```

Expected: all tests pass (story file has no test, but Storybook's vitest integration renders it — should pass).

- [ ] **Step 3: Commit**

```bash
git add src/features/react-demos/components/__stories__/TanStackTableSection.stories.tsx
git commit -m "feat(tanstack-table): add TanStackTableSection Storybook story"
```
