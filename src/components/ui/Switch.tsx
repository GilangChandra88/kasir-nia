import * as m from 'motion/react-m'

import { SPRING } from '@/config/motion'
import { cn } from '@/lib/cn'

type SwitchProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  disabled?: boolean
}

/** Jarak geser kenop saklar (piksel) = lebar jalur − lebar kenop − 2 × celah. */
const KNOB_TRAVEL_PX = 20

export function Switch({ checked, onChange, label, description, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => {
        onChange(!checked)
      }}
      className="flex w-full items-center gap-4 py-1 text-left disabled:opacity-50"
    >
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{label}</span>
        {description && <span className="block text-sm text-muted">{description}</span>}
      </span>
      <span
        className={cn(
          'flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors',
          checked ? 'bg-navy-950' : 'bg-line',
        )}
      >
        <m.span
          className="size-5 rounded-full bg-white shadow-soft"
          initial={false}
          animate={{ x: checked ? KNOB_TRAVEL_PX : 0 }}
          transition={SPRING.bouncy}
        />
      </span>
    </button>
  )
}
