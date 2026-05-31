import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SVGSection } from '../SVGSection'

describe('SVGSection', () => {
  it('renders section heading', () => {
    render(<SVGSection />)
    expect(screen.getByRole('heading', { name: /^svg$/i })).toBeInTheDocument()
  })

  it('renders all 6 shape labels', () => {
    render(<SVGSection />)
    expect(screen.getByText('Rectangle')).toBeInTheDocument()
    expect(screen.getByText('Circle')).toBeInTheDocument()
    expect(screen.getByText('Ellipse')).toBeInTheDocument()
    expect(screen.getByText('Line')).toBeInTheDocument()
    expect(screen.getByText('Polygon')).toBeInTheDocument()
    expect(screen.getByText('Path')).toBeInTheDocument()
  })

  it('renders SVG elements in the DOM', () => {
    const { container } = render(<SVGSection />)
    expect(container.querySelectorAll('svg').length).toBeGreaterThan(0)
  })

  it('renders fill and stroke sub-section labels', () => {
    render(<SVGSection />)
    expect(screen.getByText('fill only')).toBeInTheDocument()
    expect(screen.getByText('stroke only')).toBeInTheDocument()
    expect(screen.getByText('fill + stroke')).toBeInTheDocument()
  })

  it('renders inline SVG sub-section', () => {
    render(<SVGSection />)
    expect(screen.getByText('Inline SVG')).toBeInTheDocument()
  })

  it('renders SVG as img sub-section', () => {
    render(<SVGSection />)
    expect(screen.getByAltText('svg as img')).toBeInTheDocument()
  })
})
