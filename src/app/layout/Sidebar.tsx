import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/users', label: 'Users', icon: '👥' },
  { to: '/analytics', label: 'Analytics', icon: '📈' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

interface SidebarProps {
  isOpen: boolean
}

export function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside
      className={clsx(
        'flex h-screen flex-col border-r border-gray-200 bg-white transition-all dark:border-gray-700 dark:bg-gray-900',
        isOpen ? 'w-56' : 'w-16'
      )}
    >
      <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <span className="text-lg font-bold text-blue-600">{isOpen ? 'Dashboard' : 'D'}</span>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              )
            }
          >
            <span className="text-base">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
