import { TriangleAlert } from 'lucide-react'

import { QtyStepper } from '@/components/ui/QtyStepper'
import type { CartLine } from '@/domain/cart'
import { formatNumber, formatRupiah } from '@/domain/money'

type CartLineRowProps = {
  line: CartLine
  /** Sisa stok barang ini bila keranjang melebihinya (satuan dasar), atau undefined. */
  shortageStock: number | undefined
  onQtyChange: (qty: number) => void
}

export function CartLineRow({ line, shortageStock, onQtyChange }: CartLineRowProps) {
  const { product, variant, qty, lineTotal } = line

  return (
    <div className="py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-bold">{product.name}</p>
          <p className="text-sm text-muted">
            {variant.label} · {formatRupiah(variant.price)}
          </p>
        </div>
        <QtyStepper
          value={qty}
          onChange={onQtyChange}
          itemLabel={`${product.name} ${variant.label}`}
        />
      </div>
      <div className="mt-1 flex items-center justify-between gap-3">
        {shortageStock === undefined ? (
          <span />
        ) : (
          <span className="flex items-center gap-1 text-sm font-semibold text-danger">
            <TriangleAlert className="size-4" aria-hidden="true" />
            Stok tinggal {formatNumber(shortageStock)} {product.baseUnit}
          </span>
        )}
        <span className="font-bold tabular-nums">{formatRupiah(lineTotal)}</span>
      </div>
    </div>
  )
}
