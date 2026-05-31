import { useState } from 'react'
import type { ReactNode } from 'react'

interface AnimationCardProps {
  label: string
  codeLabel: string
  testId: string
  children: (replayKey: number) => ReactNode
}

function AnimationCard({ label, codeLabel, testId, children }: AnimationCardProps) {
  const [replayKey, setReplayKey] = useState(0)
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <div
        data-testid={testId}
        data-key={replayKey}
        className="flex h-16 w-full items-center justify-center"
      >
        {children(replayKey)}
      </div>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
      <code className="text-xs text-indigo-600 dark:text-indigo-400">{codeLabel}</code>
      <button
        onClick={() => setReplayKey((k) => k + 1)}
        className="rounded px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        Replay
      </button>
    </div>
  )
}

export function AnimationsSection() {
  return (
    <section>
      <style>{`
        @keyframes anim-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes anim-slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes anim-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes anim-zoom-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .anim-fade-in  { animation: anim-fade-in  0.6s ease forwards; }
        .anim-slide-up { animation: anim-slide-up 0.6s ease forwards; }
        .anim-shake    { animation: anim-shake    0.5s ease; }
        .anim-zoom-in  { animation: anim-zoom-in  0.5s ease forwards; }
      `}</style>

      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">CSS Animations</h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Tailwind 4 ships four animation utilities. Custom effects use <code>@keyframes</code> + a
        class that sets the <code>animation</code> property.
      </p>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Tailwind Built-ins
      </h3>
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <AnimationCard label="Spin" codeLabel="animate-spin" testId="demo-spin">
          {(key) => (
            <div key={key} className="animate-spin text-3xl text-indigo-500">
              ⟳
            </div>
          )}
        </AnimationCard>

        <AnimationCard label="Bounce" codeLabel="animate-bounce" testId="demo-bounce">
          {(key) => <div key={key} className="animate-bounce h-6 w-6 rounded-full bg-pink-500" />}
        </AnimationCard>

        <AnimationCard label="Pulse" codeLabel="animate-pulse" testId="demo-pulse">
          {(key) => (
            <div
              key={key}
              className="animate-pulse h-5 w-20 rounded bg-gray-300 dark:bg-gray-600"
            />
          )}
        </AnimationCard>

        <AnimationCard label="Ping" codeLabel="animate-ping" testId="demo-ping">
          {(key) => (
            <div key={key} className="relative flex h-5 w-5 items-center justify-center">
              <div className="animate-ping absolute h-full w-full rounded-full bg-sky-400 opacity-75" />
              <div className="relative h-3 w-3 rounded-full bg-sky-500" />
            </div>
          )}
        </AnimationCard>
      </div>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Custom @keyframes
      </h3>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <AnimationCard label="Fade In" codeLabel="anim-fade-in" testId="demo-fade-in">
          {(key) => (
            <span
              key={key}
              className="anim-fade-in text-lg font-semibold text-gray-800 dark:text-gray-200"
            >
              Hello
            </span>
          )}
        </AnimationCard>

        <AnimationCard label="Slide Up" codeLabel="anim-slide-up" testId="demo-slide-up">
          {(key) => (
            <span
              key={key}
              className="anim-slide-up text-lg font-semibold text-gray-800 dark:text-gray-200"
            >
              World
            </span>
          )}
        </AnimationCard>

        <AnimationCard label="Shake" codeLabel="anim-shake" testId="demo-shake">
          {(key) => (
            <span key={key} className="anim-shake text-lg font-semibold text-red-500">
              Error!
            </span>
          )}
        </AnimationCard>

        <AnimationCard label="Zoom In" codeLabel="anim-zoom-in" testId="demo-zoom-in">
          {(key) => (
            <span key={key} className="anim-zoom-in text-3xl">
              🎉
            </span>
          )}
        </AnimationCard>
      </div>
    </section>
  )
}
