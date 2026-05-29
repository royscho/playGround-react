import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ModalSection } from '../ModalSection'

describe('ModalSection', () => {
  it('renders section heading', () => {
    render(<ModalSection />)
    expect(screen.getByRole('heading', { name: /modal/i })).toBeInTheDocument()
  })

  it('no modal visible on initial render', () => {
    render(<ModalSection />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('What is a Modal?')).not.toBeInTheDocument()
    expect(screen.queryByText('Delete Item')).not.toBeInTheDocument()
    expect(screen.queryByText('Edit Name')).not.toBeInTheDocument()
  })

  it('clicking Open Info Modal shows info modal', async () => {
    render(<ModalSection />)
    await userEvent.click(screen.getByRole('button', { name: /open info modal/i }))
    expect(screen.getByText('What is a Modal?')).toBeInTheDocument()
  })

  it('clicking Open Confirm Modal shows confirm modal', async () => {
    render(<ModalSection />)
    await userEvent.click(screen.getByRole('button', { name: /open confirm modal/i }))
    expect(screen.getByText('Delete Item')).toBeInTheDocument()
    expect(screen.getByText(/cannot be undone/i)).toBeInTheDocument()
  })

  it('clicking Open Form Modal shows form modal', async () => {
    render(<ModalSection />)
    await userEvent.click(screen.getByRole('button', { name: /open form modal/i }))
    expect(screen.getByText('Edit Name')).toBeInTheDocument()
    expect(screen.getByTestId('form-modal-input')).toBeInTheDocument()
  })

  it('close button on info modal hides it', async () => {
    render(<ModalSection />)
    await userEvent.click(screen.getByRole('button', { name: /open info modal/i }))
    await userEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(screen.queryByText('What is a Modal?')).not.toBeInTheDocument()
  })

  it('Escape key closes open modal', async () => {
    render(<ModalSection />)
    await userEvent.click(screen.getByRole('button', { name: /open info modal/i }))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByText('What is a Modal?')).not.toBeInTheDocument()
  })

  it('Cancel button on confirm modal closes it', async () => {
    render(<ModalSection />)
    await userEvent.click(screen.getByRole('button', { name: /open confirm modal/i }))
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(screen.queryByText('Delete Item')).not.toBeInTheDocument()
  })

  it('form modal input is empty when opened', async () => {
    render(<ModalSection />)
    await userEvent.click(screen.getByRole('button', { name: /open form modal/i }))
    expect(screen.getByTestId('form-modal-input')).toHaveValue('')
  })

  it('clicking backdrop closes modal', async () => {
    render(<ModalSection />)
    await userEvent.click(screen.getByRole('button', { name: /open info modal/i }))
    await userEvent.click(screen.getByTestId('modal-backdrop'))
    expect(screen.queryByText('What is a Modal?')).not.toBeInTheDocument()
  })
})
