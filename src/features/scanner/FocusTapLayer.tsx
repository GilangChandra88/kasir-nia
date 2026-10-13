import { type PointerEvent, useState } from 'react'

import type { FocusControl } from '@/lib/cameraControls'

type FocusTapLayerProps = {
  focusAt: FocusControl | null
}

type Ring = { id: number; left: number; top: number }

/** Lapisan di atas video: ketuk untuk memfokuskan kamera, dengan lingkaran fokus kecil. */
export function FocusTapLayer({ focusAt }: FocusTapLayerProps) {
  const [ring, setRing] = useState<Ring | null>(null)

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!focusAt) return
    const box = event.currentTarget.getBoundingClientRect()
    const left = event.clientX - box.left
    const top = event.clientY - box.top
    setRing((previous) => ({ id: (previous?.id ?? 0) + 1, left, top }))
    focusAt({ x: left / box.width, y: top / box.height }).catch(() => undefined)
  }

  return (
    <div
      className="absolute inset-0"
      onPointerDown={handlePointerDown}
      aria-hidden="true"
      title={focusAt ? 'Ketuk untuk fokus' : undefined}
    >
      {ring && (
        <span
          key={ring.id}
          className="pointer-events-none absolute size-16 animate-focus-ring rounded-full border-2 border-white"
          style={{ left: ring.left, top: ring.top }}
        />
      )}
    </div>
  )
}
