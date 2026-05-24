import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Notification } from '../../../shared/types/common'

interface NotificationsState {
  notifications: Notification[]
  add: (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  markRead: (id: string) => void
  markAllRead: () => void
  unreadCount: () => number
}

export const useNotificationsStore = create<NotificationsState>()(
  devtools(
    (set, get) => ({
      notifications: [],

      add: (n) =>
        set(
          (s) => ({
            notifications: [
              {
                ...n,
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                read: false,
              },
              ...s.notifications,
            ].slice(0, 20),
          }),
          false,
          'add'
        ),

      markRead: (id) =>
        set(
          (s) => ({
            notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
          }),
          false,
          'markRead'
        ),

      markAllRead: () =>
        set(
          (s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) }),
          false,
          'markAllRead'
        ),

      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    { name: 'Notifications Store' }
  )
)
