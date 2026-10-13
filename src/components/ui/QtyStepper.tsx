import { Minus, Plus, Trash2 } from 'lucide-react'
import * as m from 'motion/react-m'

import { PRESS_SCALE, SPRING } from '@/config/motion'
import { cn } from '@/lib/cn'

type QtyStepperProps = {
  value: number
  onChange: (next: number) => void
  /** Nama barang untuk pembaca layar ("Tambah 1 Rokok A"). */
  itemLabel: string
  max?: number
}

const STEP_BUTTON =
  'grid size-8 place-items-center rounded-full bg-white shadow-soft transition-colors disabled:opacity-40'

/** − angka + yang ringkas. Pada jumlah 1, tombol kurang berubah jadi ikon hapus. */
export function QtyStepper({ value, onChange, itemLabel, max }: QtyStepperProps) {
  const removing = value <= 1
  const MinusIcon = removing ? Trash2 : Minus

  return (
    <div className="flex items-center gap-1 rounded-full bg-navy-50 p-1">
      <m.button
        type="button"
        aria-label={removing ? `Hapus ${itemLabel}` : `Kurangi 1 ${itemLabel}`}
        whileTap={{ scale: PRESS_SCALE * 0.9 }}
        transition={SPRING.bouncy}
        onClick={() => {
          onChange(value - 1)
        }}
        className={cn(STEP_BUTTON, removing ? 'text-danger' : 'text-navy-800')}
      >
        <MinusIcon className="size-4" aria-hidden="true" />
      </m.button>
      <m.span
        key={value}
        initial={{ scale: 1.35 }}
        animate={{ scale: 1 }}
        transition={SPRING.bouncy}
        className="min-w-7 text-center font-bold tabular-nums"
        aria-live="polite"
      >
        {value}
      </m.span>
      <m.button
        type="button"
        aria-label={`Tambah 1 ${itemLabel}`}
        disabled={max !== undefined && value >= max}
        whileTap={{ scale: PRESS_SCALE * 0.9 }}
        transition={SPRING.bouncy}
        onClick={() => {
          onChange(value + 1)
        }}
        className={cn(STEP_BUTTON, 'text-navy-800')}
      >
        <Plus className="size-4" aria-hidden="true" />
      </m.button>
    </div>
  )
}
