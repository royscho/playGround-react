import { useState, useMemo } from 'react'
import { debounce } from '../utils/debounce'
import { throttle } from '../utils/throttle'

export function DebounceThrottleSection() {
  const [rawCount, setRawCount] = useState(0)
  const [debouncedCount, setDebouncedCount] = useState(0)
  const [throttledCount, setThrottledCount] = useState(0)

  const debouncedIncrement = useMemo(
    () => debounce(() => setDebouncedCount(c => c + 1), 300),
    []
  )
  const throttledIncrement = useMemo(
    () => throttle(() => setThrottledCount(c => c + 1), 300),
    []
  )

  return (
    <section data-testid="debounce-throttle">
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Debounce vs Throttle</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Type rapidly. Raw fires every keystroke. Debounced fires once after you stop.
        Throttled fires at most once per 300ms.
      </p>

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            label: 'Raw',
            description: 'Fires on every change event',
            testId: 'raw',
            count: rawCount,
            onChange: () => setRawCount(c => c + 1),
          },
          {
            label: 'Debounced (300ms)',
            description: 'Fires 300ms after last keystroke',
            testId: 'debounced',
            count: debouncedCount,
            onChange: debouncedIncrement,
          },
          {
            label: 'Throttled (300ms)',
            description: 'Fires at most once per 300ms',
            testId: 'throttled',
            count: throttledCount,
            onChange: throttledIncrement,
          },
        ].map(({ label, description, testId, count, onChange }) => (
          <div key={testId} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">{description}</p>
            <input
              type="text"
              onChange={onChange}
              placeholder="Type here..."
              className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              data-testid={`${testId}-input`}
            />
            <div
              className="rounded-md bg-gray-50 px-3 py-2 font-mono text-sm dark:bg-gray-800"
              data-testid={`${testId}-counter`}
            >
              {count}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
