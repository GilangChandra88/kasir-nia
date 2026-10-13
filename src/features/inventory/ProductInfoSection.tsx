import { type Dispatch, useId } from 'react'

import { SectionCard } from '@/components/ui/SectionCard'
import { TextField } from '@/components/ui/TextField'
import type { ProductErrors } from '@/domain/product'
import type { DraftAction, ProductDraft } from '@/domain/productDraft'

type ProductInfoSectionProps = {
  draft: ProductDraft
  dispatch: Dispatch<DraftAction>
  errors: ProductErrors | null
  /** Kategori yang sudah dipakai barang lain, sebagai saran. */
  categories: string[]
}

export function ProductInfoSection({
  draft,
  dispatch,
  errors,
  categories,
}: ProductInfoSectionProps) {
  const categoryListId = useId()

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
          dispatch({ type: 'setText', field: 'barcode', value: event.target.value })
        }}
        error={errors?.barcode}
        hint="Ketik angka di bawah garis barcode, atau tembak dengan scanner."
      />
    </SectionCard>
  )
}
