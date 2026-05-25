// src/features/css-examples/components/__tests__/VisualEffectsSection.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VisualEffectsSection } from '../VisualEffectsSection'

describe('VisualEffectsSection', () => {
  it('renders section heading', () => {
    render(<VisualEffectsSection />)
    expect(screen.getByRole('heading', { name: /visual effects/i })).toBeInTheDocument()
  })

  it('renders gradient demo', () => {
    render(<VisualEffectsSection />)
    expect(screen.getByTestId('gradient-demo')).toBeInTheDocument()
  })

  it('renders radius demo', () => {
    render(<VisualEffectsSection />)
    expect(screen.getByTestId('radius-demo')).toBeInTheDocument()
  })

  it('renders shadow demo', () => {
    render(<VisualEffectsSection />)
    expect(screen.getByTestId('shadow-demo')).toBeInTheDocument()
  })

  it('renders filter demo', () => {
    render(<VisualEffectsSection />)
    expect(screen.getByTestId('filter-demo')).toBeInTheDocument()
  })
})
