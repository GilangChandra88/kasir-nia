import { ScanBarcode } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { SearchField } from '@/components/ui/SearchField'
import { unlockAudio } from '@/lib/feedback'

import { BarcodeScanner } from './BarcodeScanner'

type ScanSearchBarProps = {
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  /** Dipanggil dengan kode hasil scan kamera. */
  onScan: (code: string) => void
  scannerTitle?: string
}

/** Kolom cari + tombol scan kamera di sebelahnya (dipakai di Stok dan Kasir). */
export function ScanSearchBar({
  value,
  onValueChange,
  placeholder,
  onScan,
  scannerTitle,
}: ScanSearchBarProps) {
  const [scanning, setScanning] = useState(false)

  return (
    <div className="flex gap-2">
      <div className="min-w-0 flex-1">
        <SearchField
          label="Cari barang"
          placeholder={placeholder}
          value={value}
          onValueChange={onValueChange}
        />
      </div>
      <Button
        aria-label="Scan barcode dengan kamera"
        title="Scan barcode"
        className="w-12 shrink-0 px-0"
        onClick={() => {
          unlockAudio()
          setScanning(true)
        }}
      >
        <ScanBarcode className="size-6" aria-hidden="true" />
      </Button>
      <BarcodeScanner
        open={scanning}
        title={scannerTitle}
        onDetect={onScan}
        onClose={() => {
          setScanning(false)
        }}
      />
    </div>
  )
}
