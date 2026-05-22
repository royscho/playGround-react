import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { apiClient } from '../../../shared/utils/apiClient'
import type { User } from '../../../shared/types/common'
import type { PaginatedResponse } from '../../../shared/types/api'

interface UseUsersParams {
  page: number
  pageSize: number
  search: string
}

export function useUsers({ page, pageSize, search }: UseUsersParams) {
  return useQuery({
    queryKey: ['users', { page, pageSize, search }],
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(search && { search }),
      })
      return apiClient.get<PaginatedResponse<User>>(`/api/users?${params}`)
    },
    placeholderData: keepPreviousData,
  })
}
