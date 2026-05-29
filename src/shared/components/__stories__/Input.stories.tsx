import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '../Input'

const meta: Meta<typeof Input> = {
  component: Input,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
}

export const WithLabel: Story = {
  args: {
    id: 'email',
    label: 'Email address',
    placeholder: 'you@example.com',
    type: 'email',
  },
}

export const WithValue: Story = {
  args: {
    id: 'name',
    label: 'Full name',
    defaultValue: 'Alice Johnson',
  },
}

export const Error: Story = {
  args: {
    id: 'email-error',
    label: 'Email address',
    defaultValue: 'not-an-email',
    error: 'Please enter a valid email address',
  },
}

export const Disabled: Story = {
  args: {
    id: 'disabled',
    label: 'Username',
    defaultValue: 'admin',
    disabled: true,
  },
}
