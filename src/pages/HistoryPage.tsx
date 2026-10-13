import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'

export function HistoryPage() {
  return (
    <>
      <PageHeader title="Riwayat" subtitle="Transaksi & rekap" />
      <EmptyState
        title="Belum ada transaksi hari ini"
        description="Rekap hari ini & minggu ini akan muncul di sini setelah transaksi pertama. Semangat! ☕"
      />
    </>
  )
}
