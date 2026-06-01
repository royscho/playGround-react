import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import { moreNavItems } from './navItems'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function BottomSheet({ isOpen, onClose }: BottomSheetProps) {
  return (
    <>
      <div
        role="presentation"
        className={clsx(
          'fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />
      <nav
        className={clsx(
          'fixed bottom-0 left-0 right-0 z-50 rounded-t-xl border-t border-gray-200 bg-white transition-transform duration-300 dark:border-gray-700 dark:bg-gray-900 md:hidden',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="flex justify-center py-2">
          <div className="h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
        <div className="p-4 pb-20">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            More
          </p>
          <div className="grid grid-cols-2 gap-2">
            {moreNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-2 rounded-lg p-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}
