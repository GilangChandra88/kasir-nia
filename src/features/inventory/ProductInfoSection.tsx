import { ScanBarcode } from 'lucide-react'
import { type Dispatch, useId, useState } from 'react'

import { IconButton } from '@/components/ui/IconButton'
import { SectionCard } from '@/components/ui/SectionCard'
import { TextField } from '@/components/ui/TextField'
import type { ProductErrors } from '@/domain/product'
import type { DraftAction, ProductDraft } from '@/domain/productDraft'
import { BarcodeScanner } from '@/features/scanner/BarcodeScanner'
import { unlockAudio } from '@/lib/feedback'

type ProductInfoSectionProps = {
  draft: ProductDraft
  dispatch: Dispatch<DraftAction>
  errors: ProductErrors | null
  /** Pesan bila barcode sudah dipakai barang lain (ditampilkan langsung). */
  barcodeTaken: string | null
  /** Kategori yang sudah dipakai barang lain, sebagai saran. */
  categories: string[]
}

export function ProductInfoSection({
  draft,
  dispatch,
  errors,
  barcodeTaken,
  categories,
}: ProductInfoSectionProps) {
  const categoryListId = useId()
  const [scanning, setScanning] = useState(false)

  const setBarcode = (value: string) => {
    dispatch({ type: 'setText', field: 'barcode', value })
  }

  return (
    <SectionCard title="Info barang">
      <TextField
        label="Nama barang"
        placeholder="Contoh: Rokok Merk A"
        autoCapitalize="words"
        value={draft.name}
        onChange={(event) => {
          dispatch({ type: 'setText', field: 'name', value: event.target.value })
        }}
        error={errors?.name}
      />
      <TextField
        label="Kategori (opsional)"
        placeholder="Contoh: Rokok, Minuman"
        list={categoryListId}
        value={draft.category}
        onChange={(event) => {
          dispatch({ type: 'setText', field: 'category', value: event.target.value })
        }}
        error={errors?.category}
      />
      <datalist id={categoryListId}>
        {categories.map((category) => (
          <option key={category} value={category} />
        ))}
      </datalist>
      <TextField
        label="Barcode (opsional)"
        placeholder="Contoh: 8991234567890"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        value={draft.barcode}
        onChange={(event) => {
          setBarcode(event.target.value)
        }}
        // Scanner fisik mengirim Enter setelah kode; jangan sampai itu mengirim form.
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.preventDefault()
        }}
        error={errors?.barcode ?? barcodeTaken}
        hint="Ketuk ikon kamera untuk scan, atau tembak dengan scanner."
        action={
          <IconButton
            icon={ScanBarcode}
            label="Scan barcode dengan kamera"
            onClick={() => {
              unlockAudio()
              setScanning(true)
            }}
          />
        }
      />
      <BarcodeScanner
        open={scanning}
        title="Scan barcode barang"
        onDetect={setBarcode}
        onClose={() => {
          setScanning(false)
        }}
      />
    </SectionCard>
  )
}
