import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AnimationPlaygroundSection } from '../AnimationPlaygroundSection'

describe('AnimationPlaygroundSection', () => {
  it('renders section heading', () => {
    render(<AnimationPlaygroundSection />)
    expect(screen.getByRole('heading', { name: /animation playground/i })).toBeInTheDocument()
  })

  it('renders animation select with all 4 options', () => {
    render(<AnimationPlaygroundSection />)
    const select = screen.getByLabelText(/animation/i)
    expect(select).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Spin' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Bounce' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Pulse' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Ping' })).toBeInTheDocument()
  })

  it('renders duration slider', () => {
    render(<AnimationPlaygroundSection />)
    expect(screen.getByLabelText(/duration/i)).toBeInTheDocument()
  })

  it('renders delay slider', () => {
    render(<AnimationPlaygroundSection />)
    expect(screen.getByLabelText(/delay/i)).toBeInTheDocument()
  })

  it('renders iteration count select', () => {
    render(<AnimationPlaygroundSection />)
    expect(screen.getByLabelText(/iterations/i)).toBeInTheDocument()
  })

  it('renders Restart button', () => {
    render(<AnimationPlaygroundSection />)
    expect(screen.getByRole('button', { name: /restart/i })).toBeInTheDocument()
  })

  it('code snippet updates when duration slider changes', () => {
    render(<AnimationPlaygroundSection />)
    const slider = screen.getByLabelText(/duration/i)
    fireEvent.change(slider, { target: { value: '2.5' } })
    expect(screen.getByTestId('code-snippet').textContent).toContain('2.5s')
  })

  it('code snippet updates when animation selection changes', () => {
    render(<AnimationPlaygroundSection />)
    const select = screen.getByLabelText(/animation/i)
    fireEvent.change(select, { target: { value: 'spin' } })
    expect(screen.getByTestId('code-snippet').textContent).toContain('animate-spin')
  })

  it('Restart button changes demo data-key', () => {
    render(<AnimationPlaygroundSection />)
    const demo = screen.getByTestId('playground-demo')
    const initialKey = demo.getAttribute('data-key')
    fireEvent.click(screen.getByRole('button', { name: /restart/i }))
    expect(screen.getByTestId('playground-demo').getAttribute('data-key')).not.toBe(initialKey)
  })
})
