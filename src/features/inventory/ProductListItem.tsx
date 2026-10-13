import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'

import { productEditPath } from '@/config/routes'
import { priceRange, stockBreakdown, stockStatus } from '@/domain/inventory'
import { formatRupiah } from '@/domain/money'
import type { Product } from '@/domain/types'

import { StockPill } from './StockPill'

type ProductListItemProps = {
  product: Product
  lowStockThreshold: number
  /** Pemilik bisa membuka form ubah; kasir hanya melihat. */
  editable: boolean
}

function priceText(product: Product): string {
  const { min, max } = priceRange(product.variants)
  return min === max ? formatRupiah(min) : `${formatRupiah(min)} – ${formatRupiah(max)}`
}

export function ProductListItem({ product, lowStockThreshold, editable }: ProductListItemProps) {
  const status = stockStatus(product, lowStockThreshold)
  const breakdown = stockBreakdown(product)
  const details = [product.category, `${product.variants.length} jenis`].filter(Boolean).join(' · ')

  const content = (
    <>
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-navy-50 text-lg font-bold text-navy-600">
        {product.name.charAt(0).toUpperCase()}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="truncate font-bold">{product.name}</span>
          <StockPill product={product} status={status} />
        </span>
        <span className="block truncate text-sm text-muted">{details}</span>
        <span className="block truncate text-sm font-semibold text-navy-800 tabular-nums">
          {priceText(product)}
        </span>
        {breakdown && <span className="block truncate text-xs text-muted">≈ {breakdown}</span>}
      </span>
      {editable && <ChevronRight className="size-5 shrink-0 text-muted" aria-hidden="true" />}
    </>
  )

  const className = 'flex items-center gap-3 rounded-3xl bg-card p-3 pr-2 shadow-soft'

  return editable ? (
    <Link
      to={productEditPath(product.id)}
      className={`${className} transition-transform active:scale-[0.98]`}
    >
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  )
}
