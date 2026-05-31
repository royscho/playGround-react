import type { ReactNode } from 'react'

const ACCENT = '#38bdf8'
const VIDEO_SRC = `${import.meta.env.BASE_URL}media/sample.mp4`
const POSTER_SRC = 'https://picsum.photos/seed/vidposter/400/225'

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

export function VideoSection() {
  return (
    <section className="rounded-2xl border border-gray-200/80 bg-gray-50 p-6 dark:border-white/[5%] dark:bg-white/[2%] md:p-8">
      <div className="mb-8 border-l-2 pl-4" style={{ borderColor: ACCENT }}>
        <p
          className="mb-1 text-[10px] uppercase tracking-[0.25em]"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: ACCENT }}
        >
          02 / &lt;video&gt;
        </p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Video</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-white/40">
          Controls, autoplay, and poster image attributes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[7%] dark:bg-white/[3%]">
          <p className="text-sm font-semibold text-gray-700 dark:text-white/80">Native Controls</p>
          <video data-testid="video-controls" controls src={VIDEO_SRC} className="w-full rounded-lg" />
          <CodePill>controls src</CodePill>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[7%] dark:bg-white/[3%]">
          <p className="text-sm font-semibold text-gray-700 dark:text-white/80">Autoplay + Muted</p>
          <video
            data-testid="video-autoplay"
            autoPlay
            muted
            loop
            src={VIDEO_SRC}
            className="w-full rounded-lg"
          />
          <CodePill>autoPlay muted loop</CodePill>
          <p className="text-xs text-gray-400 dark:text-white/30">autoPlay requires muted</p>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[7%] dark:bg-white/[3%]">
          <p className="text-sm font-semibold text-gray-700 dark:text-white/80">Poster Image</p>
          <video
            data-testid="video-poster"
            controls
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            className="w-full rounded-lg"
          />
          <CodePill>poster</CodePill>
        </div>
      </div>
    </section>
  )
}
