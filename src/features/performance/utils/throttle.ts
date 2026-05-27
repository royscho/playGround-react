export function throttle<T extends (...args: unknown[]) => void>(fn: T, interval: number): T {
  let last = 0
  return ((...args: unknown[]) => {
    const now = Date.now()
    if (now - last >= interval) {
      last = now
      fn(...args)
    }
  }) as T
}
