import * as m from 'motion/react-m'
import type { ReactNode } from 'react'

import { PRESS_SCALE, SPRING } from '@/config/motion'
import { cn } from '@/lib/cn'

type ChipProps = {
  selected?: boolean
  onClick: () => void
  children: ReactNode
  /** Angka kecil di kanan, mis. jumlah barang. */
  count?: number
}

/** Pilihan kecil berbentuk pil: filter, template, atau satuan. */
export function Chip({ selected = false, onClick, children, count }: ChipProps) {
  return (
    <m.button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      whileTap={{ scale: PRESS_SCALE }}
      transition={SPRING.bouncy}
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors',
        selected
          ? 'border-navy-950 bg-navy-950 text-white'
          : 'border-line bg-white text-navy-800 hover:bg-navy-50',
      )}
    >
      {children}
      {count !== undefined && (
        <span
          className={cn(
            'min-w-5 rounded-full px-1.5 text-xs tabular-nums',
            selected ? 'bg-white/20' : 'bg-navy-50 text-muted',
          )}
        >
          {count}
        </span>
      )}
    </m.button>
  )
}
