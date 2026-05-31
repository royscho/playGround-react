import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MediaElementsPage from '../MediaElementsPage'

describe('MediaElementsPage', () => {
  it('renders page heading', () => {
    render(<MediaElementsPage />)
    expect(screen.getByRole('heading', { name: /media elements/i })).toBeInTheDocument()
  })

  it('renders all four section headings', () => {
    render(<MediaElementsPage />)
    expect(screen.getByRole('heading', { name: /^images$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^video$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^audio$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^svg$/i })).toBeInTheDocument()
  })
})
