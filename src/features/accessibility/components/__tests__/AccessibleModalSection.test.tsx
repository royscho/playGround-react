import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AccessibleModalSection } from '../AccessibleModalSection'

describe('AccessibleModalSection', () => {
  it('renders trigger button', () => {
    render(<AccessibleModalSection />)
    expect(screen.getByTestId('modal-trigger')).toBeInTheDocument()
  })

  it('modal is not rendered initially', () => {
    render(<AccessibleModalSection />)
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('opens modal on trigger click', async () => {
    render(<AccessibleModalSection />)
    await userEvent.click(screen.getByTestId('modal-trigger'))
    expect(screen.getByTestId('modal')).toBeInTheDocument()
  })

  it('modal has role="dialog"', async () => {
    render(<AccessibleModalSection />)
    await userEvent.click(screen.getByTestId('modal-trigger'))
    expect(screen.getByTestId('modal')).toHaveAttribute('role', 'dialog')
  })

  it('modal has aria-modal="true"', async () => {
    render(<AccessibleModalSection />)
    await userEvent.click(screen.getByTestId('modal-trigger'))
    expect(screen.getByTestId('modal')).toHaveAttribute('aria-modal', 'true')
  })

  it('modal has aria-labelledby pointing to title id', async () => {
    render(<AccessibleModalSection />)
    await userEvent.click(screen.getByTestId('modal-trigger'))
    expect(screen.getByTestId('modal')).toHaveAttribute('aria-labelledby', 'modal-title')
    expect(document.getElementById('modal-title')).toBeInTheDocument()
  })

  it('Escape key closes modal', async () => {
    render(<AccessibleModalSection />)
    await userEvent.click(screen.getByTestId('modal-trigger'))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('Cancel button closes modal', async () => {
    render(<AccessibleModalSection />)
    await userEvent.click(screen.getByTestId('modal-trigger'))
    await userEvent.click(screen.getByTestId('modal-cancel'))
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('Confirm button closes modal', async () => {
    render(<AccessibleModalSection />)
    await userEvent.click(screen.getByTestId('modal-trigger'))
    await userEvent.click(screen.getByTestId('modal-confirm'))
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('backdrop click closes modal', async () => {
    render(<AccessibleModalSection />)
    await userEvent.click(screen.getByTestId('modal-trigger'))
    // Click the backdrop (the element directly behind the modal)
    const backdrop = document.querySelector('.fixed.inset-0') as HTMLElement
    await userEvent.click(backdrop)
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('focus returns to trigger after modal closes', async () => {
    render(<AccessibleModalSection />)
    await userEvent.click(screen.getByTestId('modal-trigger'))
    await userEvent.click(screen.getByTestId('modal-cancel'))
    expect(screen.getByTestId('modal-trigger')).toHaveFocus()
  })
})
