import type { ReactNode } from 'react'

const ACCENT = '#34d399'
const AUDIO_SRC = `${import.meta.env.BASE_URL}media/sample.mp3`

const PRELOAD_OPTIONS: { value: 'none' | 'metadata' | 'auto'; description: string }[] = [
  { value: 'none', description: 'No preload — waits for user interaction' },
  { value: 'metadata', description: 'Loads only duration and metadata' },
  { value: 'auto', description: 'Browser decides how much to buffer' },
]

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

export function AudioSection() {
  return (
    <section className="rounded-2xl border border-gray-200/80 bg-gray-50 p-6 dark:border-white/[5%] dark:bg-white/[2%] md:p-8">
      <div className="mb-8 border-l-2 pl-4" style={{ borderColor: ACCENT }}>
        <p
          className="mb-1 text-[10px] uppercase tracking-[0.25em]"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: ACCENT }}
        >
          03 / &lt;audio&gt;
        </p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Audio</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-white/40">
          Controls, looping, and preload strategy attributes.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[7%] dark:bg-white/[3%]">
          <p className="text-sm font-semibold text-gray-700 dark:text-white/80">Native Controls</p>
          <audio data-testid="audio-controls" controls src={AUDIO_SRC} className="w-full" />
          <CodePill>controls src</CodePill>
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[7%] dark:bg-white/[3%]">
          <p className="text-sm font-semibold text-gray-700 dark:text-white/80">Loop</p>
          <audio data-testid="audio-loop" controls loop src={AUDIO_SRC} className="w-full" />
          <CodePill>loop</CodePill>
          <p className="text-xs text-gray-400 dark:text-white/30">Restarts when it ends</p>
        </div>
      </div>

      <SubLabel>preload options</SubLabel>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {PRELOAD_OPTIONS.map(({ value, description }) => (
          <div
            key={value}
            className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[7%] dark:bg-white/[3%]"
          >
            <p className="text-sm font-semibold text-gray-700 dark:text-white/80">
              preload="{value}"
            </p>
            <audio controls preload={value} src={AUDIO_SRC} className="w-full" />
            <p className="text-xs text-gray-400 dark:text-white/30">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
