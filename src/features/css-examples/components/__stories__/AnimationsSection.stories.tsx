import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnimationsSection } from '../AnimationsSection'

const meta: Meta<typeof AnimationsSection> = {
  component: AnimationsSection,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof AnimationsSection>

export const Default: Story = {}
