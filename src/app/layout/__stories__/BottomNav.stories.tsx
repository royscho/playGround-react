import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { BottomNav } from '../BottomNav'

const meta: Meta<typeof BottomNav> = {
  component: BottomNav,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/dashboard']}>
        <div className="relative h-24">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  args: { onMoreClick: () => {} },
}
export default meta

type Story = StoryObj<typeof BottomNav>

export const Default: Story = {}

export const AnalyticsActive: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/analytics']}>
        <div className="relative h-24">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
}

export const SettingsActive: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/settings']}>
        <div className="relative h-24">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
}
