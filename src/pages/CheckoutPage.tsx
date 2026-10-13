import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'

export function CheckoutPage() {
  return (
    <>
      <PageHeader title="Kasir" subtitle="Transaksi baru" />
      <EmptyState
        title="Keranjang masih kosong"
        description="Scan barcode atau cari barang akan hadir di Tahap 4. Siapkan dulu barangnya di menu Stok."
      />
    </>
  )
}
