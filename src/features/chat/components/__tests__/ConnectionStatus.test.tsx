import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConnectionStatus } from '../ConnectionStatus'
import type { ConnectionStatus as StatusType } from '../../hooks/useChat'

describe('ConnectionStatus', () => {
  it('renders connecting state', () => {
    render(<ConnectionStatus status="connecting" readyState={0} />)
    expect(screen.getByTestId('connection-status')).toHaveTextContent(/connecting/i)
  })

  it('renders connected state', () => {
    render(<ConnectionStatus status="connected" readyState={1} />)
    expect(screen.getByTestId('connection-status')).toHaveTextContent(/connected/i)
  })

  it('renders disconnected state', () => {
    render(<ConnectionStatus status="disconnected" readyState={3} />)
    expect(screen.getByTestId('connection-status')).toHaveTextContent(/disconnected/i)
  })

  it('shows readyState number', () => {
    render(<ConnectionStatus status="connected" readyState={1} />)
    expect(screen.getByTestId('connection-status')).toHaveTextContent('1')
  })
})
