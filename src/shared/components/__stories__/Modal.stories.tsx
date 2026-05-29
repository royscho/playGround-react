import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from '../Modal'

const meta: Meta<typeof Modal> = {
  component: Modal,
  tags: ['autodocs'],
  args: {
    onClose: () => {},
    title: 'Confirm action',
    children: (
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Are you sure you want to delete this item? This action cannot be undone.
      </p>
    ),
  },
}
export default meta

type Story = StoryObj<typeof Modal>

export const Open: Story = {
  args: { isOpen: true },
}

export const Closed: Story = {
  args: { isOpen: false },
}
