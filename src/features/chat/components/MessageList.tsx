import { useEffect, useRef } from 'react'
import type { Message } from '../hooks/useChat'

interface Props {
  messages: Message[]
}

export function MessageList({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

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
