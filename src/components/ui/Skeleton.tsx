import { cn } from '@/lib/cn'

type SkeletonProps = {
  className?: string
}

/** Kotak abu-abu berdenyut sebagai tempat isi yang sedang dimuat. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-2xl bg-line/70', className)} aria-hidden="true" />
  )
}
