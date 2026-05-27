# Chat + WebSocket Demo Page — Design Spec

**Date:** 2026-05-27  
**Status:** Approved

## Overview

Add a `/chat` route with a realistic chat UI powered by a `FakeWebSocket` class that mirrors the real WebSocket API exactly. Purpose: demonstrate WebSocket knowledge and chat UI implementation for senior frontend interviews.

## Route & Navigation

- Route: `/chat`
- Protected (requires auth, inside `AppLayout`)
- Sidebar nav link: `{ to: '/chat', label: 'Chat Demo', icon: '💬' }`

## Feature Structure

```
src/features/chat/
  components/
    ChatPage.tsx              # page shell, composes UI from useChat hook
    MessageList.tsx           # scrollable message list, user right / bot left
    ConnectionStatus.tsx      # badge showing connecting / connected / disconnected
    ProtocolPanel.tsx         # sidebar: raw WS frames log + readyState reference
  hooks/
    useChat.ts                # owns all state + WebSocket lifecycle
  utils/
    FakeWebSocket.ts          # mirrors real WebSocket API, simulates bot replies
  index.ts                    # re-exports ChatPage
```

## Components

### FakeWebSocket (`utils/FakeWebSocket.ts`)

Implements the real WebSocket interface:
- Properties: `readyState` (0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED), `url`
- Event handlers: `onopen`, `onmessage`, `onerror`, `onclose`
- Methods: `send(data: string)`, `close()`
- Behavior:
  - Constructor fires `onopen` after 300ms (simulates handshake)
  - `send()` logs the outbound frame, then fires `onmessage` with a bot reply after 800ms
  - `close()` sets readyState to CLOSED, fires `onclose`
- Bot replies: cycles through a fixed array of responses (`['Got it!', 'Interesting...', 'Tell me more.', 'Noted.', '👍']`)

### useChat (`hooks/useChat.ts`)

```ts
interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected'

interface UseChatReturn {
  messages: Message[]
  status: ConnectionStatus
  frames: FrameLog[]        // raw send/receive log for ProtocolPanel
  inputValue: string
  setInputValue: (v: string) => void
  send: () => void
  reconnect: () => void
}
```

- Creates `new FakeWebSocket('ws://localhost:8080/chat')` on mount
- Wires `onopen` → sets status to 'connected'
- Wires `onmessage` → appends bot message to `messages`, logs frame
- `send()` → appends user message, calls `ws.send()`, logs frame
- Cleans up (`ws.close()`) on unmount
- `reconnect()` → closes current socket, creates new one

### MessageList (`components/MessageList.tsx`)

- Scrollable `div` with `overflow-y-auto`
- User messages: right-aligned, blue bubble
- Bot messages: left-aligned, gray bubble
- Shows sender name + timestamp
- Auto-scrolls to bottom on new message (`useEffect` + `scrollIntoView`)
- `data-testid="message-list"`

### ConnectionStatus (`components/ConnectionStatus.tsx`)

- Badge with colored dot: yellow (connecting), green (connected), red (disconnected)
- Shows current `readyState` number in parentheses for educational value
- `data-testid="connection-status"`

### ProtocolPanel (`components/ProtocolPanel.tsx`)

- Two sub-sections:
  1. **readyState reference** — static table: 0 CONNECTING, 1 OPEN, 2 CLOSING, 3 CLOSED
  2. **Frame log** — scrollable list of sent/received frames with direction arrow (↑ sent, ↓ received), payload text, timestamp
- `data-testid="protocol-panel"`

### ChatPage (`components/ChatPage.tsx`)

- Two-column layout: chat (left, wider) + protocol panel (right, narrower)
- h1: "Chat Demo"
- Subtitle explaining this uses a simulated WebSocket with the real API
- ConnectionStatus + Reconnect button at top of chat column
- MessageList in center
- Input + Send button at bottom (send on Enter or button click)

## Data Flow

```
ChatPage
  └── useChat (state + WS lifecycle)
       ├── FakeWebSocket (simulates server)
       ├── messages[] → MessageList
       ├── status + readyState → ConnectionStatus
       ├── frames[] → ProtocolPanel
       └── inputValue + send() → input + button
```

## Testing

- `FakeWebSocket.test.ts` — unit tests: fires onopen, send triggers onmessage, close sets readyState
- `useChat.test.ts` — hook tests via `renderHook`: initial state, send adds user message, bot reply arrives
- `MessageList.test.tsx` — renders messages, user right / bot left
- `ConnectionStatus.test.tsx` — renders correct badge per status
- `ProtocolPanel.test.tsx` — renders panel, shows frame log
- `ChatPage.test.tsx` — integration: heading, input, send, message appears

## Out of Scope

- Real WebSocket server
- Multi-room / multi-user
- Message persistence
- File/image messages
- Typing indicators
- Read receipts
