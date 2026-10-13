import { cn } from '@/lib/cn'

/** Jumlah gigi sobekan kertas & ukuran kanvas SVG (unit viewBox). */
const TEETH = 24
const WIDTH = 240
const HEIGHT = 10

/** Jalur gigi dihitung sekali saat modul dimuat. */
const PATH = (() => {
  const step = WIDTH / TEETH
  const teeth = Array.from(
    { length: TEETH },
    (_, index) => `L${(index + 0.5) * step} ${HEIGHT} L${(index + 1) * step} 0`,
  )
  return `M0 0 ${teeth.join(' ')} Z`
})()

type ZigzagEdgeProps = {
  className?: string
}

/** Tepi bawah bergerigi seperti struk yang disobek dari mesin kasir. Warna mengikuti `fill-*`. */
export function ZigzagEdge({ className }: ZigzagEdgeProps) {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      className={cn('block h-2.5 w-full', className)}
      aria-hidden="true"
    >
      <path d={PATH} />
    </svg>
  )
}
