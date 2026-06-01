import { ImageSection } from './ImageSection'
import { VideoSection } from './VideoSection'
import { AudioSection } from './AudioSection'
import { SVGSection } from './SVGSection'

export default function MediaElementsPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-10 dark:bg-[#080a12] md:px-12">
      <header className="mb-14">
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px w-12 bg-gray-300 dark:bg-white/20" />
          <span
            className="font-code text-[10px] uppercase tracking-[0.3em] text-gray-400 dark:text-white/40"
          >
            HTML Reference
          </span>
        </div>
        <h1
          className="text-5xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-6xl"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Media Elements
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-white/40">
          Browser-native media primitives — their key attributes and how they behave.
        </p>
      </header>
      <div className="space-y-6">
        <ImageSection />
        <VideoSection />
        <AudioSection />
        <SVGSection />
      </div>
    </div>
  )
}
