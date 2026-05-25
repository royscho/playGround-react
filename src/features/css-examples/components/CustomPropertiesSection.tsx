import { useState } from 'react'
import type { CSSProperties } from 'react'

const themes = {
  ocean: {
    '--cp-primary': '#0ea5e9',
    '--cp-bg': '#f0f9ff',
    '--cp-text': '#0c4a6e',
    '--cp-card': '#e0f2fe',
  },
  forest: {
    '--cp-primary': '#16a34a',
    '--cp-bg': '#f0fdf4',
    '--cp-text': '#14532d',
    '--cp-card': '#dcfce7',
  },
} as const

type Theme = keyof typeof themes

export function CustomPropertiesSection() {
  const [theme, setTheme] = useState<Theme>('ocean')
  const other: Theme = theme === 'ocean' ? 'forest' : 'ocean'

  return (
    <section>
      <style>{`
        .cp-card {
          background: var(--cp-card);
          border-radius: 12px;
          padding: 24px;
        }
        .cp-heading {
          color: var(--cp-primary);
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .cp-body {
          color: var(--cp-text);
          font-size: 14px;
          line-height: 1.6;
        }
        .cp-button {
          margin-top: 16px;
          background: var(--cp-primary);
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }
        .cp-vars {
          margin-top: 12px;
          font-family: monospace;
          font-size: 12px;
        }
      `}</style>

      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Custom Properties</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        CSS variables (--property) with live theme switching
      </p>

      <div
        data-testid="theme-preview"
        data-theme={theme}
        style={{ ...(themes[theme] as CSSProperties), background: 'var(--cp-bg)', padding: '24px', borderRadius: '12px' }}
      >
        <div className="cp-card">
          <p className="cp-heading">Theme: {theme}</p>
          <p className="cp-body">
            All colors come from CSS custom properties. Switching the theme updates the
            variables — no class changes on child elements needed.
          </p>
          <button
            className="cp-button"
            onClick={() => setTheme(other)}
            data-testid="theme-toggle"
          >
            Switch to {other}
          </button>
        </div>
        <div className="cp-vars" style={{ color: 'var(--cp-text)' }}>
          {Object.entries(themes[theme]).map(([k, v]) => (
            <p key={k}>{k}: {v}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
