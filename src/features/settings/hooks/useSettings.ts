import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
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
  const [profile, setProfile] = useState<ProfileData | null>(null)

  const mutation = useMutation({
    mutationFn: (data: ProfileData) =>
      apiClient.put<{ data: ProfileData; message: string }>('/api/settings', data),

    onMutate: (data) => {
      // optimistic update — apply immediately
      setProfile(data)
      const previous = queryClient.getQueryData<ProfileData>(QUERY_KEY)
      queryClient.setQueryData(QUERY_KEY, data)
      return { previous }
    },

    onError: (_err, _data, context) => {
      // rollback on failure
      if (context?.previous !== undefined) {
        queryClient.setQueryData(QUERY_KEY, context.previous)
        setProfile(context.previous ?? null)
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      onSuccess?.()
    },
  })

  return {
    profile,
    updateProfile: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
