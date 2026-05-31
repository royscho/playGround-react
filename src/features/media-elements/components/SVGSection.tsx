export function SVGSection() {
  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">SVG</h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Inline SVG shapes, fill/stroke attributes, and inline SVG vs <code>&lt;img&gt;</code>.
      </p>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Basic Shapes
      </h3>
      <div className="mb-8 grid grid-cols-3 gap-4 lg:grid-cols-6">
        <div className="flex flex-col items-center gap-2">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <rect x="10" y="10" width="60" height="60" rx="4" fill="#6366f1" />
          </svg>
          <p className="text-sm text-gray-700 dark:text-gray-300">Rectangle</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">&lt;rect&gt;</code>
        </div>

        <div className="flex flex-col items-center gap-2">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <circle cx="40" cy="40" r="30" fill="#ec4899" />
          </svg>
          <p className="text-sm text-gray-700 dark:text-gray-300">Circle</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">&lt;circle&gt;</code>
        </div>

        <div className="flex flex-col items-center gap-2">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <ellipse cx="40" cy="40" rx="35" ry="20" fill="#f59e0b" />
          </svg>
          <p className="text-sm text-gray-700 dark:text-gray-300">Ellipse</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">&lt;ellipse&gt;</code>
        </div>

        <div className="flex flex-col items-center gap-2">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <line x1="10" y1="40" x2="70" y2="40" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <p className="text-sm text-gray-700 dark:text-gray-300">Line</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">&lt;line&gt;</code>
        </div>

        <div className="flex flex-col items-center gap-2">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <polygon points="40,5 50,30 75,30 55,48 62,75 40,58 18,75 25,48 5,30 30,30" fill="#f97316" />
          </svg>
          <p className="text-sm text-gray-700 dark:text-gray-300">Polygon</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">&lt;polygon&gt;</code>
        </div>

        <div className="flex flex-col items-center gap-2">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <path d="M 10 40 Q 40 10 70 40 Q 40 70 10 40 Z" fill="#8b5cf6" />
          </svg>
          <p className="text-sm text-gray-700 dark:text-gray-300">Path</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">&lt;path&gt;</code>
        </div>
      </div>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        fill + stroke
      </h3>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <circle cx="40" cy="40" r="30" fill="#6366f1" />
          </svg>
          <p className="text-sm text-gray-700 dark:text-gray-300">fill only</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">fill="#6366f1"</code>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <circle cx="40" cy="40" r="28" fill="none" stroke="#6366f1" strokeWidth="4" />
          </svg>
          <p className="text-sm text-gray-700 dark:text-gray-300">stroke only</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">fill="none" stroke="…"</code>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <circle cx="40" cy="40" r="28" fill="#c7d2fe" stroke="#6366f1" strokeWidth="4" />
          </svg>
          <p className="text-sm text-gray-700 dark:text-gray-300">fill + stroke</p>
          <code className="text-xs text-indigo-600 dark:text-indigo-400">fill + stroke + strokeWidth</code>
        </div>
      </div>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Inline SVG vs &lt;img&gt;
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Inline SVG</p>
          <svg viewBox="0 0 80 80" className="h-16 w-16 fill-indigo-500">
            <circle cx="40" cy="40" r="30" />
          </svg>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Styled with Tailwind <code className="text-indigo-600 dark:text-indigo-400">fill-indigo-500</code>.
            Accessible to CSS and JS.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            SVG as &lt;img&gt;
          </p>
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='30' fill='%236366f1'/%3E%3C/svg%3E"
            alt="svg as img"
            className="h-16 w-16"
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Treated as image. CSS cannot change <code className="text-indigo-600 dark:text-indigo-400">fill</code>.
          </p>
        </div>
      </div>
    </section>
  )
}
