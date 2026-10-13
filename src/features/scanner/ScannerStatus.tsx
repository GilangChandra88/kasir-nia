import { CameraOff } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

import type { ScannerState } from './useCameraScanner'

type ScannerStatusProps = {
  state: ScannerState
  onRetry: () => void
  onClose: () => void
}

/** Lapisan di atas video saat kamera sedang dibuka atau gagal. */
export function ScannerStatus({ state, onRetry, onClose }: ScannerStatusProps) {
  if (state.status === 'scanning') return null

  if (state.status === 'starting') {
    return (
      <div className="absolute inset-0 grid place-items-center text-white" role="status">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="size-8" />
          <p className="font-semibold">Membuka kamera…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 grid place-items-center bg-navy-950 p-6">
      <div role="alert" className="w-full max-w-sm rounded-3xl bg-card p-6 text-center">
        <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-danger/10 text-danger">
          <CameraOff className="size-7" aria-hidden="true" />
        </span>
        <p className="font-bold">Kamera tidak bisa dipakai</p>
        <p className="mt-1 text-sm text-muted">{state.message}</p>
        <div className="mt-6 flex flex-col gap-2">
          <Button fullWidth onClick={onRetry}>
            Coba lagi
          </Button>
          <Button variant="ghost" fullWidth onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  )
}
