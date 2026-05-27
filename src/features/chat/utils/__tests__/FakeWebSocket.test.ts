import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { FakeWebSocket } from '../FakeWebSocket'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('FakeWebSocket', () => {
  it('starts in CONNECTING state', () => {
    const ws = new FakeWebSocket('ws://localhost/chat')
    expect(ws.readyState).toBe(0)
  })

  it('fires onopen after 300ms and transitions to OPEN', () => {
    const ws = new FakeWebSocket('ws://localhost/chat')
    const onopen = vi.fn()
    ws.onopen = onopen
    vi.advanceTimersByTime(300)
    expect(onopen).toHaveBeenCalledOnce()
    expect(ws.readyState).toBe(1)
  })

  it('fires onmessage with bot reply 800ms after send', () => {
    const ws = new FakeWebSocket('ws://localhost/chat')
    vi.advanceTimersByTime(300) // open
    const onmessage = vi.fn()
    ws.onmessage = onmessage
    ws.send('Hello')
    expect(onmessage).not.toHaveBeenCalled()
    vi.advanceTimersByTime(800)
    expect(onmessage).toHaveBeenCalledOnce()
    expect(onmessage.mock.calls[0][0]).toHaveProperty('data')
  })

  it('cycles through bot replies', () => {
    const ws = new FakeWebSocket('ws://localhost/chat')
    vi.advanceTimersByTime(300)
    const replies: string[] = []
    ws.onmessage = (e: MessageEvent) => replies.push(e.data)
    ws.send('msg1')
    vi.advanceTimersByTime(800)
    ws.send('msg2')
    vi.advanceTimersByTime(800)
    expect(replies).toHaveLength(2)
    expect(replies[0]).not.toBe(replies[1])
  })

  it('close() sets readyState to CLOSED and fires onclose', () => {
    const ws = new FakeWebSocket('ws://localhost/chat')
    vi.advanceTimersByTime(300)
    const onclose = vi.fn()
    ws.onclose = onclose
    ws.close()
    expect(ws.readyState).toBe(3)
    expect(onclose).toHaveBeenCalledOnce()
  })

  it('stores url', () => {
    const ws = new FakeWebSocket('ws://localhost/chat')
    expect(ws.url).toBe('ws://localhost/chat')
  })
})
