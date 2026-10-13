import type { Dispatch } from 'react'

import { Chip } from '@/components/ui/Chip'
import { NumberField } from '@/components/ui/NumberField'
import { SectionCard } from '@/components/ui/SectionCard'
import { Switch } from '@/components/ui/Switch'
import { TextField } from '@/components/ui/TextField'
import type { ProductErrors } from '@/domain/product'
import type { DraftAction, ProductDraft } from '@/domain/productDraft'

/** Satuan dasar yang sering dipakai warung, sebagai pilihan cepat. */
const UNIT_SUGGESTIONS = ['pcs', 'batang', 'bungkus', 'botol', 'sachet', 'kg', 'liter'] as const

type UnitStockSectionProps = {
  draft: ProductDraft
  dispatch: Dispatch<DraftAction>
  errors: ProductErrors | null
  /** Stok awal hanya diisi saat barang baru; stok barang lama diubah lewat "Atur stok". */
  isNew: boolean
}

export function UnitStockSection({ draft, dispatch, errors, isNew }: UnitStockSectionProps) {
  const setUnit = (value: string) => {
    dispatch({ type: 'setText', field: 'baseUnit', value })
  }

  return (
    <SectionCard
      title="Satuan & stok"
      description="Satuan dasar = satuan terkecil yang dijual. Stok dihitung dalam satuan ini."
    >
      <div>
        <TextField
          label="Satuan dasar"
          value={draft.baseUnit}
          onChange={(event) => {
            setUnit(event.target.value)
          }}
          error={errors?.baseUnit}
        />
        <div className="-mx-1 mt-2 flex flex-wrap gap-1.5 px-1">
          {UNIT_SUGGESTIONS.map((unit) => (
            <Chip
              key={unit}
              selected={draft.baseUnit.trim() === unit}
              onClick={() => {
                setUnit(unit)
              }}
            >
              {unit}
            </Chip>
          ))}
        </div>
      </div>

      <Switch
        checked={draft.trackStock}
        onChange={(value) => {
          dispatch({ type: 'setTrackStock', value })
        }}
        label="Hitung stok"
        description="Matikan untuk barang tanpa stok, mis. jasa atau isi ulang."
      />

      {isNew && draft.trackStock && (
        <NumberField
          label="Stok awal"
          placeholder="0"
          suffix={draft.baseUnit.trim() || undefined}
          value={draft.initialStock}
          onValueChange={(value) => {
            dispatch({ type: 'setInitialStock', value })
          }}
          error={errors?.initialStock}
          hint="Boleh dikosongkan, bisa ditambah nanti."
        />
      )}
    </SectionCard>
  )
}
