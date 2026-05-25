// src/features/react-demos/components/__tests__/UseTransitionSection.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UseTransitionSection } from '../UseTransitionSection'

describe('UseTransitionSection', () => {
  it('renders section heading', () => {
    render(<UseTransitionSection />)
    expect(screen.getByRole('heading', { name: /usetransition/i })).toBeInTheDocument()
  })

  it('renders search input', () => {
    render(<UseTransitionSection />)
    expect(screen.getByTestId('search-input')).toBeInTheDocument()
  })

  it('renders mode toggle button', () => {
    render(<UseTransitionSection />)
    expect(screen.getByTestId('mode-toggle')).toBeInTheDocument()
  })

  it('default mode is transition', () => {
    render(<UseTransitionSection />)
    expect(screen.getByTestId('mode-toggle')).toHaveTextContent(/transition/i)
  })

  it('toggles mode on button click', async () => {
    render(<UseTransitionSection />)
    await userEvent.click(screen.getByTestId('mode-toggle'))
    expect(screen.getByTestId('mode-toggle')).toHaveTextContent(/normal/i)
  })

  it('updates input value on type', async () => {
    render(<UseTransitionSection />)
    const input = screen.getByTestId('search-input')
    await userEvent.type(input, 'Alice')
    expect(input).toHaveValue('Alice')
  })

  it('renders results list', () => {
    render(<UseTransitionSection />)
    expect(screen.getByTestId('results-list')).toBeInTheDocument()
  })
})
