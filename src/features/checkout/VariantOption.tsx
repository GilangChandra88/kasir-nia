import { Plus } from 'lucide-react'
import * as m from 'motion/react-m'

import { PRESS_SCALE, SPRING } from '@/config/motion'
import { formatNumber, formatRupiah } from '@/domain/money'
import type { Variant } from '@/domain/types'

type VariantOptionProps = {
  variant: Variant
  baseUnit: string
  /** False bila stok tidak cukup untuk 1 jenis ini lagi. */
  available: boolean
  onPick: () => void
}

/** Satu pilihan jenis: tombol besar agar mudah diketuk jempol. */
export function VariantOption({ variant, baseUnit, available, onPick }: VariantOptionProps) {
  return (
    <m.button
      type="button"
      disabled={!available}
      onClick={onPick}
      whileTap={available ? { scale: PRESS_SCALE } : undefined}
      transition={SPRING.bouncy}
      className="flex min-h-16 w-full items-center gap-3 rounded-2xl border border-line bg-white p-3 text-left transition-colors enabled:hover:border-navy-600 enabled:hover:bg-navy-50 disabled:opacity-50"
    >
      <span className="min-w-0 flex-1">
        <span className="block font-bold">{variant.label}</span>
        <span className="block text-sm text-muted">
          {available ? `Isi ${formatNumber(variant.baseQty)} ${baseUnit}` : 'Stok tidak cukup'}
        </span>
      </span>
      <span className="font-extrabold text-navy-800 tabular-nums">
        {formatRupiah(variant.price)}
      </span>
      <span className="grid size-9 place-items-center rounded-full bg-navy-950 text-white">
        <Plus className="size-5" aria-hidden="true" />
      </span>
    </m.button>
  )
}
