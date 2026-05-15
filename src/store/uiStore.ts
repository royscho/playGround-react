import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

interface UiState {
  sidebarOpen: boolean
  darkMode: boolean
  toggleSidebar: () => void
  toggleDarkMode: () => void
}

export const useUiStore = create<UiState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,
        darkMode: false,
        toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen }), false, 'toggleSidebar'),
        toggleDarkMode: () => set(s => ({ darkMode: !s.darkMode }), false, 'toggleDarkMode'),
      }),
      { name: 'ui-store' },
    ),
    { name: 'UI Store' },
  ),
)
