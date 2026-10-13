import { cn } from '@/lib/cn'

/** Kelas agar animasi skala berporos di tengah bentuk SVG itu sendiri, bukan di pojok kanvas. */
export const SELF_ORIGIN = 'origin-center [transform-box:fill-box]'

type SparkleProps = {
  /** Titik tengah kilau dalam koordinat SVG induk. */
  x: number
  y: number
  className?: string
}

/** Kilau bintang empat sudut; dipakai di dalam `<svg>` lain. */
export function Sparkle({ x, y, className }: SparkleProps) {
  return (
    <path
      d={`M${x} ${y - 10}q2 8 10 10q-8 2-10 10q-2-8-10-10q8-2 10-10z`}
      className={cn('fill-navy-600', SELF_ORIGIN, className)}
    />
  )
}
