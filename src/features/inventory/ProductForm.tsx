import { Save } from 'lucide-react'
import { useRef } from 'react'

import { Button } from '@/components/ui/Button'
import { collectCategories } from '@/domain/inventory'
import type { Product } from '@/domain/types'
import { useIsOnline } from '@/lib/useConnectivity'

import { ProductInfoSection } from './ProductInfoSection'
import { UnitStockSection } from './UnitStockSection'
import { useProductForm } from './useProductForm'
import { VariantEditor } from './VariantEditor'

type ProductFormProps = {
  storeId: string
  /** Null = tambah barang baru. */
  product: Product | null
  /** Semua barang toko: saran kategori & cek barcode ganda. */
  products: Product[]
  initialBarcode?: string
}

export function ProductForm({ storeId, product, products, initialBarcode }: ProductFormProps) {
  const { draft, dispatch, errors, barcodeTaken, submit, pending, error } = useProductForm({
    storeId,
    product,
    products,
    initialBarcode,
  })
  const online = useIsOnline()
  const isNew = product === null
  const formRef = useRef<HTMLFormElement>(null)

  // Galat baru tampil setelah render berikutnya, jadi fokus dipindah pada frame setelahnya.
  const focusFirstError = () => {
    requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus()
    })
  }

  return (
    <form
      ref={formRef}
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        if (!submit()) focusFirstError()
      }}
    >
      <ProductInfoSection
        draft={draft}
        dispatch={dispatch}
        errors={errors}
        barcodeTaken={barcodeTaken}
        categories={collectCategories(products)}
      />
      <UnitStockSection draft={draft} dispatch={dispatch} errors={errors} isNew={isNew} />
      <VariantEditor draft={draft} dispatch={dispatch} errors={errors} isNew={isNew} />

      {/* Tombol simpan menempel di atas navbar agar selalu terjangkau jempol. */}
      <div className="sticky bottom-above-nav z-20 -mx-1 rounded-3xl bg-paper/90 p-1 backdrop-blur">
        {(error ?? !online) && (
          <p role="alert" className="px-2 pb-2 text-center text-sm text-danger">
            {online ? error : 'Butuh internet untuk menyimpan barang.'}
          </p>
        )}
        <Button type="submit" size="lg" fullWidth loading={pending} disabled={!online}>
          <Save className="size-5" aria-hidden="true" />
          {isNew ? 'Simpan barang' : 'Simpan perubahan'}
        </Button>
      </div>
    </form>
  )
}
