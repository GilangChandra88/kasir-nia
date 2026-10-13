import { PackagePlus, PencilLine } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { stockBreakdown, stockStatus } from '@/domain/inventory'
import { formatNumber } from '@/domain/money'
import type { Product } from '@/domain/types'

import { type AdjustMode, StockAdjustSheet } from './StockAdjustSheet'
import { StockPill } from './StockPill'

type StockCardProps = {
  storeId: string
  product: Product
  lowStockThreshold: number
}

/** Stok terkini (realtime) + tombol stok masuk & koreksi. */
export function StockCard({ storeId, product, lowStockThreshold }: StockCardProps) {
  const [mode, setMode] = useState<AdjustMode>('add')
  const [open, setOpen] = useState(false)

  if (!product.trackStock) {
    return (
      <Card className="text-sm text-muted">
        Stok barang ini tidak dihitung. Nyalakan “Hitung stok” di bawah bila perlu.
      </Card>
    )
  }

  const openSheet = (next: AdjustMode) => {
    setMode(next)
    setOpen(true)
  }
  const breakdown = stockBreakdown(product)

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-muted">Stok sekarang</p>
          <p className="text-3xl font-extrabold tabular-nums">
            {formatNumber(product.stock)}{' '}
            <span className="text-base font-semibold text-muted">{product.baseUnit}</span>
          </p>
          {breakdown && <p className="text-sm text-muted">≈ {breakdown}</p>}
        </div>
        <StockPill product={product} status={stockStatus(product, lowStockThreshold)} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          size="sm"
          onClick={() => {
            openSheet('add')
          }}
        >
          <PackagePlus className="size-4" aria-hidden="true" />
          Stok masuk
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            openSheet('set')
          }}
        >
          <PencilLine className="size-4" aria-hidden="true" />
          Koreksi
        </Button>
      </div>
      <StockAdjustSheet
        storeId={storeId}
        product={product}
        mode={mode}
        onModeChange={setMode}
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      />
    </Card>
  )
}
