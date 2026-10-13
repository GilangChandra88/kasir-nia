import { useState } from 'react'

import { type RecordedSale, recordSale } from '@/data/saleRepo'
import type { CartEntry } from '@/domain/cart'
import { changeDue } from '@/domain/payment'
import { useAsyncAction } from '@/features/shared/useAsyncAction'

type UsePaymentOptions = {
  storeId: string
  cashier: { uid: string; name: string }
  entries: CartEntry[]
  /** Rupiah, seperti yang terlihat di layar. */
  total: number
  onPaid: (sale: RecordedSale) => void
}

/** Isian uang diterima, kembalian, dan penyimpanan transaksi tunai. */
export function usePayment({ storeId, cashier, entries, total, onPaid }: UsePaymentOptions) {
  const [received, setReceived] = useState<number | null>(null)
  const result = changeDue(total, received)

  const { run, pending, error } = useAsyncAction(async (cashReceived: number) => {
    const sale = await recordSale({
      storeId,
      cashier,
      entries,
      cashReceived,
      expectedTotal: total,
    })
    onPaid(sale)
  })

  return {
    received,
    setReceived,
    result,
    canSubmit: result.status === 'ok',
    submit: () => {
      if (result.status === 'ok' && received !== null) void run(received)
    },
    pending,
    error,
  }
}
