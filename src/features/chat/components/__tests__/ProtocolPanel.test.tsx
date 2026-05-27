import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProtocolPanel } from '../ProtocolPanel'
import type { FrameLog } from '../../hooks/useChat'

const sentFrame: FrameLog = { id: '1', direction: 'sent', payload: 'Hello', timestamp: new Date() }
const receivedFrame: FrameLog = { id: '2', direction: 'received', payload: 'Got it!', timestamp: new Date() }

describe('ProtocolPanel', () => {
  it('renders protocol panel', () => {
    render(<ProtocolPanel frames={[]} />)
    expect(screen.getByTestId('protocol-panel')).toBeInTheDocument()
  })

  it('renders readyState reference table', () => {
    render(<ProtocolPanel frames={[]} />)
    expect(screen.getByTestId('ready-state-table')).toBeInTheDocument()
    expect(screen.getByText('CONNECTING')).toBeInTheDocument()
    expect(screen.getByText('OPEN')).toBeInTheDocument()
    expect(screen.getByText('CLOSING')).toBeInTheDocument()
    expect(screen.getByText('CLOSED')).toBeInTheDocument()
  })

  it('renders sent frame with up arrow', () => {
    render(<ProtocolPanel frames={[sentFrame]} />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByTestId('frame-direction-1')).toHaveTextContent('↑')
  })

  it('renders received frame with down arrow', () => {
    render(<ProtocolPanel frames={[receivedFrame]} />)
    expect(screen.getByText('Got it!')).toBeInTheDocument()
    expect(screen.getByTestId('frame-direction-2')).toHaveTextContent('↓')
  })

  it('shows empty frame log message when no frames', () => {
    render(<ProtocolPanel frames={[]} />)
    expect(screen.getByTestId('empty-frames')).toBeInTheDocument()
  })
})
