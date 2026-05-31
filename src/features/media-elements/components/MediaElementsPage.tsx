import { ImageSection } from './ImageSection'
import { VideoSection } from './VideoSection'
import { AudioSection } from './AudioSection'
import { SVGSection } from './SVGSection'

export default function MediaElementsPage() {
  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Media Elements</h1>
      <ImageSection />
      <VideoSection />
      <AudioSection />
      <SVGSection />
    </div>
  )
}
