import { clsx } from 'clsx'

interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={clsx('rounded bg-gray-200 dark:bg-gray-700', className || 'h-4 w-full')}
        />
      ))}
    </div>
  )
}
