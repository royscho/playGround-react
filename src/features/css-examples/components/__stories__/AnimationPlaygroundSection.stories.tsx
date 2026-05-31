import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnimationPlaygroundSection } from '../AnimationPlaygroundSection'

const meta: Meta<typeof AnimationPlaygroundSection> = {
  component: AnimationPlaygroundSection,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof AnimationPlaygroundSection>

export const Default: Story = {}
