import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AccessibleFormSection } from '../AccessibleFormSection'

describe('AccessibleFormSection', () => {
  it('renders form with all three fields', () => {
    render(<AccessibleFormSection />)
    expect(screen.getByTestId('a11y-form')).toBeInTheDocument()
    expect(screen.getByTestId('field-name')).toBeInTheDocument()
    expect(screen.getByTestId('field-email')).toBeInTheDocument()
    expect(screen.getByTestId('field-message')).toBeInTheDocument()
  })

  it('submit with empty Name sets aria-invalid="true" on Name field', async () => {
    render(<AccessibleFormSection />)
    await userEvent.click(screen.getByRole('button', { name: /send/i }))
    expect(screen.getByTestId('field-name')).toHaveAttribute('aria-invalid', 'true')
  })

  it('submit with empty Email sets aria-invalid="true" on Email field', async () => {
    render(<AccessibleFormSection />)
    await userEvent.type(screen.getByTestId('field-name'), 'Alice')
    await userEvent.click(screen.getByRole('button', { name: /send/i }))
    expect(screen.getByTestId('field-email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('submit with invalid Email (no @) sets aria-invalid="true" on Email field', async () => {
    render(<AccessibleFormSection />)
    await userEvent.type(screen.getByTestId('field-name'), 'Alice')
    await userEvent.type(screen.getByTestId('field-email'), 'notanemail')
    await userEvent.click(screen.getByRole('button', { name: /send/i }))
    expect(screen.getByTestId('field-email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('submit with all errors shows "Form has 2 errors" in live region', async () => {
    render(<AccessibleFormSection />)
    await userEvent.click(screen.getByRole('button', { name: /send/i }))
    expect(screen.getByTestId('form-live-region')).toHaveTextContent('Form has 2 errors')
  })

  it('valid submit shows "Message sent!" in live region', async () => {
    render(<AccessibleFormSection />)
    await userEvent.type(screen.getByTestId('field-name'), 'Alice')
    await userEvent.type(screen.getByTestId('field-email'), 'alice@example.com')
    await userEvent.click(screen.getByRole('button', { name: /send/i }))
    expect(screen.getByTestId('form-live-region')).toHaveTextContent('Message sent!')
  })

  it('valid submit clears aria-invalid', async () => {
    render(<AccessibleFormSection />)
    // First trigger errors
    await userEvent.click(screen.getByRole('button', { name: /send/i }))
    expect(screen.getByTestId('field-name')).toHaveAttribute('aria-invalid', 'true')
    // Then fix and submit successfully
    await userEvent.type(screen.getByTestId('field-name'), 'Alice')
    await userEvent.type(screen.getByTestId('field-email'), 'alice@example.com')
    await userEvent.click(screen.getByRole('button', { name: /send/i }))
    expect(screen.getByTestId('field-name')).toHaveAttribute('aria-invalid', 'false')
    expect(screen.getByTestId('field-email')).toHaveAttribute('aria-invalid', 'false')
  })

  it('error elements have role="alert"', async () => {
    render(<AccessibleFormSection />)
    await userEvent.click(screen.getByRole('button', { name: /send/i }))
    expect(document.getElementById('error-name')).toHaveAttribute('role', 'alert')
    expect(document.getElementById('error-email')).toHaveAttribute('role', 'alert')
  })

  it('fields are linked via aria-describedby to error element ids', () => {
    render(<AccessibleFormSection />)
    expect(screen.getByTestId('field-name')).toHaveAttribute('aria-describedby', 'error-name')
    expect(screen.getByTestId('field-email')).toHaveAttribute('aria-describedby', 'error-email')
  })
})
