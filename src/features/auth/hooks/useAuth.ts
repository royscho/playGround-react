import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { apiClient } from '../../../shared/utils/apiClient'

interface LoginResponse {
  data: { id: string; name: string; email: string; role: 'admin' | 'editor' }
  token: string
}

export function useLogin() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      apiClient.post<LoginResponse>('/api/auth/login', credentials),
    onSuccess: (data) => {
      setAuth(data.data, data.token)
      localStorage.setItem('auth-token', JSON.stringify(data.token))
      navigate('/dashboard')
    },
  })
}
