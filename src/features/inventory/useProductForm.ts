import { useCallback, useReducer, useState } from 'react'
import { useNavigate } from 'react-router'

import { ROUTES } from '@/config/routes'
import { saveProduct } from '@/data/productRepo'
import { findProductByBarcode } from '@/domain/inventory'
import { normalizeBarcode, type ProductErrors, validateProductDraft } from '@/domain/product'
import { draftFromProduct, emptyDraft, productDraftReducer } from '@/domain/productDraft'
import type { Product, ProductInput } from '@/domain/types'
import { useAsyncAction } from '@/features/shared/useAsyncAction'
import { createId } from '@/lib/id'
import { useToastStore } from '@/store/toastStore'

type UseProductFormOptions = {
  storeId: string
  /** Null = tambah barang baru. */
  product: Product | null
  /** Semua barang toko, untuk mengecek barcode ganda sebelum menyimpan. */
  products: Product[]
  /** Barcode awal untuk barang baru (dari scan barcode yang belum terdaftar). */
  initialBarcode?: string
}

/** Status & aksi form barang: draf (reducer murni), validasi, dan penyimpanan. */
export function useProductForm({
  storeId,
  product,
  products,
  initialBarcode,
}: UseProductFormOptions) {
  const navigate = useNavigate()
  const showToast = useToastStore((state) => state.show)
  const productId = product?.id ?? null

  const [draft, dispatch] = useReducer(productDraftReducer, product, (initial) =>
    initial ? draftFromProduct(initial) : emptyDraft(createId(), initialBarcode),
  )
  const [submitted, setSubmitted] = useState(false)

  const validation = validateProductDraft(draft)
  // Barcode ganda langsung diberi tahu (mis. sesaat setelah scan), tidak menunggu tombol simpan.
  const owner = findProductByBarcode(products, normalizeBarcode(draft.barcode))
  const barcodeTaken = owner && owner.id !== productId ? `Sudah dipakai "${owner.name}".` : null
  // Galat lain baru ditampilkan setelah mencoba simpan, agar tidak "memarahi" saat baru mengetik.
  const errors: ProductErrors | null = submitted && !validation.ok ? validation.errors : null

  const save = useCallback(
    async (input: ProductInput, initialStock: number) => {
      await saveProduct({ storeId, input, productId, initialStock })
      showToast(productId ? 'Perubahan disimpan' : 'Barang ditambahkan 🎉')
      void navigate(ROUTES.inventory)
    },
    [storeId, productId, showToast, navigate],
  )
  const { run, pending, error } = useAsyncAction(save)

  /** Mengembalikan `false` bila isian belum valid (agar form bisa memfokuskan galat pertama). */
  const submit = (): boolean => {
    setSubmitted(true)
    if (!validation.ok || barcodeTaken) {
      showToast('Periksa isian yang ditandai merah.', 'error')
      return false
    }
    void run(validation.value, validation.initialStock)
    return true
  }

  return { draft, dispatch, errors, barcodeTaken, submit, pending, error }
}
