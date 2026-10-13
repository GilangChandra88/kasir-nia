import { Chip } from '@/components/ui/Chip'
import { formatNumber } from '@/domain/money'
import type { StockUnitOption } from '@/domain/stockAdjustment'

type StockUnitPickerProps = {
  units: StockUnitOption[]
  selectedId: string | undefined
  onSelect: (id: string) => void
}

/** Pilihan satuan stok masuk, mis. "batang" atau "1 bungkus (20)". */
export function StockUnitPicker({ units, selectedId, onSelect }: StockUnitPickerProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {units.map((option) => (
        <Chip
          key={option.id}
          selected={option.id === selectedId}
          onClick={() => {
            onSelect(option.id)
          }}
        >
          {option.perUnit > 1 ? `${option.label} (${formatNumber(option.perUnit)})` : option.label}
        </Chip>
      ))}
    </div>
  )
}
