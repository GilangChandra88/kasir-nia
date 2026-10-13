import { ZigzagEdge } from '@/components/brand/ZigzagEdge'
import { formatNumber, formatRupiah } from '@/domain/money'
import type { ReceiptModel } from '@/domain/receipt'

import { ReceiptDivider } from './ReceiptDivider'
import { ReceiptRow } from './ReceiptRow'

type ReceiptPaperProps = {
  receipt: ReceiptModel
}

/** Struk bergaya kertas thermal: huruf monospace, garis putus-putus, tepi bawah bergerigi. */
export function ReceiptPaper({ receipt }: ReceiptPaperProps) {
  return (
    <div className="mx-auto w-full max-w-xs drop-shadow-md">
      <article
        aria-label={`Struk ${receipt.receiptNo}`}
        className="rounded-t-xl bg-white px-5 pt-6 pb-4 font-mono text-[0.8125rem] leading-relaxed text-navy-950"
      >
        <header className="text-center">
          <p className="text-base font-extrabold tracking-wide uppercase">{receipt.storeName}</p>
          {receipt.headerLines.map((line) => (
            <p key={line} className="text-xs text-muted">
              {line}
            </p>
          ))}
        </header>
        <ReceiptDivider />
        <ReceiptRow label="No" value={receipt.receiptNo} />
        <ReceiptRow label="Waktu" value={receipt.dateText} />
        {receipt.cashierName && <ReceiptRow label="Kasir" value={receipt.cashierName} />}
        <ReceiptDivider />
        <ul className="flex flex-col gap-2">
          {receipt.lines.map((line, index) => (
            <li key={`${line.name}-${index}`}>
              <p className="font-semibold">{line.name}</p>
              <ReceiptRow
                label={<span className="text-muted">{line.detail}</span>}
                value={formatNumber(line.amount)}
              />
            </li>
          ))}
        </ul>
        <ReceiptDivider />
        <ReceiptRow
          label={`TOTAL (${formatNumber(receipt.itemCount)})`}
          value={formatRupiah(receipt.total)}
          strong
        />
        <ReceiptRow label="Tunai" value={formatRupiah(receipt.cashReceived)} />
        <ReceiptRow label="Kembali" value={formatRupiah(receipt.change)} />
        <ReceiptDivider />
        <p className="text-center text-xs">{receipt.footer}</p>
      </article>
      <ZigzagEdge className="fill-white" />
    </div>
  )
}
