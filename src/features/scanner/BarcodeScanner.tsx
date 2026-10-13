import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useModalBehavior } from '@/components/ui/useModalBehavior'

import { ScannerView, type ScannerViewProps } from './ScannerView'

type BarcodeScannerProps = Omit<ScannerViewProps, 'onRetry' | 'continuous' | 'title'> & {
  open: boolean
  title?: string
  continuous?: boolean
}

/**
 * Scanner kamera layar penuh. Kamera hanya menyala selama terbuka. Panggil `unlockAudio()` di
 * klik yang membukanya agar bunyi bip diizinkan browser.
 */
export function BarcodeScanner({
  open,
  title = 'Scan barcode',
  continuous = false,
  onDetect,
  onClose,
}: BarcodeScannerProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  // Mengganti key memasang ulang ScannerView → kamera dibuka ulang dari awal.
  const [attempt, setAttempt] = useState(0)
  useModalBehavior(open, onClose, panelRef)

  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div
          key="scanner"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          className="fixed inset-0 z-[70] bg-navy-950 outline-none"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.2 }}
        >
          <ScannerView
            key={attempt}
            title={title}
            continuous={continuous}
            onDetect={onDetect}
            onClose={onClose}
            onRetry={() => {
              setAttempt((value) => value + 1)
            }}
          />
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
