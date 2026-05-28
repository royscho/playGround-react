import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useUiStore } from '../../store/uiStore'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { BottomSheet } from './BottomSheet'

export function AppLayout() {
  const { sidebarOpen, darkMode } = useUiStore()
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex h-screen bg-[var(--color-bg)]">
        <Sidebar isOpen={sidebarOpen} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">
            <Outlet />
          </main>
        </div>
      </div>
      <BottomNav onMoreClick={() => setSheetOpen(true)} />
      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  )
}
