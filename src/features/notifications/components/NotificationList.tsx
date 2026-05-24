import { useRef, useEffect } from 'react'
import { clsx } from 'clsx'
import { useNotificationsStore } from '../store/notificationsStore'
import { Badge } from '../../../shared/components/Badge'
import { Button } from '../../../shared/components/Button'
import type { Notification } from '../../../shared/types/common'

// ─── Badge ───────────────────────────────────────────────────────────────────

interface NotificationBadgeProps {
  onClick: () => void
  isOpen: boolean
}

export function NotificationBadge({ onClick, isOpen }: NotificationBadgeProps) {
  const unreadCount = useNotificationsStore((s) => s.unreadCount())

  return (
    <button
      onClick={onClick}
      aria-label="Notifications"
      aria-expanded={isOpen}
      className="relative rounded-md p-1.5 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      🔔
      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  )
}

// ─── Item ─────────────────────────────────────────────────────────────────────

interface NotificationItemProps {
  notification: Notification
}

const variantMap: Record<Notification['type'], 'info' | 'success' | 'warning' | 'error'> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const markRead = useNotificationsStore((s) => s.markRead)
  const { id, title, message, type, read } = notification

  return (
    <div
      className={clsx(
        'cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700',
        !read && 'border-l-2 border-blue-500 bg-blue-50/30 dark:bg-blue-900/10'
      )}
      onClick={() => markRead(id)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
          <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">{message}</p>
        </div>
        <Badge variant={variantMap[type]}>{type}</Badge>
      </div>
    </div>
  )
}

// ─── List (panel) ─────────────────────────────────────────────────────────────

interface NotificationListProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationList({ isOpen, onClose }: NotificationListProps) {
  const { notifications, markAllRead } = useNotificationsStore()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-700">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</span>
        <Button variant="ghost" size="sm" onClick={markAllRead}>
          Mark all read
        </Button>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            No notifications
          </p>
        ) : (
          notifications.map((n) => <NotificationItem key={n.id} notification={n} />)
        )}
      </div>
    </div>
  )
}
