import { useEffect } from 'react'
import { useNotificationsStore } from '../store/notificationsStore'
import type { Notification } from '../../../shared/types/common'

const SAMPLE_NOTIFICATIONS: Omit<Notification, 'id' | 'createdAt' | 'read'>[] = [
  { title: 'New user registered', message: 'alice@example.com joined', type: 'info' },
  { title: 'Revenue milestone', message: 'Monthly revenue exceeded $10k', type: 'success' },
  { title: 'High error rate', message: 'API errors spiked in the last 5 min', type: 'warning' },
  { title: 'Deployment complete', message: 'v1.2.3 deployed to production', type: 'success' },
  { title: 'Disk usage high', message: 'Server disk at 85% capacity', type: 'error' },
]

export function useNotificationSimulator(intervalMs = 8000) {
  const add = useNotificationsStore((s) => s.add)

  useEffect(() => {
    const id = setInterval(() => {
      const n = SAMPLE_NOTIFICATIONS[Math.floor(Math.random() * SAMPLE_NOTIFICATIONS.length)]
      add(n)
    }, intervalMs)

    return () => clearInterval(id)
  }, [add, intervalMs])
}
