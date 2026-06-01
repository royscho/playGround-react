import type { ReactNode } from 'react'

const ACCENT = '#a78bfa'

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

export function SVGSection() {
  return (
    <section className="rounded-2xl border border-gray-200/80 bg-gray-50 p-6 dark:border-white/[5%] dark:bg-white/[2%] md:p-8">
      <div className="mb-8 border-l-2 pl-4" style={{ borderColor: ACCENT }}>
        <p
          className="mb-1 text-[10px] uppercase tracking-[0.25em]"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: ACCENT }}
        >
          04 / &lt;svg&gt;
        </p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Syne', sans-serif" }}>SVG</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-white/40">
          Inline shapes, fill/stroke attributes, and inline SVG vs{' '}
          <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>
            &lt;img&gt;
          </code>
          .
        </p>
      </div>

      <SubLabel>Basic Shapes</SubLabel>
      <div className="mb-8 grid grid-cols-3 gap-3 lg:grid-cols-6">
        <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[7%] dark:bg-white/[3%]">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <rect x="10" y="10" width="60" height="60" rx="4" fill="#6366f1" />
          </svg>
          <p className="text-xs font-medium text-gray-700 dark:text-white/70">Rectangle</p>
          <CodePill>&lt;rect&gt;</CodePill>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[7%] dark:bg-white/[3%]">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <circle cx="40" cy="40" r="30" fill="#ec4899" />
          </svg>
          <p className="text-xs font-medium text-gray-700 dark:text-white/70">Circle</p>
          <CodePill>&lt;circle&gt;</CodePill>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[7%] dark:bg-white/[3%]">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <ellipse cx="40" cy="40" rx="35" ry="20" fill="#f59e0b" />
          </svg>
          <p className="text-xs font-medium text-gray-700 dark:text-white/70">Ellipse</p>
          <CodePill>&lt;ellipse&gt;</CodePill>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[7%] dark:bg-white/[3%]">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <line
              x1="10"
              y1="40"
              x2="70"
              y2="40"
              stroke="#10b981"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-xs font-medium text-gray-700 dark:text-white/70">Line</p>
          <CodePill>&lt;line&gt;</CodePill>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[7%] dark:bg-white/[3%]">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <polygon
              points="40,5 50,30 75,30 55,48 62,75 40,58 18,75 25,48 5,30 30,30"
              fill="#f97316"
            />
          </svg>
          <p className="text-xs font-medium text-gray-700 dark:text-white/70">Polygon</p>
          <CodePill>&lt;polygon&gt;</CodePill>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[7%] dark:bg-white/[3%]">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <path d="M 10 40 Q 40 10 70 40 Q 40 70 10 40 Z" fill="#8b5cf6" />
          </svg>
          <p className="text-xs font-medium text-gray-700 dark:text-white/70">Path</p>
          <CodePill>&lt;path&gt;</CodePill>
        </div>
      </div>

      <SubLabel>fill + stroke</SubLabel>
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[7%] dark:bg-white/[3%]">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <circle cx="40" cy="40" r="30" fill="#6366f1" />
          </svg>
          <p className="text-xs font-medium text-gray-700 dark:text-white/70">fill only</p>
          <CodePill>fill="#6366f1"</CodePill>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[7%] dark:bg-white/[3%]">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <circle cx="40" cy="40" r="28" fill="none" stroke="#6366f1" strokeWidth="4" />
          </svg>
          <p className="text-xs font-medium text-gray-700 dark:text-white/70">stroke only</p>
          <CodePill>fill="none" stroke="…"</CodePill>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[7%] dark:bg-white/[3%]">
          <svg viewBox="0 0 80 80" className="h-16 w-16">
            <circle cx="40" cy="40" r="28" fill="#c7d2fe" stroke="#6366f1" strokeWidth="4" />
          </svg>
          <p className="text-xs font-medium text-gray-700 dark:text-white/70">fill + stroke</p>
          <CodePill>fill + stroke + strokeWidth</CodePill>
        </div>
      </div>

      <SubLabel>Inline SVG vs &lt;img&gt;</SubLabel>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[7%] dark:bg-white/[3%]">
          <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-white/80">Inline SVG</p>
          <svg viewBox="0 0 80 80" className="h-16 w-16 fill-indigo-500">
            <circle cx="40" cy="40" r="30" />
          </svg>
          <p className="mt-3 text-xs text-gray-400 dark:text-white/30">
            Styled with Tailwind <CodePill>fill-indigo-500</CodePill>. Accessible to CSS and JS.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[7%] dark:bg-white/[3%]">
          <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-white/80">
            SVG as &lt;img&gt;
          </p>
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='30' fill='%236366f1'/%3E%3C/svg%3E"
            alt="svg as img"
            className="h-16 w-16"
          />
          <p className="mt-3 text-xs text-gray-400 dark:text-white/30">
            Treated as image. CSS cannot change <CodePill>fill</CodePill>.
          </p>
        </div>
      </div>
    </section>
  )
}
