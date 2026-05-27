import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MessageList } from '../MessageList'
import type { Message } from '../../hooks/useChat'

window.HTMLElement.prototype.scrollIntoView = vi.fn()

afterEach(() => vi.clearAllMocks())

const userMsg: Message = { id: '1', text: 'Hello', sender: 'user', timestamp: new Date() }
const botMsg: Message = { id: '2', text: 'Got it!', sender: 'bot', timestamp: new Date() }

describe('MessageList', () => {
  it('renders message list container', () => {
    render(<MessageList messages={[]} />)
    expect(screen.getByTestId('message-list')).toBeInTheDocument()
  })

  it('renders user message', () => {
    render(<MessageList messages={[userMsg]} />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders bot message', () => {
    render(<MessageList messages={[botMsg]} />)
    expect(screen.getByText('Got it!')).toBeInTheDocument()
  })

  it('shows empty state when no messages', () => {
    render(<MessageList messages={[]} />)
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('renders both messages when multiple', () => {
    render(<MessageList messages={[userMsg, botMsg]} />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Got it!')).toBeInTheDocument()
  })

  it('calls scrollIntoView when message added', () => {
    const { rerender } = render(<MessageList messages={[]} />)
    rerender(<MessageList messages={[userMsg]} />)
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled()
  })
})
