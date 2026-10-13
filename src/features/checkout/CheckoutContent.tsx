import { ButtonLink } from '@/components/ui/ButtonLink'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { ROUTES } from '@/config/routes'
import type { CartEntry } from '@/domain/cart'
import type { Product } from '@/domain/types'
import type { ProductsState } from '@/features/inventory/useProducts'

import { ProductPicker } from './ProductPicker'

type CheckoutContentProps = {
  products: ProductsState
  entries: CartEntry[]
  searchText: string
  lowStockThreshold: number
  canManageInventory: boolean
  onPick: (product: Product) => void
}

/** Bagian pilihan barang Kasir beserta status memuat, galat, dan toko tanpa barang. */
export function CheckoutContent(props: CheckoutContentProps) {
  const { products, canManageInventory } = props

  if (products.status === 'loading') {
    return (
      <div className="grid grid-cols-2 gap-2" role="status" aria-label="Memuat barang">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-24" />
        ))}
      </div>
    )
  }
  if (products.status === 'error') {
    return (
      <p role="alert" className="rounded-2xl bg-danger/10 p-4 text-sm text-danger">
        {products.message}
      </p>
    )
  }
  if (!products.products.some((product) => product.isActive)) {
    return (
      <EmptyState
        title="Belum ada barang untuk dijual"
        description={
          canManageInventory
            ? 'Tambahkan barang dulu di menu Stok, lalu kembali ke sini.'
            : 'Minta pemilik toko menambahkan barang dulu.'
        }
      >
        {canManageInventory && <ButtonLink to={ROUTES.inventoryNew}>Tambah barang</ButtonLink>}
      </EmptyState>
    )
  }

  return (
    <ProductPicker
      products={products.products}
      entries={props.entries}
      searchText={props.searchText}
      lowStockThreshold={props.lowStockThreshold}
      onPick={props.onPick}
    />
  )
}
