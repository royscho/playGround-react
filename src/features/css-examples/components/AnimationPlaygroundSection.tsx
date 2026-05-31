import { useState } from 'react'
import type { CSSProperties } from 'react'

type AnimationName = 'spin' | 'bounce' | 'pulse' | 'ping'

const ANIMATIONS: { value: AnimationName; label: string }[] = [
  { value: 'spin', label: 'Spin' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'ping', label: 'Ping' },
]

const ITERATION_OPTIONS = ['1', '2', '3', '5', 'infinite'] as const

function buildCodeSnippet(
  name: AnimationName,
  duration: number,
  delay: number,
  iterationCount: number | 'infinite'
): string {
  const iterStr = iterationCount === 'infinite' ? `'infinite'` : String(iterationCount)
  return `<div
  className="animate-${name}"
  style={{
    animationDuration: '${duration.toFixed(1)}s',
    animationDelay: '${delay.toFixed(1)}s',
    animationIterationCount: ${iterStr},
  }}
/>`
}

function renderDemo(name: AnimationName, replayKey: number, style: CSSProperties) {
  switch (name) {
    case 'spin':
      return (
        <div key={replayKey} className="animate-spin text-3xl text-indigo-500" style={style}>
          ⟳
        </div>
      )
    case 'bounce':
      return (
        <div
          key={replayKey}
          className="animate-bounce h-6 w-6 rounded-full bg-pink-500"
          style={style}
        />
      )
    case 'pulse':
      return (
        <div
          key={replayKey}
          className="animate-pulse h-5 w-20 rounded bg-gray-300 dark:bg-gray-600"
          style={style}
        />
      )
    case 'ping':
      return (
        <div key={replayKey} className="relative flex h-8 w-8 items-center justify-center">
          <div
            className="animate-ping absolute h-full w-full rounded-full bg-sky-400 opacity-75"
            style={style}
          />
          <div className="relative h-4 w-4 rounded-full bg-sky-500" />
        </div>
      )
  }
}

export function AnimationPlaygroundSection() {
  const [selectedAnimation, setSelectedAnimation] = useState<AnimationName>('bounce')
  const [duration, setDuration] = useState(1)
  const [delay, setDelay] = useState(0)
  const [iterationCount, setIterationCount] = useState<number | 'infinite'>('infinite')
  const [replayKey, setReplayKey] = useState(0)

  const animStyle: CSSProperties = {
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    animationIterationCount: iterationCount,
  }

  const codeSnippet = buildCodeSnippet(selectedAnimation, duration, delay, iterationCount)

  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
        Animation Playground
      </h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Customize Tailwind animations with inline styles. Inline styles override the animation
        defaults.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <div>
            <label
              htmlFor="animation-select"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Animation
            </label>
            <select
              id="animation-select"
              value={selectedAnimation}
              onChange={(e) => setSelectedAnimation(e.target.value as AnimationName)}
              className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              {ANIMATIONS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="duration-slider"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Duration: {duration.toFixed(1)}s
            </label>
            <input
              id="duration-slider"
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label
              htmlFor="delay-slider"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Delay: {delay.toFixed(1)}s
            </label>
            <input
              id="delay-slider"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label
              htmlFor="iteration-select"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Iterations
            </label>
            <select
              id="iteration-select"
              value={String(iterationCount)}
              onChange={(e) => {
                const val = e.target.value
                setIterationCount(val === 'infinite' ? 'infinite' : Number(val))
              }}
              className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              {ITERATION_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setReplayKey((k) => k + 1)}
            className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Restart
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div
            data-testid="playground-demo"
            data-key={replayKey}
            className="flex h-32 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700"
          >
            {renderDemo(selectedAnimation, replayKey, animStyle)}
          </div>
          <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-green-400">
            <code data-testid="code-snippet">{codeSnippet}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}
