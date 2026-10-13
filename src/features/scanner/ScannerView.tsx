import { useRef } from 'react'

import { cn } from '@/lib/cn'

import { FocusTapLayer } from './FocusTapLayer'
import type { ScanHandler } from './scanFeedback'
import { ScanFrame } from './ScanFrame'
import { ScannerHeader } from './ScannerHeader'
import { ScannerStatus } from './ScannerStatus'
import { useCameraScanner } from './useCameraScanner'
import { useScanResult } from './useScanResult'

export type ScannerViewProps = {
  title: string
  continuous: boolean
  onDetect: ScanHandler
  onClose: () => void
  /** Memasang ulang kamera dari awal (setelah galat). */
  onRetry: () => void
}

/** Layar kamera penuh: video, bingkai bidik, judul, zoom, senter, ketuk-fokus, dan petunjuk. */
export function ScannerView({ title, continuous, onDetect, onClose, onRetry }: ScannerViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { handleCode, successCount, lastFeedback } = useScanResult({
    continuous,
    onDetect,
    onClose,
  })
  const { state, controls } = useCameraScanner(videoRef, handleCode)

  return (
    <div className="relative size-full overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        playsInline
        muted
        aria-hidden="true"
      />
      <FocusTapLayer focusAt={controls?.focusAt ?? null} />

      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <ScanFrame successCount={successCount} scanning={state.status === 'scanning'} />
      </div>

      <ScannerHeader title={title} controls={controls} onClose={onClose} />

      <footer className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 p-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] text-center text-white">
        {continuous && lastFeedback && (
          <span
            key={successCount}
            className={cn(
              'animate-pop rounded-full px-3 py-1 text-sm font-semibold',
              lastFeedback.tone === 'success' ? 'bg-success' : 'bg-danger',
            )}
          >
            {lastFeedback.tone === 'success' ? '✓' : '!'} {lastFeedback.text}
          </span>
        )}
        <p className="max-w-72 text-sm text-white/80">
          Pegang HP ± 20 cm dari barcode. Buram? Jauhkan sedikit atau ketuk layar untuk fokus.
        </p>
      </footer>

      <ScannerStatus state={state} onRetry={onRetry} onClose={onClose} />
    </div>
  )
}
