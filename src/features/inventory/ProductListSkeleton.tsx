import { Skeleton } from '@/components/ui/Skeleton'

/** Jumlah baris palsu saat daftar barang dimuat. */
const ROWS = 4

export function ProductListSkeleton() {
  return (
    <div role="status" aria-label="Memuat barang" className="flex flex-col gap-2">
      {Array.from({ length: ROWS }, (_, index) => (
        <div key={index} className="flex items-center gap-3 rounded-3xl bg-card p-3 shadow-soft">
          <Skeleton className="size-12" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
