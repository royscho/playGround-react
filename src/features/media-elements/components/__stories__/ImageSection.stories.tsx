import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImageSection } from '../ImageSection'

const meta: Meta<typeof ImageSection> = {
  component: ImageSection,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ImageSection>

export const Default: Story = {}
