# Chat + WebSocket Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/chat` page with a realistic chat UI powered by a `FakeWebSocket` class that mirrors the real WebSocket API, demonstrating WebSocket knowledge for senior frontend interviews.

**Architecture:** `FakeWebSocket` simulates the browser WebSocket API with realistic timing (300ms connect, 800ms bot reply). `useChat` hook owns all state and WS lifecycle. Four UI components handle display only — no logic leaks into components.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v4, Vitest + Testing Library + renderHook, fake timers via `vi.useFakeTimers()`.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/features/chat/utils/FakeWebSocket.ts` | Mirrors real WebSocket API, simulates bot replies |
| Create | `src/features/chat/hooks/useChat.ts` | State + WebSocket lifecycle |
| Create | `src/features/chat/components/ConnectionStatus.tsx` | Badge: connecting / connected / disconnected |
| Create | `src/features/chat/components/MessageList.tsx` | Scrollable message list, user right / bot left |
| Create | `src/features/chat/components/ProtocolPanel.tsx` | readyState reference + frame log |
| Create | `src/features/chat/components/ChatPage.tsx` | Page shell composing all components |
| Create | `src/features/chat/index.ts` | Public re-export |
| Create | `src/features/chat/utils/__tests__/FakeWebSocket.test.ts` | Unit tests for FakeWebSocket |
| Create | `src/features/chat/hooks/__tests__/useChat.test.tsx` | Hook tests with renderHook + fake timers |
| Create | `src/features/chat/components/__tests__/ConnectionStatus.test.tsx` | Badge render tests |
| Create | `src/features/chat/components/__tests__/MessageList.test.tsx` | Message render tests |
| Create | `src/features/chat/components/__tests__/ProtocolPanel.test.tsx` | Panel render tests |
| Create | `src/features/chat/components/__tests__/ChatPage.test.tsx` | Integration render tests |
| Modify | `src/app/router.tsx` | Add lazy import + `/chat` route |
| Modify | `src/app/layout/Sidebar.tsx` | Add Chat Demo nav item |

---

## Task 1: FakeWebSocket

**Files:**
- Create: `src/features/chat/utils/__tests__/FakeWebSocket.test.ts`
- Create: `src/features/chat/utils/FakeWebSocket.ts`

- [ ] **Step 1: Write failing test**

```ts
// src/features/chat/utils/__tests__/FakeWebSocket.test.ts
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
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run src/features/chat/utils/__tests__/FakeWebSocket.test.ts
```

Expected: FAIL — `Cannot find module '../FakeWebSocket'`

- [ ] **Step 3: Write implementation**

```ts
// src/features/chat/utils/FakeWebSocket.ts
const BOT_REPLIES = ['Got it!', 'Interesting...', 'Tell me more.', 'Noted.', '👍']

export class FakeWebSocket {
  readonly url: string
  readyState: number = 0 // CONNECTING

