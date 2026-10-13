import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

type ReceiptRowProps = {
  label: ReactNode
  value: ReactNode
  /** Baris tebal & besar, mis. TOTAL. */
  strong?: boolean
}

/** Baris kiri–kanan struk (label & angka rata kanan). */
export function ReceiptRow({ label, value, strong }: ReceiptRowProps) {
  return (
    <div className={cn('flex justify-between gap-3', strong && 'text-base font-extrabold')}>
      <span>{label}</span>
      <span className="text-right tabular-nums">{value}</span>
    </div>
  )
}
