import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AnimationsSection } from '../AnimationsSection'

describe('AnimationsSection', () => {
  it('renders section heading', () => {
    render(<AnimationsSection />)
    expect(screen.getByRole('heading', { name: /css animations/i })).toBeInTheDocument()
  })

  it('renders Tailwind built-in sub-heading', () => {
    render(<AnimationsSection />)
    expect(screen.getByText(/tailwind built-ins/i)).toBeInTheDocument()
  })

  it('renders custom keyframes sub-heading', () => {
    render(<AnimationsSection />)
    expect(screen.getByText(/custom @keyframes/i)).toBeInTheDocument()
  })

  it('renders all 4 Tailwind animation labels', () => {
    render(<AnimationsSection />)
    expect(screen.getByText('Spin')).toBeInTheDocument()
    expect(screen.getByText('Bounce')).toBeInTheDocument()
    expect(screen.getByText('Pulse')).toBeInTheDocument()
    expect(screen.getByText('Ping')).toBeInTheDocument()
  })

  it('renders all 4 custom animation labels', () => {
    render(<AnimationsSection />)
    expect(screen.getByText('Fade In')).toBeInTheDocument()
    expect(screen.getByText('Slide Up')).toBeInTheDocument()
    expect(screen.getByText('Shake')).toBeInTheDocument()
    expect(screen.getByText('Zoom In')).toBeInTheDocument()
  })

  it('renders Tailwind class names in code elements', () => {
    render(<AnimationsSection />)
    expect(screen.getByText('animate-spin')).toBeInTheDocument()
    expect(screen.getByText('animate-bounce')).toBeInTheDocument()
    expect(screen.getByText('animate-pulse')).toBeInTheDocument()
    expect(screen.getByText('animate-ping')).toBeInTheDocument()
  })

  it('renders custom class names in code elements', () => {
    render(<AnimationsSection />)
    expect(screen.getByText('anim-fade-in')).toBeInTheDocument()
    expect(screen.getByText('anim-slide-up')).toBeInTheDocument()
    expect(screen.getByText('anim-shake')).toBeInTheDocument()
    expect(screen.getByText('anim-zoom-in')).toBeInTheDocument()
  })

  it('clicking Replay on Spin card re-renders its animation element', async () => {
    render(<AnimationsSection />)
    const replayButtons = screen.getAllByRole('button', { name: /replay/i })
    const spinDemo = screen.getByTestId('demo-spin')
    const initialKey = spinDemo.getAttribute('data-key')
    await userEvent.click(replayButtons[0])
    expect(screen.getByTestId('demo-spin').getAttribute('data-key')).not.toBe(initialKey)
  })
})
