// src/features/css-examples/components/VisualEffectsSection.tsx
export function VisualEffectsSection() {
  return (
    <section>
      <style>{`
        .ve-gradient {
          background: linear-gradient(135deg, #6366f1, #ec4899);
          padding: 32px 24px;
          border-radius: 12px;
          color: white;
          text-align: center;
        }
        .ve-radius {
          background: #3b82f6;
          border-radius: 9999px;
          padding: 10px 24px;
          color: white;
          display: inline-block;
        }
        .ve-shadow {
          background: white;
          border-radius: 8px;
          padding: 32px 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
          transition: box-shadow 0.3s ease;
          text-align: center;
        }
        .ve-shadow:hover {
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.24);
        }
        .ve-filter {
          background: #f59e0b;
          border-radius: 8px;
          padding: 32px 24px;
          filter: saturate(2) hue-rotate(20deg);
          text-align: center;
        }
      `}</style>

      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Visual Effects</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        gradient, border-radius, box-shadow, filter
      </p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="ve-gradient" data-testid="gradient-demo">
          <code className="text-xs">linear-gradient</code>
        </div>
        <div className="flex items-center justify-center p-4" data-testid="radius-demo">
          <span className="ve-radius">
            <code className="text-xs">border-radius: 9999px</code>
          </span>
        </div>
        <div className="ve-shadow" data-testid="shadow-demo">
          <code className="text-xs">box-shadow + :hover</code>
        </div>
        <div className="ve-filter" data-testid="filter-demo">
          <code className="text-xs">filter: saturate + hue-rotate</code>
        </div>
      </div>
    </section>
  )
}
