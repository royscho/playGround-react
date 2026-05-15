import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Table } from '../Table'

interface Row { id: string; name: string; age: number }

const columns = [
  { key: 'name' as const, header: 'Name' },
  { key: 'age' as const, header: 'Age' },
]
const data: Row[] = [
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
]

describe('Table', () => {
  it('renders column headers', () => {
    render(<Table columns={columns} data={data} keyExtractor={r => r.id} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
  })

  it('renders row data', () => {
    render(<Table columns={columns} data={data} keyExtractor={r => r.id} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('shows empty state when no data', () => {
    render(<Table columns={columns} data={[] as Row[]} keyExtractor={r => r.id} emptyMessage="No results" />)
    expect(screen.getByText('No results')).toBeInTheDocument()
  })
})
