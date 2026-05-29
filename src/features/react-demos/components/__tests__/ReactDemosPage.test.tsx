import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ReactDemosPage from '../ReactDemosPage'

describe('ReactDemosPage', () => {
  it('renders page heading', () => {
    render(<ReactDemosPage />)
    expect(screen.getByRole('heading', { name: /react demos/i })).toBeInTheDocument()
  })

  it('renders all four section headings', () => {
    render(<ReactDemosPage />)
    expect(screen.getByRole('heading', { name: /usetransition/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /virtualization/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /compound components/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /tanstack table/i })).toBeInTheDocument()
  })
})
