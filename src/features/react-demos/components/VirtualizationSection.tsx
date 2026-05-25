import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

const NAIVE_ITEMS = Array.from({ length: 2_000 }, (_, i) => `Row ${i + 1}`)
const VIRTUAL_ITEMS = Array.from({ length: 10_000 }, (_, i) => `Row ${i + 1}`)
const ROW_HEIGHT = 32

function NaiveList() {
  return (
    <div
      className="h-72 overflow-auto rounded border border-gray-200 dark:border-gray-700"
      data-testid="naive-list"
    >
      {NAIVE_ITEMS.map(item => (
        <div
          key={item}
          className="border-b border-gray-100 px-3 text-sm dark:border-gray-800 dark:text-gray-300"
          style={{ height: ROW_HEIGHT, lineHeight: `${ROW_HEIGHT}px` }}
        >
          {item}
        </div>
      ))}
    </div>
  )
}

function VirtualList() {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: VIRTUAL_ITEMS.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
  })

  return (
    <div
      ref={parentRef}
      className="h-72 overflow-auto rounded border border-gray-200 dark:border-gray-700"
      data-testid="virtual-list"
    >
      <div style={{ height: virtualizer.getTotalSize(), width: '100%', position: 'relative' }}>
        {virtualizer.getVirtualItems().map(row => (
          <div
            key={row.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${row.size}px`,
              transform: `translateY(${row.start}px)`,
            }}
            className="border-b border-gray-100 px-3 text-sm dark:border-gray-800 dark:text-gray-300"
          >
            {VIRTUAL_ITEMS[row.index]}
          </div>
        ))}
      </div>
    </div>
  )
}

export function VirtualizationSection() {
  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Virtualization</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Only render what's visible. Left: 2,000 real DOM nodes. Right: 10,000 items, ~15 DOM nodes at a time.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div data-testid="naive-panel">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Naive — all in DOM</p>
            <span
              className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400"
              data-testid="naive-count"
            >
              2,000 DOM nodes
            </span>
          </div>
          <NaiveList />
        </div>

        <div data-testid="virtual-panel">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Virtual — only visible rows</p>
            <span
              className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
              data-testid="virtual-count"
            >
              ~15 DOM nodes
            </span>
          </div>
          <VirtualList />
        </div>
      </div>
    </section>
  )
}
