import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import { BottomNav } from '../BottomNav'

function renderBottomNav(onMoreClick = vi.fn()) {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <BottomNav onMoreClick={onMoreClick} />
    </MemoryRouter>
  )
}

describe('BottomNav', () => {
  it('renders 4 primary nav links', () => {
    renderBottomNav()
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /analytics/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /demos/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument()
  })

  it('renders More button', () => {
    renderBottomNav()
    expect(screen.getByRole('button', { name: /more navigation items/i })).toBeInTheDocument()
  })

  it('calls onMoreClick when More button is clicked', async () => {
    const onMoreClick = vi.fn()
    renderBottomNav(onMoreClick)
    await userEvent.click(screen.getByRole('button', { name: /more navigation items/i }))
    expect(onMoreClick).toHaveBeenCalledOnce()
  })

  it('has md:hidden class to hide on desktop', () => {
    const { container } = renderBottomNav()
    expect(container.firstChild).toHaveClass('md:hidden')
  })
})
