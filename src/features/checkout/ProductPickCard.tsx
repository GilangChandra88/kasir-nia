import * as m from 'motion/react-m'

import { PRESS_SCALE, SPRING } from '@/config/motion'
import { priceRange } from '@/domain/inventory'
import { formatNumber, formatRupiah } from '@/domain/money'
import type { Product } from '@/domain/types'
import { cn } from '@/lib/cn'

type ProductPickCardProps = {
  product: Product
  /** Sisa stok setelah dikurangi isi keranjang (satuan dasar); Infinity bila tak dihitung. */
  remaining: number
  /** Jumlah jenis barang ini yang sudah di keranjang. */
  inCart: number
  onPick: () => void
}

export function ProductPickCard({ product, remaining, inCart, onPick }: ProductPickCardProps) {
  const { min } = priceRange(product.variants)
  const soldOut = remaining < Math.min(...product.variants.map((variant) => variant.baseQty))
  const priceLabel = product.variants.length > 1 ? `mulai ${formatRupiah(min)}` : formatRupiah(min)

  return (
    <m.button
      type="button"
      onClick={onPick}
      whileTap={{ scale: PRESS_SCALE }}
      transition={SPRING.bouncy}
      className={cn(
        'relative flex h-full min-h-24 w-full flex-col justify-between rounded-2xl bg-card p-3 text-left shadow-soft',
        soldOut && 'opacity-60',
      )}
    >
      {inCart > 0 && (
        <span
          key={inCart}
          className="absolute -top-1.5 -right-1.5 grid size-6 animate-pop place-items-center rounded-full bg-navy-950 text-xs font-bold text-white tabular-nums"
        >
          {inCart}
        </span>
      )}
      <span className="line-clamp-2 font-semibold">{product.name}</span>
      <span className="mt-2 block">
        <span className="block text-sm font-bold text-navy-800 tabular-nums">{priceLabel}</span>
        <span className={cn('block text-xs', soldOut ? 'font-semibold text-danger' : 'text-muted')}>
          {soldOut
            ? 'Habis'
            : Number.isFinite(remaining)
              ? `Sisa ${formatNumber(remaining)} ${product.baseUnit}`
              : 'Selalu tersedia'}
        </span>
      </span>
    </m.button>
  )
}
