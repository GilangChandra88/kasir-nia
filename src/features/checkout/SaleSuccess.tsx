import { Plus } from 'lucide-react'
import * as m from 'motion/react-m'

import { SuccessCheck } from '@/components/brand/SuccessCheck'
import { Confetti } from '@/components/motion/Confetti'
import { fadeUpItem, staggerContainer } from '@/components/motion/variants'
import { Button } from '@/components/ui/Button'
import type { RecordedSale } from '@/data/saleRepo'
import { formatRupiah } from '@/domain/money'

type SaleSuccessProps = {
  sale: RecordedSale
  onDone: () => void
}

/** Layar penuh setelah transaksi tersimpan. Kembalian ditampilkan paling besar untuk kasir. */
export function SaleSuccess({ sale, onDone }: SaleSuccessProps) {
  return (
    <m.div
      role="dialog"
      aria-modal="true"
      aria-label="Transaksi berhasil"
      className="fixed inset-0 z-[65] flex flex-col bg-paper px-6 pt-[max(env(safe-area-inset-top),2rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <m.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center text-center"
      >
        <div className="relative grid place-items-center">
          <Confetti />
          <SuccessCheck />
        </div>
        <m.h2 variants={fadeUpItem} className="mt-4 text-2xl font-extrabold">
          Transaksi berhasil!
        </m.h2>
        <m.p variants={fadeUpItem} className="text-sm text-muted">
          No. {sale.receiptNo}
        </m.p>

        <m.div variants={fadeUpItem} className="mt-6 w-full rounded-3xl bg-card p-5 shadow-soft">
          <p className="text-sm font-semibold text-muted">Kembalian</p>
          <p className="text-4xl font-extrabold text-success tabular-nums">
            {sale.change > 0 ? formatRupiah(sale.change) : 'Uang pas 👍'}
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-line pt-4 text-sm">
            <dt className="text-left text-muted">Total</dt>
            <dd className="text-right font-semibold tabular-nums">{formatRupiah(sale.total)}</dd>
            <dt className="text-left text-muted">Tunai</dt>
            <dd className="text-right font-semibold tabular-nums">
              {formatRupiah(sale.cashReceived)}
            </dd>
          </dl>
        </m.div>
      </m.div>

      <Button size="lg" fullWidth className="mx-auto max-w-sm" onClick={onDone} autoFocus>
        <Plus className="size-5" aria-hidden="true" />
        Transaksi baru
      </Button>
    </m.div>
  )
}
