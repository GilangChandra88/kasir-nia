import { X } from 'lucide-react'
import { useRef } from 'react'

import { IconButton } from '@/components/ui/IconButton'

import { ScanFrame } from './ScanFrame'
import { ScannerStatus } from './ScannerStatus'
import { TorchButton } from './TorchButton'
import { useCameraScanner } from './useCameraScanner'
import { useScanResult } from './useScanResult'

export type ScannerViewProps = {
  title: string
  continuous: boolean
  onDetect: (code: string) => void
  onClose: () => void
  /** Memasang ulang kamera dari awal (setelah galat). */
  onRetry: () => void
}

/** Layar kamera penuh: video, bingkai bidik, judul, senter, dan petunjuk. */
export function ScannerView({ title, continuous, onDetect, onClose, onRetry }: ScannerViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { handleCode, successCount, lastCode } = useScanResult({ continuous, onDetect, onClose })
  const { state, torch } = useCameraScanner(videoRef, handleCode)

  return (
    <div className="relative size-full overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        playsInline
        muted
        aria-hidden="true"
      />

      <div className="absolute inset-0 grid place-items-center">
        <ScanFrame successCount={successCount} scanning={state.status === 'scanning'} />
      </div>

      <header className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4 pt-[max(env(safe-area-inset-top),1rem)] text-white">
        <IconButton icon={X} label="Tutup scanner" tone="light" onClick={onClose} />
        <h2 className="truncate text-base font-bold">{title}</h2>
        {torch ? <TorchButton torch={torch} /> : <span className="size-10" aria-hidden="true" />}
      </header>

      <footer className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 p-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] text-center text-white">
        {continuous && lastCode && (
          <span className="rounded-full bg-success px-3 py-1 text-sm font-semibold tabular-nums">
            ✓ {lastCode}
          </span>
        )}
        <p className="max-w-64 text-sm text-white/80">
          Arahkan kamera ke barcode. Jaga jarak ± 15 cm dan pastikan cukup terang.
        </p>
      </footer>

      <ScannerStatus state={state} onRetry={onRetry} onClose={onClose} />
    </div>
  )
}
