import type { Meta, StoryObj } from '@storybook/react-vite'
import { ModalSection } from '../ModalSection'

const meta: Meta<typeof ModalSection> = {
  component: ModalSection,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ModalSection>

export const Default: Story = {}
