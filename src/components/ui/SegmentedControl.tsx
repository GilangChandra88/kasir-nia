import * as m from 'motion/react-m'
import { useId } from 'react'

import { SPRING } from '@/config/motion'
import { cn } from '@/lib/cn'

type Segment<T extends string> = { value: T; label: string }

type SegmentedControlProps<T extends string> = {
  segments: readonly Segment<T>[]
  value: T
  onChange: (value: T) => void
  label: string
}

/** Pilihan 2–3 mode dengan pil yang meluncur ke pilihan aktif. */
export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  label,
}: SegmentedControlProps<T>) {
  // Id unik agar pil tidak "melompat" ke kontrol lain yang tampil bersamaan.
  const pillId = useId()

  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-2xl bg-navy-50 p-1">
      {segments.map((segment) => {
        const active = segment.value === value
        return (
          <button
            key={segment.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => {
              onChange(segment.value)
            }}
            className={cn(
              'relative h-10 flex-1 rounded-xl text-sm font-semibold transition-colors',
              active ? 'text-navy-950' : 'text-muted',
            )}
          >
            {active && (
              <m.span
                layoutId={pillId}
                className="absolute inset-0 rounded-xl bg-white shadow-soft"
                transition={SPRING.gentle}
              />
            )}
            <span className="relative">{segment.label}</span>
          </button>
        )
      })}
    </div>
  )
}
