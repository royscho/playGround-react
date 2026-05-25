import { Accordion } from './Accordion'

const FAQ = [
  { id: '1', q: 'What is React?', a: 'A JavaScript library for building user interfaces.' },
  { id: '2', q: 'What is a compound component?', a: 'Components that share implicit state via Context — no prop drilling needed.' },
  { id: '3', q: 'Why use Context here?', a: 'Each sub-component (Item, Trigger, Content) reads shared state without receiving explicit props.' },
]

const CODE = `const Accordion = Object.assign(AccordionRoot, {
  Item, Trigger, Content
})

// Usage — clean, no explicit state props:
<Accordion>
  <Accordion.Item id="1">
    <Accordion.Trigger>Question</Accordion.Trigger>
    <Accordion.Content>Answer</Accordion.Content>
  </Accordion.Item>
</Accordion>

// Internally uses two Contexts:
// AccordionContext  → { openId, toggle }
// AccordionItemContext → { id }
// Content reads both to decide whether to render.`

export function CompoundComponentsSection() {
  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Compound Components</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Sub-components share implicit state via Context. No prop drilling — the parent owns state,
        children read it through a shared context.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div data-testid="accordion-demo">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Live demo</p>
          <Accordion>
            {FAQ.map(({ id, q, a }) => (
              <Accordion.Item key={id} id={id}>
                <Accordion.Trigger>{q}</Accordion.Trigger>
                <Accordion.Content>{a}</Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>

        <div data-testid="code-panel">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">How it works</p>
          <pre className="overflow-auto rounded-lg bg-gray-900 p-4 text-xs text-green-400 dark:bg-gray-950">
            <code>{CODE}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}
