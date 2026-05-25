import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CompoundComponentsSection } from '../CompoundComponentsSection'

describe('CompoundComponentsSection', () => {
  it('renders section heading', () => {
    render(<CompoundComponentsSection />)
    expect(screen.getByRole('heading', { name: /compound components/i })).toBeInTheDocument()
  })

  it('renders accordion demo', () => {
    render(<CompoundComponentsSection />)
    expect(screen.getByTestId('accordion-demo')).toBeInTheDocument()
  })

  it('accordion items are collapsed by default', () => {
    render(<CompoundComponentsSection />)
    expect(screen.queryByText(/a javascript library/i)).not.toBeInTheDocument()
  })

  it('accordion item opens on trigger click', async () => {
    render(<CompoundComponentsSection />)
    await userEvent.click(screen.getByText('What is React?'))
    expect(screen.getByText(/a javascript library/i)).toBeInTheDocument()
  })

  it('renders code explanation panel', () => {
    render(<CompoundComponentsSection />)
    expect(screen.getByTestId('code-panel')).toBeInTheDocument()
  })
})
