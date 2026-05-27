const METRICS = [
  { name: 'LCP', full: 'Largest Contentful Paint', good: 2500, poor: 4000, unit: 'ms' },
  { name: 'CLS', full: 'Cumulative Layout Shift', good: 0.1, poor: 0.25, unit: '' },
  { name: 'INP', full: 'Interaction to Next Paint', good: 200, poor: 500, unit: 'ms' },
]

function getTextColor(value: number, good: number, poor: number) {
  if (value <= good) return 'text-green-600 dark:text-green-400'
  if (value <= poor) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

function getBgColor(value: number, good: number, poor: number) {
  if (value <= good) return 'bg-green-50 dark:bg-green-900/20'
  if (value <= poor) return 'bg-yellow-50 dark:bg-yellow-900/20'
  return 'bg-red-50 dark:bg-red-900/20'
}

export function CoreWebVitalsSection() {
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined

  return (
    <section data-testid="core-web-vitals">
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Core Web Vitals</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Google's user-centric metrics. Measured in production via{' '}
        <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">PerformanceObserver</code>.
      </p>

      <div className="mb-6 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm" data-testid="vitals-table">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Metric</th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-green-600">Good</th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-yellow-600">Needs Improvement</th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-red-600">Poor</th>
            </tr>
          </thead>
          <tbody>
            {METRICS.map(m => (
              <tr key={m.name} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2">
                  <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{m.name}</span>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{m.full}</span>
                </td>
                <td className="px-4 py-2 text-green-600">≤ {m.good}{m.unit}</td>
                <td className="px-4 py-2 text-yellow-600">≤ {m.poor}{m.unit}</td>
                <td className="px-4 py-2 text-red-600">&gt; {m.poor}{m.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {nav && (
        <div className="mb-6" data-testid="nav-timing">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">This page's actual timing:</p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'TTFB', value: nav.responseStart - nav.requestStart },
              { label: 'DOM Ready', value: nav.domContentLoadedEventEnd - nav.startTime },
              { label: 'Load', value: nav.loadEventEnd - nav.startTime },
            ].map(({ label, value }) => (
              <div key={label} className={`rounded-lg px-4 py-2 text-sm ${getBgColor(value, 2500, 4000)}`}>
                <span className="font-medium text-gray-700 dark:text-gray-300">{label}: </span>
                <span className={`font-mono font-bold ${getTextColor(value, 2500, 4000)}`}>
                  {value.toFixed(0)}ms
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <pre
        className="overflow-auto rounded-lg bg-gray-900 p-4 text-xs text-green-400"
        data-testid="perf-observer-snippet"
      >{`const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.name, entry.startTime)
  }
})
observer.observe({ type: 'largest-contentful-paint', buffered: true })`}</pre>
    </section>
  )
}
