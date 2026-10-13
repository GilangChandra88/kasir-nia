import * as m from 'motion/react-m'
import { useState } from 'react'

import { PRESS_SCALE, SPRING } from '@/config/motion'
import type { ZoomControl } from '@/lib/cameraControls'

type ZoomButtonProps = {
  zoom: ZoomControl
}

const formatLevel = (level: number) => `${Number(level.toFixed(1))}×`

/** Ganti zoom 1× ↔ 2×. Zoom 2× membuat HP bisa dipegang lebih jauh sehingga fokus lebih tajam. */
export function ZoomButton({ zoom }: ZoomButtonProps) {
  const [level, setLevel] = useState(zoom.initial)
  const nextLevel = zoom.levels.find((value) => value > level) ?? zoom.levels[0] ?? level

  return (
    <m.button
      type="button"
      aria-label={`Zoom ${formatLevel(level)}, ketuk untuk ${formatLevel(nextLevel)}`}
      whileTap={{ scale: PRESS_SCALE }}
      transition={SPRING.bouncy}
      onClick={() => {
        zoom.set(nextLevel).then(
          () => {
            setLevel(nextLevel)
          },
          () => undefined,
        )
      }}
      className="grid h-10 min-w-12 place-items-center rounded-full bg-white/15 px-3 text-sm font-bold text-white tabular-nums backdrop-blur"
    >
      {formatLevel(level)}
    </m.button>
  )
}
