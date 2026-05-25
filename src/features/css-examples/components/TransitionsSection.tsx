export function TransitionsSection() {
  return (
    <section>
      <style>{`
        .tr-button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
          font-size: 14px;
        }
        .tr-button:hover {
          background: #1d4ed8;
          transform: scale(1.05);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .tr-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e5e7eb;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .tr-bouncer {
          width: 32px;
          height: 32px;
          background: #ec4899;
          border-radius: 50%;
          animation: bounce 0.8s ease-in-out infinite;
        }
      `}</style>

      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
        Transitions &amp; Animations
      </h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        transition, @keyframes, animation
      </p>

      <div className="flex flex-wrap items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <button className="tr-button" data-testid="transition-button">Hover me</button>
          <code className="text-xs text-gray-500">transition + :hover</code>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="tr-spinner" data-testid="spinner-demo" aria-label="spinner" />
          <code className="text-xs text-gray-500">@keyframes spin</code>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="tr-bouncer" data-testid="bouncer-demo" aria-label="bouncer" />
          <code className="text-xs text-gray-500">@keyframes bounce</code>
        </div>
      </div>
    </section>
  )
}
