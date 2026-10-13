import { Navigate, useParams, useSearchParams } from 'react-router'

import { PageHeader } from '@/components/layout/PageHeader'
import { ROUTES } from '@/config/routes'
import { can } from '@/domain/permissions'
import { useReadySession } from '@/features/auth/useReadySession'

import { ProductFormContent } from './ProductFormContent'
import { useProducts } from './useProducts'

/** Halaman tambah (`/stok/baru`) dan ubah (`/stok/:productId`) barang. Khusus pemilik. */
export function ProductFormScreen() {
  const { productId } = useParams()
  const [searchParams] = useSearchParams()
  const { profile, store } = useReadySession()
  const products = useProducts(store.id)

  if (!can(profile.role, 'manageInventory')) return <Navigate to={ROUTES.inventory} replace />

  return (
    <>
      <PageHeader
        title={productId === undefined ? 'Tambah barang' : 'Ubah barang'}
        subtitle="Stok Barang"
        backTo={ROUTES.inventory}
      />
      <ProductFormContent
        store={store}
        products={products}
        productId={productId}
        initialBarcode={searchParams.get('barcode') ?? undefined}
      />
    </>
  )
}
