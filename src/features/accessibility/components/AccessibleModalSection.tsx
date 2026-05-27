import { useState, useRef, useEffect } from 'react'
import { useFocusTrap } from '../hooks/useFocusTrap'

export function AccessibleModalSection() {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useFocusTrap(modalRef, isOpen)

  useEffect(() => {
    if (!isOpen) triggerRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) setIsOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen])

  return (
    <section data-testid="modal-section">
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Accessible Modal</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Built from scratch: <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">role="dialog"</code>,{' '}
        focus trap, keyboard navigation, and focus restoration.
      </p>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        data-testid="modal-trigger"
      >
        Open Dialog
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800"
            data-testid="modal"
          >
            <h2
              id="modal-title"
              className="mb-3 text-lg font-semibold text-gray-900 dark:text-white"
            >
              Confirm Action
            </h2>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
              This dialog demonstrates full accessibility: ARIA roles, focus trap (Tab cycles
              within modal only), and keyboard navigation.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                data-testid="modal-cancel"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                data-testid="modal-confirm"
              >
                Confirm
              </button>
            </div>
          </div>
        </>
      )}

      <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
        <strong>Screen reader hears:</strong> "Confirm Action, dialog" → reads description.
        Tab cycles only within modal. Escape closes and returns focus to the trigger button.
      </div>
    </section>
  )
}
