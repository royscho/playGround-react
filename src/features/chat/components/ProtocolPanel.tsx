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
