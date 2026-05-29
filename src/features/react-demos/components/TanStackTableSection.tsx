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
