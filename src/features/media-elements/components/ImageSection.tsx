const OBJECT_FIT_CARDS = [
  { label: 'Cover', cls: 'object-cover' },
  { label: 'Contain', cls: 'object-contain' },
  { label: 'Fill', cls: 'object-fill' },
  { label: 'None', cls: 'object-none' },
  { label: 'Scale Down', cls: 'object-scale-down' },
]

const IMG1 = 'https://picsum.photos/seed/portrait1/200/400'
const IMG2 = 'https://picsum.photos/seed/media2/400/300'
const IMG3 = 'https://picsum.photos/seed/media3/800/450'

export function ImageSection() {
  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Images</h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        HTML <code>&lt;img&gt;</code> attributes for loading strategy and visual fit.
      </p>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        object-fit
      </h3>
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {OBJECT_FIT_CARDS.map(({ label, cls }) => (
          <div key={cls} className="flex flex-col items-center gap-2">
            <div className="h-30 w-full overflow-hidden rounded border border-gray-200 dark:border-gray-700">
              <img src={IMG1} alt={`${label} demo`} className={`h-full w-full ${cls}`} />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
            <code className="text-xs text-indigo-600 dark:text-indigo-400">{cls}</code>
          </div>
        ))}
      </div>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        loading attribute
      </h3>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <img
            src={IMG1}
            alt="lazy loading demo"
            loading="lazy"
            className="mb-3 h-32 w-full rounded object-cover"
          />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Lazy</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">loading="lazy"</code>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Browser defers load until near viewport
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <img
            src={IMG2}
            alt="eager loading demo"
            loading="eager"
            className="mb-3 h-32 w-full rounded object-cover"
          />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Eager</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">loading="eager"</code>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Browser loads immediately (default)
          </p>
        </div>
      </div>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        aspect-ratio
      </h3>
      <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <div className="aspect-video w-full overflow-hidden rounded">
          <img src={IMG3} alt="aspect-ratio demo" className="h-full w-full object-cover" />
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Container uses <code className="text-indigo-600 dark:text-indigo-400">aspect-[16/9]</code>{' '}
          with <code className="text-indigo-600 dark:text-indigo-400">object-cover</code> on the
          image.
        </p>
      </div>
    </section>
  )
}
