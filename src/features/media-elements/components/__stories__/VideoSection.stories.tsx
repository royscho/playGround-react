import type { Meta, StoryObj } from '@storybook/react-vite'
import { VideoSection } from '../VideoSection'

const meta: Meta<typeof VideoSection> = {
  component: VideoSection,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof VideoSection>

export const Default: Story = {}
