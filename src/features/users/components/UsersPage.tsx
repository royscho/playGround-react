import { useDeferredValue, useTransition, useState } from 'react'
import { useUsers } from '../hooks/useUsers'
import { useUsersStore } from '../store/usersStore'
import { Table } from '../../../shared/components/Table'
import { Input } from '../../../shared/components/Input'
import { Badge } from '../../../shared/components/Badge'
import { Button } from '../../../shared/components/Button'
import { formatDate } from '../../../shared/utils/formatters'
import type { User } from '../../../shared/types/common'

const PAGE_SIZE = 10

export default function UsersPage() {
  const { search, roleFilter, setSearch, setRoleFilter } = useUsersStore()
  const deferredSearch = useDeferredValue(search)
  const [isPending, startTransition] = useTransition()
  const [page, setPage] = useState(1)

  const { data, isFetching } = useUsers({ page, pageSize: PAGE_SIZE, search: deferredSearch })

  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const filtered =
    roleFilter === 'all'
      ? (data?.data ?? [])
      : (data?.data ?? []).filter((u) => u.role === roleFilter)

  const columns = [
    { key: 'name' as const, header: 'Name' },
    { key: 'email' as const, header: 'Email' },
    {
      key: 'role' as const,
      header: 'Role',
      render: (_value: string, row: User) => (
        <Badge
          variant={row.role === 'admin' ? 'info' : row.role === 'editor' ? 'success' : 'default'}
        >
          {row.role}
        </Badge>
      ),
    },
    {
      key: 'status' as const,
      header: 'Status',
      render: (_value: string, row: User) => (
        <Badge variant={row.status === 'active' ? 'success' : 'error'}>{row.status}</Badge>
      ),
    },
    {
      key: 'createdAt' as const,
      header: 'Joined',
      render: (value: string) => formatDate(value),
    },
  ]

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Users</h1>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search users…"
          value={search}
          onChange={(e) => {
            startTransition(() => {
              setSearch(e.target.value)
              setPage(1)
            })
          }}
          className="w-64 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value as typeof roleFilter)
            setPage(1)
          }}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>

        {(isFetching || isPending) && (
          <span className="text-sm text-gray-500 dark:text-gray-400">Loading…</span>
        )}
      </div>

      <Table data={filtered} columns={columns} keyExtractor={(u) => u.id} />

      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>
          Page {page} of {totalPages} — {total} users
        </span>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
