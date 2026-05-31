import type { Meta, StoryObj } from '@storybook/react-vite'
import { SVGSection } from '../SVGSection'

const meta: Meta<typeof SVGSection> = {
  component: SVGSection,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof SVGSection>

export const Default: Story = {}
