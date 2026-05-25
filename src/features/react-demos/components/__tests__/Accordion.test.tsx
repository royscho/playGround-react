// src/features/react-demos/components/__tests__/Accordion.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Accordion } from '../Accordion'

const TestAccordion = () => (
  <Accordion>
    <Accordion.Item id="a">
      <Accordion.Trigger>Question A</Accordion.Trigger>
      <Accordion.Content>Answer A</Accordion.Content>
    </Accordion.Item>
    <Accordion.Item id="b">
      <Accordion.Trigger>Question B</Accordion.Trigger>
      <Accordion.Content>Answer B</Accordion.Content>
    </Accordion.Item>
  </Accordion>
)

describe('Accordion', () => {
  it('renders triggers', () => {
    render(<TestAccordion />)
    expect(screen.getByText('Question A')).toBeInTheDocument()
    expect(screen.getByText('Question B')).toBeInTheDocument()
  })

  it('content hidden by default', () => {
    render(<TestAccordion />)
    expect(screen.queryByText('Answer A')).not.toBeInTheDocument()
    expect(screen.queryByText('Answer B')).not.toBeInTheDocument()
  })

  it('shows content when trigger clicked', async () => {
    render(<TestAccordion />)
    await userEvent.click(screen.getByText('Question A'))
    expect(screen.getByText('Answer A')).toBeInTheDocument()
  })

  it('closes when same trigger clicked again', async () => {
    render(<TestAccordion />)
    await userEvent.click(screen.getByText('Question A'))
    await userEvent.click(screen.getByText('Question A'))
    expect(screen.queryByText('Answer A')).not.toBeInTheDocument()
  })

  it('closes previous when different trigger clicked', async () => {
    render(<TestAccordion />)
    await userEvent.click(screen.getByText('Question A'))
    await userEvent.click(screen.getByText('Question B'))
    expect(screen.queryByText('Answer A')).not.toBeInTheDocument()
    expect(screen.getByText('Answer B')).toBeInTheDocument()
  })
})
