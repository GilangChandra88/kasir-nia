import { X } from 'lucide-react'

import { IconButton } from '@/components/ui/IconButton'
import type { CameraControls } from '@/lib/cameraControls'

import { TorchButton } from './TorchButton'
import { ZoomButton } from './ZoomButton'

type ScannerHeaderProps = {
  title: string
  controls: CameraControls | null
  onClose: () => void
}

/** Bilah atas scanner: tutup, judul, zoom & senter (bila HP mendukung). */
export function ScannerHeader({ title, controls, onClose }: ScannerHeaderProps) {
  return (
    <header className="absolute inset-x-0 top-0 flex items-center gap-3 p-4 pt-[max(env(safe-area-inset-top),1rem)] text-white">
      <IconButton icon={X} label="Tutup scanner" tone="light" onClick={onClose} />
      <h2 className="min-w-0 flex-1 truncate text-base font-bold">{title}</h2>
      {controls?.zoom && <ZoomButton zoom={controls.zoom} />}
      {controls?.torch && <TorchButton torch={controls.torch} />}
    </header>
  )
}
