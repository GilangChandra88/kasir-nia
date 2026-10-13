import { QUICK_PICK_LIMIT } from '@/config/limits'
import { type CartEntry, remainingStock } from '@/domain/cart'
import { filterProducts } from '@/domain/inventory'
import type { Product } from '@/domain/types'

import { ProductPickCard } from './ProductPickCard'

type ProductPickerProps = {
  products: Product[]
  entries: CartEntry[]
  searchText: string
  lowStockThreshold: number
  onPick: (product: Product) => void
}

/** Grid barang untuk diketuk. Tanpa pencarian, tampil pilihan cepat A–Z. */
export function ProductPicker({
  products,
  entries,
  searchText,
  lowStockThreshold,
  onPick,
}: ProductPickerProps) {
  const searching = searchText.trim() !== ''
  const matches = filterProducts(products, {
    text: searchText,
    filter: 'all',
    threshold: lowStockThreshold,
  })
  const shown = searching ? matches : matches.slice(0, QUICK_PICK_LIMIT)

  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-muted">
        {searching ? `Hasil pencarian (${shown.length})` : 'Pilih barang'}
      </h2>
      {shown.length === 0 ? (
        <p className="rounded-2xl bg-card p-6 text-center text-sm text-muted shadow-soft">
          Barang tidak ditemukan. Coba kata lain atau scan barcodenya.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {shown.map((product) => (
            <li key={product.id}>
              <ProductPickCard
                product={product}
                remaining={remainingStock(product, entries)}
                inCart={entries
                  .filter((entry) => entry.productId === product.id)
                  .reduce((sum, entry) => sum + entry.qty, 0)}
                onPick={() => {
                  onPick(product)
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
