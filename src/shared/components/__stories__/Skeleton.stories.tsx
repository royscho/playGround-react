import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from '../Skeleton'

const meta: Meta<typeof Skeleton> = {
  component: Skeleton,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Skeleton>

export const SingleLine: Story = {
  args: {},
}

export const MultiLine: Story = {
  args: { lines: 4 },
}

export const Card: Story = {
  args: { className: 'h-32 w-64' },
}

export const Avatar: Story = {
  args: { className: 'h-12 w-12 rounded-full' },
}
