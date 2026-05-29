import type { Decorator, Meta, StoryObj } from '@storybook/react'
import { NotificationBadge } from '../NotificationList'
import { useNotificationsStore } from '../../store/notificationsStore'

const withCount = (count: number): Decorator =>
  (Story) => {
    useNotificationsStore.setState({
      notifications: Array.from({ length: count }, (_, i) => ({
        id: String(i),
        title: `Notification ${i + 1}`,
        message: 'Something happened that requires your attention.',
        type: 'info' as const,
        read: false,
        createdAt: new Date().toISOString(),
      })),
    })
    return <Story />
  }

const meta: Meta<typeof NotificationBadge> = {
  component: NotificationBadge,
  tags: ['autodocs'],
  args: { onClick: () => {}, isOpen: false },
}
export default meta

type Story = StoryObj<typeof NotificationBadge>

export const NoCount: Story = {
  decorators: [withCount(0)],
}

export const WithCount: Story = {
  decorators: [withCount(6)],
}

export const MaxCount: Story = {
  decorators: [withCount(12)],
}
