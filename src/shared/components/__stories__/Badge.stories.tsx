import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../Badge'

const meta: Meta<typeof Badge> = {
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Badge' },
}
export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: { variant: 'default' },
}

export const Success: Story = {
  args: { variant: 'success', children: 'Active' },
}

export const Warning: Story = {
  args: { variant: 'warning', children: 'Pending' },
}

export const Error: Story = {
  args: { variant: 'error', children: 'Failed' },
}

export const Info: Story = {
  args: { variant: 'info', children: 'Info' },
}
