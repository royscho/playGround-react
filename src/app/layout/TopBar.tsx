import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, Sun, Moon } from 'lucide-react'
import { useUiStore } from '../../store/uiStore'
import { useAuthStore } from '../../features/auth/store/authStore'
import { Button } from '../../shared/components/Button'
import { NotificationBadge, NotificationList } from '../../features/notifications/components/NotificationList'
import { useNotificationSimulator } from '../../features/notifications/hooks/useNotificationSimulator'
import { navItems } from './navItems'

export function TopBar() {
  const { toggleSidebar, toggleDarkMode, darkMode } = useUiStore()
  const { user, logout } = useAuthStore()
  const { pathname } = useLocation()
  const [notifOpen, setNotifOpen] = useState(false)

  useNotificationSimulator()

  const pageTitle = navItems.find((item) => pathname.startsWith(item.to))?.label ?? 'Dashboard'

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <div className="hidden md:block">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 md:hidden">
          {pageTitle}
        </span>
      </div>
      <div className="relative flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={toggleDarkMode} aria-label="Toggle dark mode">
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
