import type { Meta, StoryObj } from '@storybook/react'
import { Table } from '../Table'

interface User {
  id: string
  name: string
  email: string
  role: string
}

const columns = [
  { key: 'name' as const, header: 'Name' },
  { key: 'email' as const, header: 'Email' },
  { key: 'role' as const, header: 'Role' },
]

const sampleData: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', role: 'Viewer' },
]

const meta: Meta<typeof Table<User>> = {
  component: Table,
  tags: ['autodocs'],
  args: {
    columns,
    keyExtractor: (row) => row.id,
  },
}
export default meta

type Story = StoryObj<typeof Table<User>>

export const WithData: Story = {
  args: { data: sampleData },
}

export const Empty: Story = {
  args: { data: [], emptyMessage: 'No users found' },
}

export const Loading: Story = {
  args: { data: [], isLoading: true },
}
