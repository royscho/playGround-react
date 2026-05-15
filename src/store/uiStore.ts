import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UiState {
  sidebarOpen: boolean
  darkMode: boolean
  toggleSidebar: () => void
  toggleDarkMode: () => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      darkMode: false,
      toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
      toggleDarkMode: () => set(s => ({ darkMode: !s.darkMode })),
    }),
    { name: 'ui-store' },
  ),
)
