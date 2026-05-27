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
