import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UsersState {
  search: string
  roleFilter: 'all' | 'admin' | 'editor' | 'viewer'
  setSearch: (search: string) => void
  setRoleFilter: (role: UsersState['roleFilter']) => void
  reset: () => void
}

export const useUsersStore = create<UsersState>()(
  devtools(
    (set) => ({
      search: '',
      roleFilter: 'all',
      setSearch: (search) => set({ search }, false, 'setSearch'),
      setRoleFilter: (roleFilter) => set({ roleFilter }, false, 'setRoleFilter'),
      reset: () => set({ search: '', roleFilter: 'all' }, false, 'reset'),
    }),
    { name: 'Users Store' }
  )
)
