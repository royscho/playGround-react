import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CssExamplesPage from '../CssExamplesPage'

describe('CssExamplesPage', () => {
  it('renders page heading', () => {
    render(<CssExamplesPage />)
    expect(screen.getByRole('heading', { name: /css3 examples/i })).toBeInTheDocument()
  })

  it('renders all six section headings', () => {
    render(<CssExamplesPage />)
    expect(screen.getByRole('heading', { name: /visual effects/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /transitions & animations/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /flexbox & grid/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /custom properties/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /css animations/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /animation playground/i })).toBeInTheDocument()
  })
})
