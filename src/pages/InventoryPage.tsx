import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'

export function InventoryPage() {
  return (
    <>
      <PageHeader title="Stok Barang" subtitle="Barang & jenisnya" />
      <EmptyState
        title="Belum ada barang"
        description="Tambah barang, jenis (bungkus, batang, ...), dan barcode akan hadir di Tahap 2."
      />
    </>
  )
}