  onopen: (() => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  onclose: (() => void) | null = null

  private replyIndex = 0

  constructor(url: string) {
    this.url = url
    setTimeout(() => {
      this.readyState = 1 // OPEN
      this.onopen?.()
    }, 300)
  }

  send(data: string): void {
    if (this.readyState !== 1) return
    const reply = BOT_REPLIES[this.replyIndex % BOT_REPLIES.length]
    this.replyIndex++
    setTimeout(() => {
      this.onmessage?.(new MessageEvent('message', { data: reply }))
    }, 800)
  }

  close(): void {
    this.readyState = 3 // CLOSED
    this.onclose?.()
  }
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx vitest run src/features/chat/utils/__tests__/FakeWebSocket.test.ts
```

Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/chat/utils/FakeWebSocket.ts \
        src/features/chat/utils/__tests__/FakeWebSocket.test.ts
git commit -m "feat: add FakeWebSocket simulating real WebSocket API"
```

---

## Task 2: useChat hook

**Files:**
- Create: `src/features/chat/hooks/__tests__/useChat.test.tsx`
- Create: `src/features/chat/hooks/useChat.ts`

- [ ] **Step 1: Write failing test**

```tsx
// src/features/chat/hooks/__tests__/useChat.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useChat } from '../useChat'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('useChat', () => {
  it('starts as connecting', () => {
    const { result } = renderHook(() => useChat())
    expect(result.current.status).toBe('connecting')
  })

  it('transitions to connected after 300ms', async () => {
    const { result } = renderHook(() => useChat())
    await act(async () => { vi.advanceTimersByTime(300) })
    expect(result.current.status).toBe('connected')
  })

  it('starts with empty messages', () => {
    const { result } = renderHook(() => useChat())
    expect(result.current.messages).toHaveLength(0)
  })

  it('send() appends user message immediately', async () => {
    const { result } = renderHook(() => useChat())
    await act(async () => { vi.advanceTimersByTime(300) })
    act(() => { result.current.setInputValue('Hello') })
    await act(async () => { result.current.send() })
    expect(result.current.messages).toHaveLength(1)
    expect(result.current.messages[0].sender).toBe('user')
    expect(result.current.messages[0].text).toBe('Hello')
  })

  it('bot reply arrives after 800ms', async () => {
    const { result } = renderHook(() => useChat())
    await act(async () => { vi.advanceTimersByTime(300) })
    act(() => { result.current.setInputValue('Hello') })
    await act(async () => { result.current.send() })
    await act(async () => { vi.advanceTimersByTime(800) })
    expect(result.current.messages).toHaveLength(2)
    expect(result.current.messages[1].sender).toBe('bot')
  })

  it('send() clears inputValue', async () => {
    const { result } = renderHook(() => useChat())
    await act(async () => { vi.advanceTimersByTime(300) })
    act(() => { result.current.setInputValue('Hello') })
    await act(async () => { result.current.send() })
    expect(result.current.inputValue).toBe('')
  })

  it('send() logs a frame', async () => {
    const { result } = renderHook(() => useChat())
    await act(async () => { vi.advanceTimersByTime(300) })
    act(() => { result.current.setInputValue('Hello') })
    await act(async () => { result.current.send() })
    expect(result.current.frames).toHaveLength(1)
    expect(result.current.frames[0].direction).toBe('sent')
  })

  it('bot reply logs a received frame', async () => {
    const { result } = renderHook(() => useChat())
    await act(async () => { vi.advanceTimersByTime(300) })
    act(() => { result.current.setInputValue('Hello') })
    await act(async () => { result.current.send() })
    await act(async () => { vi.advanceTimersByTime(800) })
    expect(result.current.frames).toHaveLength(2)
    expect(result.current.frames[1].direction).toBe('received')
  })

  it('reconnect() resets to connecting', async () => {
    const { result } = renderHook(() => useChat())
    await act(async () => { vi.advanceTimersByTime(300) })
    await act(async () => { result.current.reconnect() })
    expect(result.current.status).toBe('connecting')
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run src/features/chat/hooks/__tests__/useChat.test.tsx
```

Expected: FAIL — `Cannot find module '../useChat'`

- [ ] **Step 3: Write implementation**

```ts
// src/features/chat/hooks/useChat.ts
import { useState, useEffect, useRef, useCallback } from 'react'
import { FakeWebSocket } from '../utils/FakeWebSocket'

export interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export interface FrameLog {
  id: string
  direction: 'sent' | 'received'
  payload: string
  timestamp: Date
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected'

let msgCounter = 0
let frameCounter = 0

function makeId() { return String(++msgCounter) }
function makeFrameId() { return String(++frameCounter) }

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [frames, setFrames] = useState<FrameLog[]>([])
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  const [inputValue, setInputValue] = useState('')
  const wsRef = useRef<FakeWebSocket | null>(null)

  const connect = useCallback(() => {
    const ws = new FakeWebSocket('ws://localhost:8080/chat')
    wsRef.current = ws
    setStatus('connecting')

    ws.onopen = () => setStatus('connected')

    ws.onmessage = (e: MessageEvent) => {
      setMessages(prev => [...prev, {
        id: makeId(),
        text: e.data as string,
        sender: 'bot',
        timestamp: new Date(),
      }])
      setFrames(prev => [...prev, {
        id: makeFrameId(),
        direction: 'received',
        payload: e.data as string,
        timestamp: new Date(),
      }])
    }

    ws.onclose = () => setStatus('disconnected')
  }, [])

  useEffect(() => {
    connect()
    return () => { wsRef.current?.close() }
  }, [connect])

  const send = useCallback(() => {
    const text = inputValue.trim()
    if (!text || status !== 'connected') return
    setMessages(prev => [...prev, {
      id: makeId(),
      text,
      sender: 'user',
      timestamp: new Date(),
    }])
    setFrames(prev => [...prev, {
      id: makeFrameId(),
      direction: 'sent',
      payload: text,
      timestamp: new Date(),
    }])
    wsRef.current?.send(text)
    setInputValue('')
  }, [inputValue, status])

  const reconnect = useCallback(() => {
    wsRef.current?.close()
    setMessages([])
    setFrames([])
    connect()
  }, [connect])

  return { messages, frames, status, inputValue, setInputValue, send, reconnect }
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx vitest run src/features/chat/hooks/__tests__/useChat.test.tsx
```

Expected: PASS (9 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/chat/hooks/useChat.ts \
        src/features/chat/hooks/__tests__/useChat.test.tsx
git commit -m "feat: add useChat hook with FakeWebSocket lifecycle"
```

---

## Task 3: ConnectionStatus component

**Files:**
- Create: `src/features/chat/components/__tests__/ConnectionStatus.test.tsx`
- Create: `src/features/chat/components/ConnectionStatus.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/features/chat/components/__tests__/ConnectionStatus.test.tsx
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
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run src/features/chat/components/__tests__/ConnectionStatus.test.tsx
```

Expected: FAIL — `Cannot find module '../ConnectionStatus'`

- [ ] **Step 3: Write implementation**

```tsx
// src/features/chat/components/ConnectionStatus.tsx
import type { ConnectionStatus as StatusType } from '../hooks/useChat'

interface Props {
  status: StatusType
  readyState: number
}

const config: Record<StatusType, { label: string; dot: string; text: string }> = {
  connecting: { label: 'Connecting', dot: 'bg-yellow-400', text: 'text-yellow-700 dark:text-yellow-400' },
  connected:  { label: 'Connected',  dot: 'bg-green-400',  text: 'text-green-700 dark:text-green-400'  },
  disconnected: { label: 'Disconnected', dot: 'bg-red-400', text: 'text-red-700 dark:text-red-400' },
}

export function ConnectionStatus({ status, readyState }: Props) {
  const { label, dot, text } = config[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${text}`}
      data-testid="connection-status"
    >
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {label} ({readyState})
    </span>
  )
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx vitest run src/features/chat/components/__tests__/ConnectionStatus.test.tsx
```

Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/chat/components/ConnectionStatus.tsx \
        src/features/chat/components/__tests__/ConnectionStatus.test.tsx
git commit -m "feat: add ConnectionStatus badge component"
```

---

## Task 4: MessageList component

**Files:**
- Create: `src/features/chat/components/__tests__/MessageList.test.tsx`
- Create: `src/features/chat/components/MessageList.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/features/chat/components/__tests__/MessageList.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MessageList } from '../MessageList'
import type { Message } from '../../hooks/useChat'

window.HTMLElement.prototype.scrollIntoView = vi.fn()

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
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run src/features/chat/components/__tests__/MessageList.test.tsx
```

Expected: FAIL — `Cannot find module '../MessageList'`

- [ ] **Step 3: Write implementation**

```tsx
// src/features/chat/components/MessageList.tsx
import { useEffect, useRef } from 'react'
import type { Message } from '../hooks/useChat'

interface Props {
  messages: Message[]
}

export function MessageList({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div
      className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
      data-testid="message-list"
    >
      {messages.length === 0 ? (
        <p className="m-auto text-sm text-gray-400" data-testid="empty-state">
          No messages yet. Say hello!
        </p>
      ) : (
        messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs rounded-2xl px-4 py-2 text-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
              }`}
            >
              <p>{msg.text}</p>
              <p className={`mt-0.5 text-xs ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))
      )}
      <div ref={bottomRef} />
    </div>
  )
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx vitest run src/features/chat/components/__tests__/MessageList.test.tsx
```

Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/chat/components/MessageList.tsx \
        src/features/chat/components/__tests__/MessageList.test.tsx
git commit -m "feat: add MessageList component with auto-scroll"
```

---

## Task 5: ProtocolPanel component

**Files:**
- Create: `src/features/chat/components/__tests__/ProtocolPanel.test.tsx`
- Create: `src/features/chat/components/ProtocolPanel.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/features/chat/components/__tests__/ProtocolPanel.test.tsx
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
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run src/features/chat/components/__tests__/ProtocolPanel.test.tsx
```

Expected: FAIL — `Cannot find module '../ProtocolPanel'`

- [ ] **Step 3: Write implementation**

```tsx
// src/features/chat/components/ProtocolPanel.tsx
import type { FrameLog } from '../hooks/useChat'

const READY_STATES = [
  { code: 0, name: 'CONNECTING' },
  { code: 1, name: 'OPEN' },
  { code: 2, name: 'CLOSING' },
  { code: 3, name: 'CLOSED' },
]

interface Props {
  frames: FrameLog[]
}

export function ProtocolPanel({ frames }: Props) {
  return (
    <div
      className="flex flex-col gap-4 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
      data-testid="protocol-panel"
    >
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          readyState
        </p>
        <table className="w-full text-xs" data-testid="ready-state-table">
          <tbody>
            {READY_STATES.map(({ code, name }) => (
              <tr key={code} className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-1 pr-3 font-mono text-blue-600 dark:text-blue-400">{code}</td>
                <td className="py-1 text-gray-700 dark:text-gray-300">{name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Frame Log
        </p>
        <div className="flex-1 overflow-y-auto font-mono text-xs">
          {frames.length === 0 ? (
            <p className="text-gray-400" data-testid="empty-frames">No frames yet.</p>
          ) : (
            frames.map(frame => (
              <div key={frame.id} className="mb-1 flex gap-2">
                <span
                  className={frame.direction === 'sent' ? 'text-blue-500' : 'text-green-500'}
                  data-testid={`frame-direction-${frame.id}`}
                >
                  {frame.direction === 'sent' ? '↑' : '↓'}
                </span>
                <span className="truncate text-gray-700 dark:text-gray-300">{frame.payload}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx vitest run src/features/chat/components/__tests__/ProtocolPanel.test.tsx
```

Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/chat/components/ProtocolPanel.tsx \
        src/features/chat/components/__tests__/ProtocolPanel.test.tsx
git commit -m "feat: add ProtocolPanel with readyState reference and frame log"
```

---

## Task 6: ChatPage + index.ts

**Files:**
- Create: `src/features/chat/components/__tests__/ChatPage.test.tsx`
- Create: `src/features/chat/components/ChatPage.tsx`
- Create: `src/features/chat/index.ts`

- [ ] **Step 1: Write failing test**

```tsx
// src/features/chat/components/__tests__/ChatPage.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run src/features/chat/components/__tests__/ChatPage.test.tsx
```

Expected: FAIL — `Cannot find module '../ChatPage'`

- [ ] **Step 3: Write ChatPage**

```tsx
// src/features/chat/components/ChatPage.tsx
import { useChat } from '../hooks/useChat'
import { ConnectionStatus } from './ConnectionStatus'
import { MessageList } from './MessageList'
import { ProtocolPanel } from './ProtocolPanel'

export default function ChatPage() {
  const { messages, frames, status, inputValue, setInputValue, send, reconnect } = useChat()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') send()
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col p-6">
      <h1 className="mb-1 text-2xl font-semibold text-gray-900 dark:text-white">Chat Demo</h1>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Real-time chat powered by a simulated WebSocket — same API as production.
      </p>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Chat column */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <ConnectionStatus status={status} readyState={status === 'connecting' ? 0 : status === 'connected' ? 1 : 3} />
            <button
              type="button"
              onClick={reconnect}
              className="text-xs text-blue-600 hover:underline dark:text-blue-400"
            >
              Reconnect
            </button>
          </div>

          {/* Messages */}
          <MessageList messages={messages} />

          {/* Input */}
          <div className="flex gap-2 border-t border-gray-200 p-3 dark:border-gray-700">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={status !== 'connected'}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              data-testid="message-input"
            />
            <button
              type="button"
              onClick={send}
              disabled={status !== 'connected' || !inputValue.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              data-testid="send-button"
            >
              Send
            </button>
          </div>
        </div>

        {/* Protocol panel */}
        <div className="w-56 flex-shrink-0 lg:w-72">
          <ProtocolPanel frames={frames} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Write index.ts**

```ts
// src/features/chat/index.ts
export { default as ChatPage } from './components/ChatPage'
```

- [ ] **Step 5: Run test — verify it passes**

```bash
npx vitest run src/features/chat/components/__tests__/ChatPage.test.tsx
```

Expected: PASS (6 tests)

- [ ] **Step 6: Run all chat tests**

```bash
npx vitest run src/features/chat
```

Expected: all pass (29 tests across 6 files)

- [ ] **Step 7: Commit**

```bash
git add src/features/chat/components/ChatPage.tsx \
        src/features/chat/components/__tests__/ChatPage.test.tsx \
        src/features/chat/index.ts
git commit -m "feat: add ChatPage composing WebSocket chat UI"
```

---

## Task 7: Wire router + sidebar

**Files:**
- Modify: `src/app/router.tsx`
- Modify: `src/app/layout/Sidebar.tsx`

- [ ] **Step 1: Add lazy import to router**

In `src/app/router.tsx`, add after the `ReactDemosPage` lazy import:

```tsx
const ChatPage = lazy(() => import('../features/chat/components/ChatPage'))
```

- [ ] **Step 2: Add route inside protected block**

In `src/app/router.tsx`, inside `<Route element={<AppLayout />}>`, add after the `/react-demos` route:

```tsx
<Route
  path="/chat"
  element={
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <ChatPage />
      </Suspense>
    </ErrorBoundary>
  }
/>
```

- [ ] **Step 3: Add sidebar nav item**

In `src/app/layout/Sidebar.tsx`, add to `navItems` after the React Demos entry:

```tsx
{ to: '/chat', label: 'Chat Demo', icon: '💬' },
```

- [ ] **Step 4: Run all chat tests**

```bash
npx vitest run src/features/chat
```

Expected: all pass

- [ ] **Step 5: Run full test suite**

```bash
npx vitest run
```

Expected: all tests pass, no regressions

- [ ] **Step 6: Commit**

```bash
git add src/app/router.tsx src/app/layout/Sidebar.tsx
git commit -m "feat: wire /chat route and sidebar nav link"
```
