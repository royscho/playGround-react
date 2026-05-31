import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VideoSection } from '../VideoSection'

describe('VideoSection', () => {
  it('renders section heading', () => {
    render(<VideoSection />)
    expect(screen.getByRole('heading', { name: /^video$/i })).toBeInTheDocument()
  })

  it('renders Native Controls card label', () => {
    render(<VideoSection />)
    expect(screen.getByText('Native Controls')).toBeInTheDocument()
  })

  it('renders Autoplay + Muted card label', () => {
    render(<VideoSection />)
    expect(screen.getByText('Autoplay + Muted')).toBeInTheDocument()
  })

  it('renders Poster Image card label', () => {
    render(<VideoSection />)
    expect(screen.getByText('Poster Image')).toBeInTheDocument()
  })

  it('controls video has controls attribute', () => {
    render(<VideoSection />)
    expect(screen.getByTestId('video-controls')).toHaveAttribute('controls')
  })

  it('autoplay video has muted property', () => {
    render(<VideoSection />)
    expect((screen.getByTestId('video-autoplay') as HTMLVideoElement).muted).toBe(true)
  })

  it('poster video has poster attribute', () => {
    render(<VideoSection />)
    expect(screen.getByTestId('video-poster')).toHaveAttribute('poster')
  })
})
