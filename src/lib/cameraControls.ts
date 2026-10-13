import { z } from 'zod'

import { CAMERA_DEFAULT_ZOOM, REFOCUS_RESET_MS } from '@/config/scanner'

/** Kemampuan kamera non-standar Chrome Android; dibaca aman karena tiap HP berbeda. */
const capabilitiesSchema = z.object({
  torch: z.boolean().optional(),
  focusMode: z.array(z.string()).optional(),
  zoom: z.object({ min: z.number(), max: z.number() }).optional(),
})

type Capabilities = z.infer<typeof capabilitiesSchema>

// Batasan yang belum ada di tipe DOM TypeScript.
type ExtraConstraints = {
  torch?: boolean
  focusMode?: string
  zoom?: number
  pointsOfInterest?: { x: number; y: number }[]
}

/** Zoom minimal yang dianggap berguna (kali); di bawah ini tombol zoom tidak ditampilkan. */
const MIN_USEFUL_ZOOM = 1.3

export type TorchControl = { set: (on: boolean) => Promise<void> }

export type ZoomControl = {
  /** Pilihan zoom (kali), mis. [1, 2]. */
  levels: readonly number[]
  initial: number
  set: (level: number) => Promise<void>
}

/** Fokus ke titik yang diketuk; `x`,`y` dalam 0–1 relatif terhadap gambar kamera. */
export type FocusControl = (point: { x: number; y: number }) => Promise<void>

export type CameraControls = {
  torch: TorchControl | null
  zoom: ZoomControl | null
  focusAt: FocusControl | null
}

function readCapabilities(track: MediaStreamTrack): Capabilities {
  const result = capabilitiesSchema.safeParse(track.getCapabilities())
  return result.success ? result.data : {}
}

function apply(track: MediaStreamTrack, constraint: ExtraConstraints): Promise<void> {
  const set: MediaTrackConstraintSet & ExtraConstraints = constraint
  return track.applyConstraints({ advanced: [set] })
}

const ignore = () => undefined

async function setupZoom(track: MediaStreamTrack, caps: Capabilities): Promise<ZoomControl | null> {
  if (!caps.zoom) return null
  const low = Math.max(1, caps.zoom.min)
  const high = Math.min(CAMERA_DEFAULT_ZOOM, caps.zoom.max)
  if (high < MIN_USEFUL_ZOOM || high <= low) return null

  await apply(track, { zoom: high }).catch(ignore)
  return { levels: [low, high], initial: high, set: (level) => apply(track, { zoom: level }) }
}

function setupFocus(track: MediaStreamTrack, modes: string[]): FocusControl | null {
  const canSingle = modes.includes('single-shot')
  const canContinuous = modes.includes('continuous')
  if (!canSingle && !canContinuous) return null

  return async (point) => {
    await apply(track, {
      focusMode: canSingle ? 'single-shot' : 'continuous',
      pointsOfInterest: [point],
    })
    // Setelah fokus sekali, kembali ke fokus otomatis agar barcode berikutnya tetap tajam.
    if (canSingle && canContinuous) {
      setTimeout(() => {
        apply(track, { focusMode: 'continuous' }).catch(ignore)
      }, REFOCUS_RESET_MS)
    }
  }
}

/**
 * Menyalakan fokus otomatis terus-menerus & zoom bawaan, lalu menyiapkan kontrol senter, zoom,
 * dan ketuk-untuk-fokus. Kemampuan yang tidak didukung HP bernilai null (tombolnya disembunyikan).
 */
export async function setupCameraControls(track: MediaStreamTrack): Promise<CameraControls> {
  const caps = readCapabilities(track)
  const focusModes = caps.focusMode ?? []
  if (focusModes.includes('continuous')) {
    await apply(track, { focusMode: 'continuous' }).catch(ignore)
  }

  return {
    torch: caps.torch ? { set: (on) => apply(track, { torch: on }) } : null,
    zoom: await setupZoom(track, caps),
    focusAt: setupFocus(track, focusModes),
  }
}
