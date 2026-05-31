import { VisualEffectsSection } from './VisualEffectsSection'
import { TransitionsSection } from './TransitionsSection'
import { FlexboxGridSection } from './FlexboxGridSection'
import { CustomPropertiesSection } from './CustomPropertiesSection'
import { AnimationsSection } from './AnimationsSection'

export default function CssExamplesPage() {
  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">CSS3 Examples</h1>
      <VisualEffectsSection />
      <TransitionsSection />
      <FlexboxGridSection />
      <CustomPropertiesSection />
      <AnimationsSection />
    </div>
  )
}
