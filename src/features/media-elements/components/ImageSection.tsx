import type { ReactNode } from 'react'

const ACCENT = '#f59e0b'

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

function CodePill({ children }: { children: ReactNode }) {
  return (
    <code
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        color: ACCENT,
        backgroundColor: `${ACCENT}22`,
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        display: 'inline-block',
      }}
    >
      {children}
    </code>
  )
}

function SubLabel({ children }: { children: ReactNode }) {
  return (
    <p
      className="mb-3 text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-white/30"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {children}
    </p>
  )
}

export function ImageSection() {
  return (
    <section className="rounded-2xl border border-gray-200/80 bg-gray-50 p-6 dark:border-white/[5%] dark:bg-white/[2%] md:p-8">
      <div className="mb-8 border-l-2 pl-4" style={{ borderColor: ACCENT }}>
        <p
          className="mb-1 text-[10px] uppercase tracking-[0.25em]"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: ACCENT }}
        >
          01 / &lt;img&gt;
        </p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Images</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-white/40">
          Loading strategy and visual fit attributes.
        </p>
      </div>

      <SubLabel>object-fit</SubLabel>
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {OBJECT_FIT_CARDS.map(({ label, cls }) => (
          <div
            key={cls}
            className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3 dark:border-white/[7%] dark:bg-white/[3%]"
          >
            <div className="h-36 overflow-hidden rounded-lg bg-gray-100 dark:bg-white/5">
              <img src={IMG1} alt={`${label} demo`} className={`h-full w-full ${cls}`} />
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-white/80">{label}</p>
            <CodePill>{cls}</CodePill>
          </div>
        ))}
      </div>

      <SubLabel>loading attribute</SubLabel>
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[7%] dark:bg-white/[3%]">
          <img
            src={IMG1}
            alt="lazy loading demo"
            loading="lazy"
            className="mb-3 h-32 w-full rounded-lg object-cover"
          />
          <p className="mb-1 text-sm font-semibold text-gray-700 dark:text-white/80">Lazy</p>
          <CodePill>loading="lazy"</CodePill>
          <p className="mt-2 text-xs text-gray-400 dark:text-white/30">Deferred until near viewport</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[7%] dark:bg-white/[3%]">
          <img
            src={IMG2}
            alt="eager loading demo"
            loading="eager"
            className="mb-3 h-32 w-full rounded-lg object-cover"
          />
          <p className="mb-1 text-sm font-semibold text-gray-700 dark:text-white/80">Eager</p>
          <CodePill>loading="eager"</CodePill>
          <p className="mt-2 text-xs text-gray-400 dark:text-white/30">Loads immediately (default)</p>
        </div>
      </div>

      <SubLabel>aspect-ratio</SubLabel>
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[7%] dark:bg-white/[3%]">
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          <img src={IMG3} alt="aspect-ratio demo" className="h-full w-full object-cover" />
        </div>
        <p className="mt-3 text-xs text-gray-400 dark:text-white/30">
          Container uses <CodePill>aspect-video</CodePill> with{' '}
          <CodePill>object-cover</CodePill> on the image.
        </p>
      </div>
    </section>
  )
}
