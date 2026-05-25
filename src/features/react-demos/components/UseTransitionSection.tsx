// src/features/react-demos/components/UseTransitionSection.tsx
import { useState, useTransition, useMemo } from 'react'

const NAMES = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Hank', 'Ivy', 'Jack']
const ALL_ITEMS = Array.from({ length: 10_000 }, (_, i) => `${NAMES[i % NAMES.length]} #${i + 1}`)

type Mode = 'normal' | 'transition'

// Simulates an expensive component render (for demo purposes only).
// Each item takes ~0.3ms — 100 items = ~30ms total, enough to feel as lag.
// eslint-disable-next-line react-hooks/purity
function SlowItem({ text }: { text: string }) {
  // eslint-disable-next-line react-hooks/purity
  const start = performance.now()
  // eslint-disable-next-line react-hooks/purity, no-empty
  while (performance.now() - start < 0.3) { /* artificial slow render */ }
  return (
    <div className="border-b border-gray-100 px-3 py-1 text-sm dark:border-gray-800 dark:text-gray-300">
      {text}
    </div>
  )
}

export function UseTransitionSection() {
  const [inputValue, setInputValue] = useState('')
  const [listQuery, setListQuery] = useState('')
  const [mode, setMode] = useState<Mode>('transition')
  const [isPending, startTransition] = useTransition()

  const filtered = useMemo(
    () => ALL_ITEMS.filter(item => item.toLowerCase().includes(listQuery.toLowerCase())).slice(0, 100),
    [listQuery]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    if (mode === 'transition') {
      startTransition(() => setListQuery(val))
    } else {
      setListQuery(val)
    }
  }

  const toggleMode = () => {
    setMode(prev => (prev === 'transition' ? 'normal' : 'transition'))
    setInputValue('')
    setListQuery('')
  }

  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">useTransition</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Filter 10,000 items. In <strong>transition</strong> mode the input stays responsive —
        list updates are deferred so React can process keystrokes first.
        Switch to <strong>normal</strong> mode to feel the blocking lag.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Type to filter..."
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          data-testid="search-input"
        />
        <button
          type="button"
          onClick={toggleMode}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
          data-testid="mode-toggle"
        >
          Mode: <span className="font-bold text-blue-600">{mode}</span>
        </button>
        {isPending && (
          <span className="text-xs text-gray-400" data-testid="pending-indicator">
            updating list…
          </span>
        )}
      </div>

      <div
        className="h-64 overflow-auto rounded-md border border-gray-200 dark:border-gray-700"
        data-testid="results-list"
        style={{ opacity: isPending ? 0.6 : 1 }}
      >
        {filtered.map(item => (
          <SlowItem key={item} text={item} />
        ))}
      </div>

      <p className="mt-2 text-xs text-gray-400">
        Showing first 100 of{' '}
        {ALL_ITEMS.filter(i => i.toLowerCase().includes(listQuery.toLowerCase())).length.toLocaleString()}{' '}
        results
      </p>
    </section>
  )
}
