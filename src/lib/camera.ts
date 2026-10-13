import { CAMERA_IDEAL_HEIGHT_PX, CAMERA_IDEAL_WIDTH_PX } from '@/config/scanner'

import { type CameraControls, setupCameraControls } from './cameraControls'
import { pickMainBackCamera } from './cameraSelection'

export type CameraSession = CameraControls & { stop: () => void }

/** Kamera utama yang sudah ditemukan, diingat selama aplikasi terbuka agar tidak mencari ulang. */
let preferredDeviceId: string | null = null

function videoConstraints(deviceId: string | null): MediaTrackConstraints {
  return {
    ...(deviceId ? { deviceId: { exact: deviceId } } : { facingMode: { ideal: 'environment' } }),
    width: { ideal: CAMERA_IDEAL_WIDTH_PX },
    height: { ideal: CAMERA_IDEAL_HEIGHT_PX },
  }
}

function request(deviceId: string | null): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({ audio: false, video: videoConstraints(deviceId) })
}

function stopStream(stream: MediaStream): void {
  stream.getTracks().forEach((track) => {
    track.stop()
  })
}

/**
 * Membuka kamera belakang UTAMA. Chrome Android sering memberi lensa ultra-wide yang buram dari
 * dekat, jadi setelah izin diberikan (nama kamera baru terbaca), kita pindah ke kamera utama.
 */
async function openMainBackCamera(): Promise<MediaStream> {
  if (preferredDeviceId) {
    try {
      return await request(preferredDeviceId)
    } catch {
      preferredDeviceId = null
    }
  }

  const stream = await request(null)
  const devices = await navigator.mediaDevices.enumerateDevices()
  const main = pickMainBackCamera(devices.filter((device) => device.kind === 'videoinput'))
  const current = stream.getVideoTracks()[0]?.getSettings().deviceId ?? null
  if (!main || main === current) {
    preferredDeviceId = current
    return stream
  }

  stopStream(stream)
  try {
    const better = await request(main)
    preferredDeviceId = main
    return better
  } catch {
    return request(null)
  }
}

const NO_CONTROLS: CameraControls = { torch: null, zoom: null, focusAt: null }

/**
 * Menyalakan kamera ke elemen `<video>`: kamera utama, fokus otomatis, zoom bawaan.
 * Wajib HTTPS (atau localhost). Galat dilempar apa adanya; ubah ke pesan ramah dengan
 * `describeCameraError`.
 */
export async function startCamera(video: HTMLVideoElement): Promise<CameraSession> {
  const stream = await openMainBackCamera()
  const stop = () => {
    stopStream(stream)
  }

  try {
    video.srcObject = stream
    await video.play()
  } catch (error) {
    stop()
    throw error
  }

  const [track] = stream.getVideoTracks()
  const controls = track ? await setupCameraControls(track) : NO_CONTROLS
  return { ...controls, stop }
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
