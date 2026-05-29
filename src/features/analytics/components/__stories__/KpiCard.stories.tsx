import type { Meta, StoryObj } from '@storybook/react'
import { KpiCard } from '../KpiCard'

const meta: Meta<typeof KpiCard> = {
  component: KpiCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof KpiCard>

export const Revenue: Story = {
  args: {
    metric: { label: 'Total Revenue', value: 284500, change: 12.5, unit: '$' },
  },
}

export const Users: Story = {
  args: {
    metric: { label: 'Active Users', value: 12340, change: -3.2, unit: '' },
  },
}

export const Conversion: Story = {
  args: {
    metric: { label: 'Conversion Rate', value: 3.8, change: 0.6, unit: '%' },
  },
}

export const Session: Story = {
  args: {
    metric: { label: 'Avg Session', value: 4.2, change: 8.1, unit: 'min' },
  },
}

export const NegativeChange: Story = {
  args: {
    metric: { label: 'Total Revenue', value: 198000, change: -8.3, unit: '$' },
  },
}
