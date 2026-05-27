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
