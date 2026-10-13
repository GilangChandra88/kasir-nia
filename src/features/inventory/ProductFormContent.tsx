import { ButtonLink } from '@/components/ui/ButtonLink'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { ROUTES } from '@/config/routes'
import { collectCategories } from '@/domain/inventory'
import type { StoreInfo } from '@/domain/types'

import { DeactivateProductButton } from './DeactivateProductButton'
import { ProductForm } from './ProductForm'
import { StockCard } from './StockCard'
import type { ProductsState } from './useProducts'

type ProductFormContentProps = {
  store: StoreInfo
  products: ProductsState
  /** Undefined = tambah barang baru. */
  productId: string | undefined
}

export function ProductFormContent({ store, products, productId }: ProductFormContentProps) {
  if (products.status === 'loading') return <Skeleton className="h-64" />
  if (products.status === 'error') {
    return (
      <p role="alert" className="rounded-2xl bg-danger/10 p-4 text-sm text-danger">
        {products.message}
      </p>
    )
  }

  const categories = collectCategories(products.products)
  const product =
    productId === undefined ? null : products.products.find((item) => item.id === productId)

  if (product === undefined || product?.isActive === false) {
    return (
      <EmptyState
        title="Barang tidak ditemukan"
        description="Mungkin sudah dinonaktifkan atau alamatnya salah."
      >
        <ButtonLink to={ROUTES.inventory}>Kembali ke Stok</ButtonLink>
      </EmptyState>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {product && (
        <StockCard
          storeId={store.id}
          product={product}
          lowStockThreshold={store.lowStockThreshold}
        />
      )}
      {/* key: form diisi ulang hanya bila pindah barang, bukan saat stok berubah realtime. */}
      <ProductForm
        key={product?.id ?? 'baru'}
        storeId={store.id}
        product={product}
        categories={categories}
      />
      {product && <DeactivateProductButton storeId={store.id} product={product} />}
    </div>
  )
}
