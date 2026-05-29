import type { Meta, StoryObj } from '@storybook/react-vite'
import { TanStackTableSection } from '../TanStackTableSection'

const meta: Meta<typeof TanStackTableSection> = {
  component: TanStackTableSection,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof TanStackTableSection>

export const Default: Story = {}
