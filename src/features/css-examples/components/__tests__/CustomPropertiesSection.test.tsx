import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CustomPropertiesSection } from '../CustomPropertiesSection'

describe('CustomPropertiesSection', () => {
  it('renders section heading', () => {
    render(<CustomPropertiesSection />)
    expect(screen.getByRole('heading', { name: /custom properties/i })).toBeInTheDocument()
  })

  it('renders theme preview with default ocean theme', () => {
    render(<CustomPropertiesSection />)
    expect(screen.getByTestId('theme-preview')).toHaveAttribute('data-theme', 'ocean')
  })

  it('toggles to forest theme on button click', async () => {
    render(<CustomPropertiesSection />)
    await userEvent.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('theme-preview')).toHaveAttribute('data-theme', 'forest')
  })

  it('toggles back to ocean on second click', async () => {
    render(<CustomPropertiesSection />)
    await userEvent.click(screen.getByTestId('theme-toggle'))
    await userEvent.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('theme-preview')).toHaveAttribute('data-theme', 'ocean')
  })
})
