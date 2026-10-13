import { useEffect, useState } from 'react'

import { describeError } from '@/data/errors'
import { watchProducts } from '@/data/productRepo'
import type { Product } from '@/domain/types'

export type ProductsState =
  | { status: 'loading' }
  | { status: 'ready'; products: Product[] }
  | { status: 'error'; message: string }

const LOADING: ProductsState = { status: 'loading' }

/** Daftar barang toko secara realtime (dari cache dulu, lalu server). */
export function useProducts(storeId: string): ProductsState {
  const [state, setState] = useState<{ storeId: string; value: ProductsState }>(() => ({
    storeId,
    value: LOADING,
  }))

  useEffect(
    () =>
      watchProducts(
        storeId,
        (products) => {
          setState({ storeId, value: { status: 'ready', products } })
        },
        (error) => {
          setState({ storeId, value: { status: 'error', message: describeError(error) } })
        },
      ),
    [storeId],
  )

  // Hasil milik toko lain (setelah ganti akun) dianggap belum dimuat.
  return state.storeId === storeId ? state.value : LOADING
}
