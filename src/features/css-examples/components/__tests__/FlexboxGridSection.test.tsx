import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FlexboxGridSection } from '../FlexboxGridSection'

describe('FlexboxGridSection', () => {
  it('renders section heading', () => {
    render(<FlexboxGridSection />)
    expect(screen.getByRole('heading', { name: /flexbox & grid/i })).toBeInTheDocument()
  })

  it('renders flex container', () => {
    render(<FlexboxGridSection />)
    expect(screen.getByTestId('flex-container')).toBeInTheDocument()
  })

  it('renders grid container', () => {
    render(<FlexboxGridSection />)
    expect(screen.getByTestId('grid-container')).toBeInTheDocument()
  })

  it('renders 6 boxes in each container', () => {
    render(<FlexboxGridSection />)
    const flexItems = screen.getByTestId('flex-container').querySelectorAll('.fg-box')
    const gridItems = screen.getByTestId('grid-container').querySelectorAll('.fg-box')
    expect(flexItems).toHaveLength(6)
    expect(gridItems).toHaveLength(6)
  })
})
