import { useState } from 'react'
import { useUiStore } from '../../store/uiStore'
import { useAuthStore } from '../../features/auth/store/authStore'
import { Button } from '../../shared/components/Button'
import { NotificationBadge, NotificationList } from '../../features/notifications/components/NotificationList'
import { useNotificationSimulator } from '../../features/notifications/hooks/useNotificationSimulator'

export function TopBar() {
  const { toggleSidebar, toggleDarkMode, darkMode } = useUiStore()
  const { user, logout } = useAuthStore()
  const [notifOpen, setNotifOpen] = useState(false)

  useNotificationSimulator()

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900">
      <Button variant="ghost" size="sm" onClick={toggleSidebar} aria-label="Toggle sidebar">
        ☰
      </Button>
      <div className="relative flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={toggleDarkMode} aria-label="Toggle dark mode">
          {darkMode ? '☀️' : '🌙'}
        </Button>
        <NotificationBadge
          onClick={() => setNotifOpen((o) => !o)}
          isOpen={notifOpen}
        />
        <NotificationList isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
        <span className="text-sm text-gray-700 dark:text-gray-300">{user?.name}</span>
        <Button variant="secondary" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  )
}
