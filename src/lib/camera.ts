import { CAMERA_IDEAL_HEIGHT_PX, CAMERA_IDEAL_WIDTH_PX } from '@/config/scanner'

/** Senter kamera belakang; null bila HP tidak mendukung. */
export type TorchControl = { set: (on: boolean) => Promise<void> }

export type CameraSession = {
  stop: () => void
  torch: TorchControl | null
}

// Kemampuan non-standar (belum ada di tipe DOM TypeScript) yang dipakai Chrome Android.
type ExtraTrackSettings = { torch?: boolean; focusMode?: string }

function hasTorch(track: MediaStreamTrack): boolean {
  const capabilities: unknown = track.getCapabilities()
  return typeof capabilities === 'object' && capabilities !== null && 'torch' in capabilities
}

function torchControl(track: MediaStreamTrack): TorchControl | null {
  if (!hasTorch(track)) return null
  return {
    set: async (on) => {
      const constraint: MediaTrackConstraintSet & ExtraTrackSettings = { torch: on }
      await track.applyConstraints({ advanced: [constraint] })
    },
  }
}

/** Fokus otomatis terus-menerus membantu membaca barcode dari dekat. Diabaikan bila tak didukung. */
async function enableContinuousFocus(track: MediaStreamTrack): Promise<void> {
  const constraint: MediaTrackConstraintSet & ExtraTrackSettings = { focusMode: 'continuous' }
  await track.applyConstraints({ advanced: [constraint] }).catch(() => undefined)
}

/**
 * Menyalakan kamera belakang ke elemen `<video>`. Wajib HTTPS (atau localhost).
 * Galat dilempar apa adanya; ubah ke pesan ramah dengan `describeCameraError`.
 */
export async function startCamera(video: HTMLVideoElement): Promise<CameraSession> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: { ideal: 'environment' },
      width: { ideal: CAMERA_IDEAL_WIDTH_PX },
      height: { ideal: CAMERA_IDEAL_HEIGHT_PX },
    },
  })
  const stop = () => {
    stream.getTracks().forEach((track) => {
      track.stop()
    })
  }

  try {
    video.srcObject = stream
    await video.play()
  } catch (error) {
    stop()
    throw error
  }

  const [track] = stream.getVideoTracks()
  if (track) await enableContinuousFocus(track)
  return { stop, torch: track ? torchControl(track) : null }
}

const CAMERA_MESSAGES: Record<string, string> = {
  NotAllowedError:
    'Izin kamera ditolak. Ketuk ikon gembok di bilah alamat Chrome → Izin → Kamera → Izinkan.',
  NotFoundError: 'Kamera tidak ditemukan di perangkat ini.',
  OverconstrainedError: 'Kamera belakang tidak tersedia di perangkat ini.',
  NotReadableError: 'Kamera sedang dipakai aplikasi lain. Tutup aplikasi itu lalu coba lagi.',
}

/** Pesan Bahasa Indonesia untuk galat kamera. */
export function describeCameraError(error: unknown): string {
  if (!window.isSecureContext || !('mediaDevices' in navigator)) {
    return 'Kamera hanya bisa dipakai lewat alamat HTTPS.'
  }
  const name = error instanceof DOMException ? error.name : ''
  return CAMERA_MESSAGES[name] ?? 'Kamera tidak bisa dibuka. Coba tutup lalu buka lagi.'
}
