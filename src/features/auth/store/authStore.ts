import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { AuthUser } from '../../../shared/types/common'

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: AuthUser, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        setAuth: (user, token) => set({ user, token, isAuthenticated: true }, false, 'setAuth'),
        logout: () => set({ user: null, token: null, isAuthenticated: false }, false, 'logout'),
      }),
      { name: 'auth-store' }
    ),
    { name: 'Auth Store' }
  )
)
