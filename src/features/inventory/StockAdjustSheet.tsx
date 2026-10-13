import { Button } from '@/components/ui/Button'
import { NumberField } from '@/components/ui/NumberField'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Sheet } from '@/components/ui/Sheet'
import type { StockAdjustment } from '@/domain/stockAdjustment'
import type { Product } from '@/domain/types'
import { useIsOnline } from '@/lib/useConnectivity'

import { StockPreview } from './StockPreview'
import { StockUnitPicker } from './StockUnitPicker'
import { useStockAdjust } from './useStockAdjust'

export type AdjustMode = StockAdjustment['mode']

const MODES = [
  { value: 'add', label: 'Stok masuk' },
  { value: 'set', label: 'Koreksi' },
] as const

const FIELD_COPY: Record<AdjustMode, { label: string; hint?: string }> = {
  add: { label: 'Jumlah masuk' },
  set: { label: 'Jumlah sebenarnya', hint: 'Isi dengan hasil hitung barang di rak.' },
}

type StockAdjustSheetProps = {
  storeId: string
  product: Product
  mode: AdjustMode
  onModeChange: (mode: AdjustMode) => void
  open: boolean
  onClose: () => void
}

export function StockAdjustSheet(props: StockAdjustSheetProps) {
  const { storeId, product, mode, onModeChange, open, onClose } = props
  const online = useIsOnline()
  const form = useStockAdjust({ storeId, product, mode, onDone: onClose })
  const showUnits = mode === 'add' && form.units.length > 1

  return (
    <Sheet open={open} onClose={onClose} title={`Atur stok ${product.name}`}>
      <div className="flex flex-col gap-4">
        <SegmentedControl
          label="Jenis perubahan"
          segments={MODES}
          value={mode}
          onChange={onModeChange}
        />

        {showUnits && (
          <StockUnitPicker
            units={form.units}
            selectedId={form.unit?.id}
            onSelect={form.setUnitId}
          />
        )}

        <NumberField
          label={FIELD_COPY[mode].label}
          placeholder="0"
          suffix={form.suffix}
          value={form.quantity}
          onValueChange={form.setQuantity}
          error={form.fieldError}
          hint={FIELD_COPY[mode].hint}
        />

        <StockPreview current={product.stock} next={form.nextStock} unit={product.baseUnit} />

        <p role="alert" className="min-h-5 text-center text-sm text-danger">
          {online ? form.error : 'Butuh internet untuk mengubah stok.'}
        </p>
        <Button
          size="lg"
          fullWidth
          loading={form.pending}
          disabled={!online || !form.canSubmit}
          onClick={form.submit}
        >
          Simpan stok
        </Button>
      </div>
    </Sheet>
  )
}
