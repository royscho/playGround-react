import { useState, useEffect, useRef, useCallback } from 'react'

const CARD_COUNT = 20

export function LazyLoadSection() {
  const [loadedCards, setLoadedCards] = useState<Set<number>>(new Set())
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const markLoaded = useCallback((index: number) => {
    setLoadedCards(prev => {
      if (prev.has(index)) return prev
      const next = new Set(prev)
      next.add(index)
      return next
    })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.cardIndex)
            markLoaded(index)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    cardRefs.current.forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [markLoaded])

  return (
    <section data-testid="lazy-load-section">
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
        Lazy Loading (IntersectionObserver)
      </h2>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        Scroll the grid. Cards load only when they enter the viewport.
      </p>
      <p className="mb-4 font-mono text-sm text-blue-600 dark:text-blue-400" data-testid="loaded-count">
        {loadedCards.size} / {CARD_COUNT}
      </p>

      <div className="h-72 overflow-y-auto rounded-lg border border-gray-200 p-3 dark:border-gray-700">
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: CARD_COUNT }, (_, i) => (
            <div
              key={i}
              ref={el => { cardRefs.current[i] = el }}
              data-card-index={i}
              data-testid={`lazy-card-${i}`}
              className="h-24 rounded-lg"
            >
              {loadedCards.has(i) ? (
                <div
                  className="flex h-full items-center justify-center rounded-lg text-xs font-medium text-white"
                  style={{ backgroundColor: `hsl(${(i * 37) % 360}, 60%, 55%)` }}
                >
                  Loaded ✓
                </div>
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-400 dark:bg-gray-700 dark:text-gray-500">
                  Not loaded
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
