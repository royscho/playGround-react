import { AccessibleModalSection } from './AccessibleModalSection'
import { AccessibleFormSection } from './AccessibleFormSection'

export default function AccessibilityPage() {
  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Accessibility</h1>
      <AccessibleModalSection />
      <AccessibleFormSection />
    </div>
  )
}
