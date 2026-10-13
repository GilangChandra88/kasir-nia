import { useEffect, useRef } from 'react'

import { BARCODE_MIN_LENGTH } from '@/config/limits'
import { HARDWARE_SCANNER_MAX_GAP_MS } from '@/config/scanner'

import { EMPTY_KEY_BUFFER, pushKey } from './keyBuffer'

const OPTIONS = { maxGapMs: HARDWARE_SCANNER_MAX_GAP_MS, minLength: BARCODE_MIN_LENGTH }

/** Isian teks menerima ketikan scanner apa adanya; penangkap global tidak ikut campur. */
function isEditable(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  )
}

/**
 * Menangkap tembakan scanner fisik (Bluetooth/USB OTG mode keyboard) saat tidak ada isian yang
 * sedang fokus. `onScan` menerima kode mentah. Nonaktif bila `enabled` false.
 */
export function useHardwareScanner(onScan: (code: string) => void, enabled = true) {
  const onScanRef = useRef(onScan)

  useEffect(() => {
    onScanRef.current = onScan
  }, [onScan])

  useEffect(() => {
    if (!enabled) return
    let buffer = EMPTY_KEY_BUFFER

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditable(event.target) || event.ctrlKey || event.metaKey || event.altKey) return
      const result = pushKey(buffer, event.key, event.timeStamp, OPTIONS)
      buffer = result.buffer
      if (result.scanned) {
        event.preventDefault()
        onScanRef.current(result.scanned)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled])
}
