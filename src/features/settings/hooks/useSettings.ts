import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../../shared/utils/apiClient'

export interface ProfileData {
  name: string
  email: string
  bio: string
}

const QUERY_KEY = ['settings', 'profile']

interface UseSettingsOptions {
  onSuccess?: () => void
}

export function useSettings({ onSuccess }: UseSettingsOptions = {}) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => apiClient.get<ProfileData>('/api/settings'),
  })

  const mutation = useMutation({
    mutationFn: (data: ProfileData) =>
      apiClient.put<{ data: ProfileData; message: string }>('/api/settings', data),

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const previous = queryClient.getQueryData<ProfileData>(QUERY_KEY)
      queryClient.setQueryData(QUERY_KEY, data)
      return { previous }
    },

    onError: (_err, _data, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(QUERY_KEY, context.previous)
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      onSuccess?.()
    },
  })

  return {
    profile: query.data,
    isLoading: query.isLoading,
    updateProfile: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
