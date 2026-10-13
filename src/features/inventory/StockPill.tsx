import { Badge } from '@/components/ui/Badge'
import { formatStock, type StockStatus } from '@/domain/inventory'
import type { Product } from '@/domain/types'

type StockPillProps = {
  product: Product
  status: StockStatus
}

const TONE = {
  ok: 'success',
  low: 'warning',
  out: 'danger',
  untracked: 'muted',
} as const

export function StockPill({ product, status }: StockPillProps) {
  const text =
    status === 'out' ? 'Habis' : status === 'untracked' ? 'Tak dihitung' : formatStock(product)

  return <Badge tone={TONE[status]}>{text}</Badge>
}
