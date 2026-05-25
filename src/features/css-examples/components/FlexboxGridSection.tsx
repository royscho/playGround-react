const boxes = ['1', '2', '3', '4', '5', '6']

export function FlexboxGridSection() {
  return (
    <section>
      <style>{`
        .fg-box {
          background: #6366f1;
          color: white;
          padding: 12px;
          border-radius: 4px;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
        }
        .fg-flex-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px dashed #d1d5db;
        }
        .fg-grid-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px dashed #d1d5db;
        }
        .fg-grid-container .fg-box {
          background: #8b5cf6;
        }
      `}</style>

      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Flexbox &amp; Grid</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        display: flex vs display: grid
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <code>display: flex; flex-wrap: wrap</code>
          </p>
          <div className="fg-flex-container" data-testid="flex-container">
            {boxes.map((n) => (
              <div key={n} className="fg-box">{n}</div>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <code>display: grid; grid-template-columns: repeat(3, 1fr)</code>
          </p>
          <div className="fg-grid-container" data-testid="grid-container">
            {boxes.map((n) => (
              <div key={n} className="fg-box">{n}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
