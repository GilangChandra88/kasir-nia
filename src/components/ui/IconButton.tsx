import type { LucideIcon } from 'lucide-react'
import * as m from 'motion/react-m'

import { PRESS_SCALE, SPRING } from '@/config/motion'
import { cn } from '@/lib/cn'

const TONES = {
  navy: 'text-navy-800 hover:bg-navy-50',
  danger: 'text-danger hover:bg-danger/10',
  /** Untuk latar gelap, mis. layar scanner. */
  light: 'bg-white/15 text-white backdrop-blur hover:bg-white/25',
} as const

type IconButtonProps = {
  icon: LucideIcon
  /** Wajib: ikon tanpa teks butuh nama untuk pembaca layar. */
  label: string
  onClick: () => void
  tone?: 'navy' | 'danger' | 'light'
  disabled?: boolean
}

export function IconButton({
  icon: Icon,
  label,
  onClick,
  tone = 'navy',
  disabled,
}: IconButtonProps) {
  return (
    <m.button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.9 * PRESS_SCALE }}
      transition={SPRING.bouncy}
      className={cn(
        'grid size-10 shrink-0 place-items-center rounded-full transition-colors disabled:opacity-40',
        TONES[tone],
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
    </m.button>
  )
}
