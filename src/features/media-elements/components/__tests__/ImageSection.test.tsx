import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ImageSection } from '../ImageSection'

describe('ImageSection', () => {
  it('renders section heading', () => {
    render(<ImageSection />)
    expect(screen.getByRole('heading', { name: /^images$/i })).toBeInTheDocument()
  })

  it('renders all 5 object-fit labels', () => {
    render(<ImageSection />)
    expect(screen.getByText('Cover')).toBeInTheDocument()
    expect(screen.getByText('Contain')).toBeInTheDocument()
    expect(screen.getByText('Fill')).toBeInTheDocument()
    expect(screen.getByText('None')).toBeInTheDocument()
    expect(screen.getByText('Scale Down')).toBeInTheDocument()
  })

  it('renders object-fit code labels', () => {
    render(<ImageSection />)
    expect(screen.getByText('object-cover')).toBeInTheDocument()
    expect(screen.getByText('object-contain')).toBeInTheDocument()
    expect(screen.getByText('object-fill')).toBeInTheDocument()
    expect(screen.getByText('object-none')).toBeInTheDocument()
    expect(screen.getByText('object-scale-down')).toBeInTheDocument()
  })

  it('renders loading attribute cards', () => {
    render(<ImageSection />)
    expect(screen.getByText('Lazy')).toBeInTheDocument()
    expect(screen.getByText('Eager')).toBeInTheDocument()
  })

  it('renders loading attribute code labels', () => {
    render(<ImageSection />)
    expect(screen.getByText('loading="lazy"')).toBeInTheDocument()
    expect(screen.getByText('loading="eager"')).toBeInTheDocument()
  })

  it('renders aspect-ratio demo', () => {
    render(<ImageSection />)
    expect(screen.getByText(/aspect-\[16\/9\]/)).toBeInTheDocument()
  })
})
