import { Plus } from 'lucide-react'

import { PageHeader } from '@/components/layout/PageHeader'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { EmptyState } from '@/components/ui/EmptyState'
import { ROUTES } from '@/config/routes'
import { can } from '@/domain/permissions'
import { useReadySession } from '@/features/auth/useReadySession'

import { InventoryList } from './InventoryList'
import { ProductListSkeleton } from './ProductListSkeleton'
import { useProducts } from './useProducts'

export function InventoryScreen() {
  const { profile, store } = useReadySession()
  const products = useProducts(store.id)
  const canManage = can(profile.role, 'manageInventory')

  const activeCount =
    products.status === 'ready' ? products.products.filter((product) => product.isActive).length : 0

  const addButton = canManage && (
    <ButtonLink to={ROUTES.inventoryNew} size="sm">
      <Plus className="size-4" aria-hidden="true" />
      Tambah
    </ButtonLink>
  )

  return (
    <>
      <PageHeader
        title="Stok Barang"
        subtitle={products.status === 'ready' ? `${activeCount} barang aktif` : 'Barang & jenisnya'}
        action={activeCount > 0 ? addButton : undefined}
      />

      {products.status === 'loading' && <ProductListSkeleton />}

      {products.status === 'error' && (
        <p role="alert" className="rounded-2xl bg-danger/10 p-4 text-sm text-danger">
          {products.message}
        </p>
      )}

      {products.status === 'ready' && activeCount === 0 && (
        <EmptyState
          title="Belum ada barang"
          description={
            canManage
              ? 'Tambahkan barang pertama beserta jenisnya, mis. rokok per bungkus & per batang.'
              : 'Pemilik toko belum menambahkan barang.'
          }
        >
          {addButton}
        </EmptyState>
      )}

      {products.status === 'ready' && activeCount > 0 && (
        <InventoryList
          products={products.products}
          lowStockThreshold={store.lowStockThreshold}
          editable={canManage}
        />
      )}
    </>
  )
}
