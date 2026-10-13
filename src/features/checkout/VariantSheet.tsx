import * as m from 'motion/react-m'

import { Sheet } from '@/components/ui/Sheet'
import { STAGGER_SECONDS } from '@/config/motion'
import { type CartEntry, remainingStock } from '@/domain/cart'
import { formatNumber } from '@/domain/money'
import type { Product, Variant } from '@/domain/types'

import { VariantOption } from './VariantOption'

type VariantSheetProps = {
  /** Null = tertutup. */
  product: Product | null
  entries: CartEntry[]
  onPick: (product: Product, variant: Variant) => void
  onClose: () => void
}

/** Bottom sheet "pilih jenis" setelah barang berjenis banyak di-scan atau diketuk. */
export function VariantSheet({ product, entries, onPick, onClose }: VariantSheetProps) {
  const remaining = product ? remainingStock(product, entries) : 0
  const stockNote =
    product && Number.isFinite(remaining)
      ? `Sisa stok ${formatNumber(remaining)} ${product.baseUnit}`
      : 'Pilih jenis yang dibeli'

  return (
    <Sheet
      open={product !== null}
      onClose={onClose}
      title={product?.name ?? ''}
      description={stockNote}
    >
      {product && (
        <ul className="flex flex-col gap-2">
          {product.variants.map((variant, index) => (
            <m.li
              key={variant.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * STAGGER_SECONDS }}
            >
              <VariantOption
                variant={variant}
                baseUnit={product.baseUnit}
                available={remaining >= variant.baseQty}
                onPick={() => {
                  onPick(product, variant)
                }}
              />
            </m.li>
          ))}
        </ul>
      )}
    </Sheet>
  )
}
