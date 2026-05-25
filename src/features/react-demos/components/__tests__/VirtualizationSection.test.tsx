import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VirtualizationSection } from '../VirtualizationSection'

describe('VirtualizationSection', () => {
  it('renders section heading', () => {
    render(<VirtualizationSection />)
    expect(screen.getByRole('heading', { name: /virtualization/i })).toBeInTheDocument()
  })

  it('renders naive panel', () => {
    render(<VirtualizationSection />)
    expect(screen.getByTestId('naive-panel')).toBeInTheDocument()
  })

  it('renders virtual panel', () => {
    render(<VirtualizationSection />)
    expect(screen.getByTestId('virtual-panel')).toBeInTheDocument()
  })

  it('naive panel shows dom node count badge', () => {
    render(<VirtualizationSection />)
    expect(screen.getByTestId('naive-count')).toBeInTheDocument()
  })

  it('virtual panel shows dom node count badge', () => {
    render(<VirtualizationSection />)
    expect(screen.getByTestId('virtual-count')).toBeInTheDocument()
  })
})
