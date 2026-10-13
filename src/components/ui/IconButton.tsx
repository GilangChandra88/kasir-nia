import type { LucideIcon } from 'lucide-react'
import * as m from 'motion/react-m'

import { PRESS_SCALE, SPRING } from '@/config/motion'
import { cn } from '@/lib/cn'

type IconButtonProps = {
  icon: LucideIcon
  /** Wajib: ikon tanpa teks butuh nama untuk pembaca layar. */
  label: string
  onClick: () => void
  tone?: 'navy' | 'danger'
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
        tone === 'danger' ? 'text-danger hover:bg-danger/10' : 'text-navy-800 hover:bg-navy-50',
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
    </m.button>
  )
}
