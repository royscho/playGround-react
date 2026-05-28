import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { BottomSheet } from '../BottomSheet'
import { describe, it, expect, vi } from 'vitest'

function renderSheet(isOpen: boolean, onClose = vi.fn()) {
  return render(
    <MemoryRouter>
      <BottomSheet isOpen={isOpen} onClose={onClose} />
    </MemoryRouter>
  )
}

describe('BottomSheet', () => {
  it('renders all 5 overflow nav items', () => {
    renderSheet(true)
    expect(screen.getByRole('link', { name: /users/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /css examples/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /chat demo/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /performance/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /accessibility/i })).toBeInTheDocument()
  })

  it('applies translate-y-0 when open', () => {
    renderSheet(true)
    const sheet = screen.getByRole('navigation')
    expect(sheet).toHaveClass('translate-y-0')
  })

  it('applies translate-y-full when closed', () => {
    renderSheet(false)
    const sheet = screen.getByRole('navigation')
    expect(sheet).toHaveClass('translate-y-full')
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn()
    renderSheet(true, onClose)
    await userEvent.click(screen.getByRole('presentation'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when a nav item is clicked', async () => {
    const onClose = vi.fn()
    renderSheet(true, onClose)
    await userEvent.click(screen.getByRole('link', { name: /users/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
