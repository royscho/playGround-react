import { UseTransitionSection } from './UseTransitionSection'
import { VirtualizationSection } from './VirtualizationSection'
import { CompoundComponentsSection } from './CompoundComponentsSection'
import { TanStackTableSection } from './TanStackTableSection'

export default function ReactDemosPage() {
  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">React Demos</h1>
      <UseTransitionSection />
      <VirtualizationSection />
      <CompoundComponentsSection />
      <TanStackTableSection />
    </div>
  )
}
