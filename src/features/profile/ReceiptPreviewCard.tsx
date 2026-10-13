import { SectionCard } from '@/components/ui/SectionCard'
import { buildReceipt } from '@/domain/receipt'
import type { StoreProfileDraft } from '@/domain/storeProfile'
import { ReceiptPaper } from '@/features/receipt/ReceiptPaper'
import { SAMPLE_RECEIPT_SALE } from '@/features/receipt/sampleSale'

type ReceiptPreviewCardProps = {
  draft: StoreProfileDraft
}

/** Pratinjau struk yang langsung berubah saat isian diketik. */
export function ReceiptPreviewCard({ draft }: ReceiptPreviewCardProps) {
  const receipt = buildReceipt(
    {
      name: draft.name.trim() || 'Nama toko',
      address: draft.address,
      phone: draft.phone,
      receipt: {
        headerNote: draft.headerNote,
        footerNote: draft.footerNote,
        showCashier: draft.showCashier,
      },
    },
    SAMPLE_RECEIPT_SALE,
  )

  return (
    <SectionCard title="Pratinjau struk" description="Contoh struk dengan transaksi pura-pura.">
      <div className="rounded-2xl bg-paper px-4 py-6">
        <ReceiptPaper receipt={receipt} />
      </div>
    </SectionCard>
  )
}
