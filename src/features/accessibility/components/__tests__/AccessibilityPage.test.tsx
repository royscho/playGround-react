import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AccessibilityPage from '../AccessibilityPage'

describe('AccessibilityPage', () => {
  it('renders h1 with text "Accessibility"', () => {
    render(<AccessibilityPage />)
    expect(screen.getByRole('heading', { name: 'Accessibility', level: 1 })).toBeInTheDocument()
  })

  it('renders modal section', () => {
    render(<AccessibilityPage />)
    expect(screen.getByTestId('modal-section')).toBeInTheDocument()
  })

  it('renders form section', () => {
    render(<AccessibilityPage />)
    expect(screen.getByTestId('a11y-form')).toBeInTheDocument()
  })
})
