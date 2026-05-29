import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { BottomNav } from '../BottomNav'

const meta: Meta<typeof BottomNav> = {
  component: BottomNav,
  tags: ['autodocs'],
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  decorators: [
    (Story) => (
      <div className="relative h-24">
        <Story />
      </div>
    ),
  ],
  args: { onMoreClick: () => {} },
}
export default meta

type Story = StoryObj<typeof BottomNav>

export const Default: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/dashboard']}>
        <Story />
      </MemoryRouter>
    ),
  ],
}

export const AnalyticsActive: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/analytics']}>
        <Story />
      </MemoryRouter>
    ),
  ],
}

export const SettingsActive: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/settings']}>
        <Story />
      </MemoryRouter>
    ),
  ],
}
