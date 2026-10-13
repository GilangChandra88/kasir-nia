import { Trash2 } from 'lucide-react'
import type { Dispatch } from 'react'

import { IconButton } from '@/components/ui/IconButton'
import { NumberField } from '@/components/ui/NumberField'
import { TextField } from '@/components/ui/TextField'
import { formatRupiah } from '@/domain/money'
import type { VariantErrors } from '@/domain/product'
import type { DraftAction, VariantDraft } from '@/domain/productDraft'

type VariantRowProps = {
  variant: VariantDraft
  index: number
  baseUnit: string
  dispatch: Dispatch<DraftAction>
  errors: VariantErrors | undefined
  canRemove: boolean
}

/** Harga per satuan dasar membantu membandingkan, mis. bungkus Rp30.000 isi 20 ≈ Rp1.500/batang. */
function unitPriceHint(variant: VariantDraft, baseUnit: string): string | undefined {
  if (variant.price === null || variant.baseQty === null || variant.baseQty <= 1) return undefined
  return `≈ ${formatRupiah(Math.round(variant.price / variant.baseQty))} per ${baseUnit}`
}

export function VariantRow({
  variant,
  index,
  baseUnit,
  dispatch,
  errors,
  canRemove,
}: VariantRowProps) {
  const update = (patch: Partial<Omit<VariantDraft, 'id'>>) => {
    dispatch({ type: 'updateVariant', id: variant.id, patch })
  }

  return (
    <div className="rounded-2xl border border-line bg-paper p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold tracking-wide text-muted uppercase">
          Jenis {index + 1}
        </span>
        {canRemove && (
          <IconButton
            icon={Trash2}
            label={`Hapus jenis ${variant.label || index + 1}`}
            tone="danger"
            onClick={() => {
              dispatch({ type: 'removeVariant', id: variant.id })
            }}
          />
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextField
          className="col-span-2"
          label="Nama jenis"
          placeholder="Contoh: 1 bungkus"
          value={variant.label}
          onChange={(event) => {
            update({ label: event.target.value })
          }}
          error={errors?.label}
        />
        <NumberField
          label="Harga"
          prefix="Rp"
          placeholder="0"
          value={variant.price}
          onValueChange={(price) => {
            update({ price })
          }}
          error={errors?.price}
          hint={unitPriceHint(variant, baseUnit)}
        />
        <NumberField
          label="Isi"
          suffix={baseUnit}
          placeholder="1"
          value={variant.baseQty}
          onValueChange={(baseQty) => {
            update({ baseQty })
          }}
          error={errors?.baseQty}
        />
      </div>
    </div>
  )
}
