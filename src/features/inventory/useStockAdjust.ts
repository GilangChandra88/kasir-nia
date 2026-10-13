import { useState } from 'react'

import { adjustStock } from '@/data/productRepo'
import {
  applyStockAdjustment,
  BASE_UNIT_OPTION_ID,
  buildAdjustment,
  type StockAdjustment,
  stockUnitOptions,
} from '@/domain/stockAdjustment'
import type { Product } from '@/domain/types'
import { useAsyncAction } from '@/features/shared/useAsyncAction'
import { useToastStore } from '@/store/toastStore'

type UseStockAdjustOptions = {
  storeId: string
  product: Product
  mode: StockAdjustment['mode']
  onDone: () => void
}

/** Isian & penyimpanan sheet "Atur stok": satuan, jumlah, pratinjau stok baru. */
export function useStockAdjust({ storeId, product, mode, onDone }: UseStockAdjustOptions) {
  const showToast = useToastStore((state) => state.show)
  const units = stockUnitOptions(product)
  const [unitId, setUnitId] = useState(BASE_UNIT_OPTION_ID)
  const [quantity, setQuantity] = useState<number | null>(null)

  const unit = units.find((option) => option.id === unitId) ?? units[0]
  const adjustment = buildAdjustment(mode, quantity, unit?.perUnit ?? 1)
  const preview = adjustment ? applyStockAdjustment(product.stock, adjustment) : null

  const { run, pending, error } = useAsyncAction(async (value: StockAdjustment) => {
    await adjustStock(storeId, product.id, value)
    showToast('Stok diperbarui')
    setQuantity(null)
    onDone()
  })

  return {
    units,
    unit,
    setUnitId,
    quantity,
    setQuantity,
    /** Satuan di kanan isian jumlah. */
    suffix: mode === 'add' ? unit?.label : product.baseUnit,
    /** Stok baru bila isian valid. */
    nextStock: preview?.ok ? preview.stock : null,
    fieldError: preview?.ok === false ? preview.message : null,
    /** Simpan bila isian valid; tidak melakukan apa pun bila belum. */
    submit: () => {
      if (adjustment && preview?.ok) void run(adjustment)
    },
    canSubmit: preview?.ok === true,
    pending,
    error,
  }
}
