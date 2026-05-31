import type { Meta, StoryObj } from '@storybook/react-vite'
import { AudioSection } from '../AudioSection'

const meta: Meta<typeof AudioSection> = {
  component: AudioSection,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof AudioSection>

export const Default: Story = {}
