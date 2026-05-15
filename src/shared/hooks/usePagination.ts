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
