import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ChatPage from '../ChatPage'

window.HTMLElement.prototype.scrollIntoView = vi.fn()

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('ChatPage', () => {
  it('renders page heading', async () => {
    render(<ChatPage />)
    expect(screen.getByRole('heading', { name: /chat demo/i })).toBeInTheDocument()
  })

  it('renders message list', () => {
    render(<ChatPage />)
    expect(screen.getByTestId('message-list')).toBeInTheDocument()
  })

  it('renders connection status', () => {
    render(<ChatPage />)
    expect(screen.getByTestId('connection-status')).toBeInTheDocument()
  })

  it('renders protocol panel', () => {
    render(<ChatPage />)
    expect(screen.getByTestId('protocol-panel')).toBeInTheDocument()
  })

  it('renders message input', () => {
    render(<ChatPage />)
    expect(screen.getByTestId('message-input')).toBeInTheDocument()
  })

  it('renders send button', () => {
    render(<ChatPage />)
    expect(screen.getByTestId('send-button')).toBeInTheDocument()
  })
})
