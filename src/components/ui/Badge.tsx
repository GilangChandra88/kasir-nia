import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

type BadgeTone = 'navy' | 'success' | 'warning' | 'danger' | 'muted'

type BadgeProps = {
  tone?: BadgeTone
  children: ReactNode
}

const TONES: Record<BadgeTone, string> = {
  navy: 'bg-navy-100 text-navy-800',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/15 text-navy-950',
  danger: 'bg-danger/10 text-danger',
  muted: 'bg-line text-muted',
}

export function Badge({ tone = 'navy', children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        TONES[tone],
      )}
    >
      {children}
    </span>
  )
}
