import { useRef, useState } from 'react'

import { SCAN_DUPLICATE_WINDOW_MS, SCAN_SUCCESS_HOLD_MS } from '@/config/scanner'
import { normalizeBarcode } from '@/domain/product'
import { acceptScan, type ScanGate } from '@/domain/scan'
import { playBeep, vibrate } from '@/lib/feedback'
import { useDevicePrefsStore } from '@/store/devicePrefsStore'

type UseScanResultOptions = {
  /** `true` = tetap terbuka untuk scan berikutnya (kasir); `false` = tutup setelah satu kode. */
  continuous: boolean
  onDetect: (code: string) => void
  onClose: () => void
}

/**
 * Mengolah kode dari kamera: saring pembacaan ulang, beri bip/getar sesuai pengaturan HP,
 * lalu teruskan. Mode sekali-pakai menahan bingkai hijau sebentar sebelum menutup.
 */
export function useScanResult({ continuous, onDetect, onClose }: UseScanResultOptions) {
  const scanBeep = useDevicePrefsStore((state) => state.scanBeep)
  const scanVibrate = useDevicePrefsStore((state) => state.scanVibrate)
  const gateRef = useRef<ScanGate>(null)
  const finishedRef = useRef(false)
  const [successCount, setSuccessCount] = useState(0)
  const [lastCode, setLastCode] = useState<string | null>(null)

  const handleCode = (raw: string) => {
    const code = normalizeBarcode(raw)
    if (code === '' || finishedRef.current) return

    const decision = acceptScan(gateRef.current, code, performance.now(), SCAN_DUPLICATE_WINDOW_MS)
    gateRef.current = decision.gate
    if (!decision.accepted) return

    if (scanBeep) playBeep()
    if (scanVibrate) vibrate()
    setSuccessCount((count) => count + 1)
    setLastCode(code)

    if (continuous) {
      onDetect(code)
      return
    }
    finishedRef.current = true
    setTimeout(() => {
      onDetect(code)
      onClose()
    }, SCAN_SUCCESS_HOLD_MS)
  }

  return { handleCode, successCount, lastCode }
}
