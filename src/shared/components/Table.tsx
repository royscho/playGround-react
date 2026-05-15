import { ReactNode } from 'react'

interface Column<T> {
  key: keyof T
  header: string
  render?: (value: T[keyof T], row: T) => ReactNode
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
