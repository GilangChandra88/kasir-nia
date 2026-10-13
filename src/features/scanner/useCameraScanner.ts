import { type RefObject, useEffect, useRef, useState } from 'react'

import { SCAN_INTERVAL_MS } from '@/config/scanner'
import { createBarcodeDetector, type Detector } from '@/lib/barcodeDetector'
import { type CameraSession, describeCameraError, startCamera } from '@/lib/camera'
import type { CameraControls } from '@/lib/cameraControls'

export type ScannerState =
  { status: 'starting' } | { status: 'scanning' } | { status: 'error'; message: string }

const DETECTOR_FAILED = 'Pembaca barcode gagal dimuat. Periksa internet lalu coba lagi.'

/**
 * Menyalakan kamera di `videoRef` dan membaca barcode berkala. `onCode` menerima kode mentah
 * setiap kali terbaca (penyaringan pembacaan ulang dilakukan pemanggil). Kamera dimatikan saat
 * komponen dilepas.
 */
export function useCameraScanner(
  videoRef: RefObject<HTMLVideoElement | null>,
  onCode: (code: string) => void,
) {
  const [state, setState] = useState<ScannerState>({ status: 'starting' })
  const [controls, setControls] = useState<CameraControls | null>(null)
  const onCodeRef = useRef(onCode)

  useEffect(() => {
    onCodeRef.current = onCode
  }, [onCode])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let cancelled = false
    // Fungsi (bukan variabel langsung) karena `cancelled` diubah dari luar oleh cleanup effect.
    const isCancelled = () => cancelled
    let camera: CameraSession | null = null
    let timer: ReturnType<typeof setTimeout> | undefined

    const readFrame = async (detector: Detector) => {
      if (isCancelled()) return
      try {
        if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          const [first] = await detector.detect(video)
          if (first && !isCancelled()) onCodeRef.current(first.rawValue)
        }
      } catch {
        // Satu gambar gagal dibaca itu wajar (buram, gelap); lanjut ke gambar berikutnya.
      }
      timer = setTimeout(() => void readFrame(detector), SCAN_INTERVAL_MS)
    }

    const start = async () => {
      try {
        camera = await startCamera(video)
      } catch (error) {
        if (!isCancelled()) setState({ status: 'error', message: describeCameraError(error) })
        return
      }
      if (isCancelled()) {
        camera.stop()
        return
      }
      try {
        const detector = await createBarcodeDetector()
        if (isCancelled()) return
        setControls({ torch: camera.torch, zoom: camera.zoom, focusAt: camera.focusAt })
        setState({ status: 'scanning' })
        void readFrame(detector)
      } catch {
        if (!isCancelled()) setState({ status: 'error', message: DETECTOR_FAILED })
      }
    }

    void start()
    return () => {
      cancelled = true
      clearTimeout(timer)
      camera?.stop()
    }
  }, [videoRef])

  return { state, controls }
}
