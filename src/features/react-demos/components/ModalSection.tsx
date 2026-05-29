import { useState } from 'react'
import { Modal } from '../../../shared/components/Modal'
import { Button } from '../../../shared/components/Button'

type ModalType = 'info' | 'confirm' | 'form' | null

const CODE = `const [open, setOpen] = useState<ModalType>(null)

<Button onClick={() => setOpen('info')}>
  Open Info Modal
</Button>

<Modal
  isOpen={open === 'info'}
  onClose={() => setOpen(null)}
  title="What is a Modal?"
>
  {/* content */}
</Modal>`

export function ModalSection() {
  const [open, setOpen] = useState<ModalType>(null)
  const [name, setName] = useState('')

  const close = () => setOpen(null)

  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Modal</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Controlled visibility via <code>useState</code>. The shared <code>Modal</code> handles
        Escape key and backdrop click. Three variants: info, confirm, and form.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div data-testid="modal-demos">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Live demo</p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => setOpen('info')}>Open Info Modal</Button>
            <Button onClick={() => setOpen('confirm')}>Open Confirm Modal</Button>
            <Button onClick={() => { setName(''); setOpen('form') }}>Open Form Modal</Button>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">How it works</p>
          <pre className="overflow-auto rounded-lg bg-gray-900 p-4 text-xs text-green-400 dark:bg-gray-950">
            <code>{CODE}</code>
          </pre>
        </div>
      </div>

      <Modal isOpen={open === 'info'} onClose={close} title="What is a Modal?">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          A modal is a dialog that overlays the page and requires the user to interact with it
          before returning to the main content.
        </p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          It uses a fixed backdrop, Escape key, and a close button for dismissal.
        </p>
        <div className="mt-4 flex justify-end">
          <Button onClick={close}>Got it</Button>
        </div>
      </Modal>

      <Modal isOpen={open === 'confirm'} onClose={close} title="Delete Item">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Are you sure you want to delete this item? This cannot be undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={close}>Cancel</Button>
          <Button variant="danger" onClick={close}>Delete</Button>
        </div>
      </Modal>

      <Modal isOpen={open === 'form'} onClose={close} title="Edit Name">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Name
          <input
            data-testid="form-modal-input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </label>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={close}>Cancel</Button>
          <Button onClick={close}>Save</Button>
        </div>
      </Modal>
    </section>
  )
}
