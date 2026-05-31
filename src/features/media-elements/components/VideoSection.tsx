const VIDEO_SRC = `${import.meta.env.BASE_URL}media/sample.mp4`
const POSTER_SRC = 'https://picsum.photos/seed/vidposter/400/225'

export function VideoSection() {
  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Video</h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        HTML <code>&lt;video&gt;</code> key attributes for controls, autoplay, and poster image.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Native Controls</p>
          <video data-testid="video-controls" controls src={VIDEO_SRC} className="w-full rounded" />
          <code className="text-xs text-indigo-600 dark:text-indigo-400">controls src</code>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Autoplay + Muted</p>
          <video
            data-testid="video-autoplay"
            autoPlay
            muted
            loop
            src={VIDEO_SRC}
            className="w-full rounded"
          />
          <code className="text-xs text-indigo-600 dark:text-indigo-400">autoPlay muted loop</code>
          <p className="text-xs text-gray-500 dark:text-gray-400">autoPlay requires muted</p>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Poster Image</p>
          <video
            data-testid="video-poster"
            controls
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            className="w-full rounded"
          />
          <code className="text-xs text-indigo-600 dark:text-indigo-400">poster</code>
        </div>
      </div>
    </section>
  )
}
