const AUDIO_SRC = `${import.meta.env.BASE_URL}media/sample.mp3`

const PRELOAD_OPTIONS: { value: 'none' | 'metadata' | 'auto'; description: string }[] = [
  { value: 'none', description: 'No preload — waits for user interaction' },
  { value: 'metadata', description: 'Loads only duration and metadata' },
  { value: 'auto', description: 'Browser decides how much to buffer' },
]

export function AudioSection() {
  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Audio</h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        HTML <code>&lt;audio&gt;</code> key attributes for controls, looping, and preload strategy.
      </p>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Native Controls</p>
          <audio data-testid="audio-controls" controls src={AUDIO_SRC} className="w-full" />
          <code className="text-xs text-indigo-600 dark:text-indigo-400">controls src</code>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Loop</p>
          <audio data-testid="audio-loop" controls loop src={AUDIO_SRC} className="w-full" />
          <code className="text-xs text-indigo-600 dark:text-indigo-400">loop</code>
          <p className="text-xs text-gray-500 dark:text-gray-400">Restarts when it ends</p>
        </div>
      </div>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        preload options
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {PRELOAD_OPTIONS.map(({ value, description }) => (
          <div key={value} className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">preload="{value}"</p>
            <audio controls preload={value} src={AUDIO_SRC} className="w-full" />
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
