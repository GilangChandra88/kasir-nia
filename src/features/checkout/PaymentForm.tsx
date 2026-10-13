import { Banknote } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { NumberField } from '@/components/ui/NumberField'
import type { RecordedSale } from '@/data/saleRepo'
import type { CartEntry } from '@/domain/cart'
import { formatNumber, formatRupiah } from '@/domain/money'
import { quickCashOptions } from '@/domain/payment'
import { useIsOnline } from '@/lib/useConnectivity'

import { ChangeDisplay } from './ChangeDisplay'
import { usePayment } from './usePayment'

export type PaymentFormProps = {
  storeId: string
  cashier: { uid: string; name: string }
  entries: CartEntry[]
  total: number
  itemCount: number
  onPaid: (sale: RecordedSale) => void
}

/** Isi sheet pembayaran tunai. Dipasang ulang setiap sheet dibuka, jadi isian selalu bersih. */
export function PaymentForm(props: PaymentFormProps) {
  const { total, itemCount } = props
  const online = useIsOnline()
  const payment = usePayment(props)

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-navy-950 p-4 text-center text-white">
        <p className="text-sm text-white/70">Total belanja · {formatNumber(itemCount)} barang</p>
        <p className="text-3xl font-extrabold tabular-nums">{formatRupiah(total)}</p>
      </div>

      <NumberField
        label="Uang diterima"
        prefix="Rp"
        placeholder="0"
        value={payment.received}
        onValueChange={payment.setReceived}
      />
      <div className="flex flex-wrap gap-1.5">
        <Chip
          selected={payment.received === total}
          onClick={() => {
            payment.setReceived(total)
          }}
        >
          Uang pas
        </Chip>
        {quickCashOptions(total).map((amount) => (
          <Chip
            key={amount}
            selected={payment.received === amount}
            onClick={() => {
              payment.setReceived(amount)
            }}
          >
            {formatRupiah(amount)}
          </Chip>
        ))}
      </div>

      <ChangeDisplay result={payment.result} />

      <p role="alert" className="min-h-5 text-center text-sm text-danger">
        {online ? payment.error : 'Tidak ada internet. Transaksi belum bisa disimpan.'}
      </p>
      <Button
        size="lg"
        fullWidth
        loading={payment.pending}
        disabled={!online || !payment.canSubmit}
        onClick={payment.submit}
      >
        <Banknote className="size-5" aria-hidden="true" />
        Simpan transaksi
      </Button>
    </div>
  )
}
