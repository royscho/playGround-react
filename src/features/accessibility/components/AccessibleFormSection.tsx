import { useState, useRef } from 'react'

interface FormErrors {
  name?: string
  email?: string
}

export function AccessibleFormSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [liveMessage, setLiveMessage] = useState('')

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  const validate = (): FormErrors => {
    const errs: FormErrors = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!email.trim()) {
      errs.email = 'Email is required'
    } else if (!email.includes('@')) {
      errs.email = 'Email must contain @'
    }
    return errs
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    const errorCount = Object.keys(errs).length

    if (errorCount > 0) {
      setErrors(errs)
      setSubmitted(false)
      setLiveMessage(`Form has ${errorCount} errors`)
      // Focus first invalid field
      if (errs.name) {
        nameRef.current?.focus()
      } else if (errs.email) {
        emailRef.current?.focus()
      }
    } else {
      setErrors({})
      setSubmitted(true)
      setLiveMessage('Message sent!')
    }
  }

  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
        Accessible Form
      </h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        ARIA validation: <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">aria-invalid</code>,{' '}
        <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">aria-describedby</code>,{' '}
        <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">role="alert"</code>, and a live region.
      </p>

      {/* aria-live polite region */}
      <div
        aria-live="polite"
        data-testid="form-live-region"
        className="mb-4 min-h-[1.5rem] text-sm font-medium"
      >
        {liveMessage && (
          <span className={submitted ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
            {liveMessage}
          </span>
        )}
      </div>

      <form
        data-testid="a11y-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4"
      >
        {/* Name field */}
        <div>
          <label
            htmlFor="field-name"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Name <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            id="field-name"
            ref={nameRef}
            data-testid="field-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            aria-required="true"
            aria-invalid={errors.name ? true : false}
            aria-describedby="error-name"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <span
            id="error-name"
            role="alert"
            className="mt-1 block text-xs text-red-600 dark:text-red-400"
          >
            {errors.name ?? ''}
          </span>
        </div>

        {/* Email field */}
        <div>
          <label
            htmlFor="field-email"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            id="field-email"
            ref={emailRef}
            data-testid="field-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            aria-required="true"
            aria-invalid={errors.email ? true : false}
            aria-describedby="error-email"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <span
            id="error-email"
            role="alert"
            className="mt-1 block text-xs text-red-600 dark:text-red-400"
          >
            {errors.email ?? ''}
          </span>
        </div>

        {/* Message field (optional) */}
        <div>
          <label
            htmlFor="field-message"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Message
          </label>
          <textarea
            id="field-message"
            data-testid="field-message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send Message
        </button>
      </form>

      <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
        <strong>What the screen reader hears:</strong>{' '}
        <code className="rounded bg-blue-100 px-1 dark:bg-blue-800">role="alert"</code> fires immediately when
        an error appears.{' '}
        <code className="rounded bg-blue-100 px-1 dark:bg-blue-800">aria-live="polite"</code> waits for current
        speech to finish before announcing.{' '}
        <code className="rounded bg-blue-100 px-1 dark:bg-blue-800">aria-describedby</code> reads the error
        message after the field label when the field is focused.
      </div>
    </section>
  )
}
