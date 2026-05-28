import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import { primaryNavItems } from './navItems'

interface BottomNavProps {
  onMoreClick: () => void
}

export function BottomNav({ onMoreClick }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 md:hidden">
      {primaryNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            clsx(
              'flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:rounded',
              isActive
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            )
          }
        >
          <span className="text-lg leading-none">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
      <button
        onClick={onMoreClick}
        aria-label="More navigation items"
        className="flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:rounded"
      >
        <span className="text-lg leading-none">•••</span>
        <span>More</span>
      </button>
    </nav>
  )
}
