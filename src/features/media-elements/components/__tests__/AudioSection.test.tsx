import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AudioSection } from '../AudioSection'

describe('AudioSection', () => {
  it('renders section heading', () => {
    render(<AudioSection />)
    expect(screen.getByRole('heading', { name: /^audio$/i })).toBeInTheDocument()
  })

  it('renders Native Controls card label', () => {
    render(<AudioSection />)
    expect(screen.getByText('Native Controls')).toBeInTheDocument()
  })

  it('renders Loop card label', () => {
    render(<AudioSection />)
    expect(screen.getByText('Loop')).toBeInTheDocument()
  })

  it('renders preload options', () => {
    render(<AudioSection />)
    expect(screen.getByText('preload="none"')).toBeInTheDocument()
    expect(screen.getByText('preload="metadata"')).toBeInTheDocument()
    expect(screen.getByText('preload="auto"')).toBeInTheDocument()
  })

  it('controls audio has controls attribute', () => {
    render(<AudioSection />)
    expect(screen.getByTestId('audio-controls')).toHaveAttribute('controls')
  })

  it('loop audio has loop attribute', () => {
    render(<AudioSection />)
    expect(screen.getByTestId('audio-loop')).toHaveAttribute('loop')
  })
})
