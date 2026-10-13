import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { formatNumber, formatRupiah } from '@/domain/money'

type CheckoutBarProps = {
  total: number
  itemCount: number
  /** Alasan tombol bayar dikunci (offline, stok kurang), atau null. */
  blockedReason: string | null
  onPay: () => void
}

/** Bilah total menempel di atas navbar: angka besar + tombol Bayar dalam jangkauan jempol. */
export function CheckoutBar({ total, itemCount, blockedReason, onPay }: CheckoutBarProps) {
  return (
    <div className="sticky bottom-above-nav z-20">
      {blockedReason && (
        <p
          role="alert"
          className="mb-2 rounded-2xl bg-warning/15 px-4 py-2 text-center text-sm font-semibold"
        >
          {blockedReason}
        </p>
      )}
      <div className="flex items-center gap-3 rounded-3xl bg-navy-950 p-2 pl-5 text-white shadow-lift">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-white/70">Total · {formatNumber(itemCount)} barang</p>
          <p key={total} className="animate-pop truncate text-2xl font-extrabold tabular-nums">
            {formatRupiah(total)}
          </p>
        </div>
        <Button variant="inverse" size="lg" disabled={blockedReason !== null} onClick={onPay}>
          Bayar
          <ArrowRight className="size-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
