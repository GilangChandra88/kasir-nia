import { ArrowRight } from 'lucide-react'

import { formatNumber } from '@/domain/money'

type StockPreviewProps = {
  current: number
  /** Null bila isian belum lengkap atau tidak valid. */
  next: number | null
  unit: string
}

/** "45 → 85 batang": pratinjau stok sebelum disimpan. */
export function StockPreview({ current, next, unit }: StockPreviewProps) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl bg-navy-50 p-3 font-semibold tabular-nums">
      <span>{formatNumber(current)}</span>
      <ArrowRight className="size-4 text-muted" aria-hidden="true" />
      <span className="text-navy-600">
        {next === null ? '…' : formatNumber(next)} {unit}
      </span>
    </div>
  )
}
