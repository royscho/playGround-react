import { CoreWebVitalsSection } from './CoreWebVitalsSection'
import { DebounceThrottleSection } from './DebounceThrottleSection'
import { LazyLoadSection } from './LazyLoadSection'

export default function PerformancePage() {
  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Performance</h1>
      <CoreWebVitalsSection />
      <DebounceThrottleSection />
      <LazyLoadSection />
    </div>
  )
}
