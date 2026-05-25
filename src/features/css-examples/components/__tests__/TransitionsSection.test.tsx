import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TransitionsSection } from '../TransitionsSection'

describe('TransitionsSection', () => {
  it('renders section heading', () => {
    render(<TransitionsSection />)
    expect(screen.getByRole('heading', { name: /transitions & animations/i })).toBeInTheDocument()
  })

  it('renders transition button', () => {
    render(<TransitionsSection />)
    expect(screen.getByTestId('transition-button')).toBeInTheDocument()
  })

  it('renders spinner demo', () => {
    render(<TransitionsSection />)
    expect(screen.getByTestId('spinner-demo')).toBeInTheDocument()
  })

  it('renders bouncer demo', () => {
    render(<TransitionsSection />)
    expect(screen.getByTestId('bouncer-demo')).toBeInTheDocument()
  })
})
