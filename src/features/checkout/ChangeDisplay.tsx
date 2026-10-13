import { formatRupiah } from '@/domain/money'
import type { ChangeResult } from '@/domain/payment'
import { cn } from '@/lib/cn'

type ChangeDisplayProps = {
  result: ChangeResult
}

/** Kembalian besar berwarna hijau, atau kekurangan uang berwarna merah. */
export function ChangeDisplay({ result }: ChangeDisplayProps) {
  const ok = result.status === 'ok'

  return (
    <div
      aria-live="polite"
      className={cn(
        'rounded-2xl p-4 text-center transition-colors',
        ok && 'bg-success/10',
        result.status === 'short' && 'bg-danger/10',
        result.status === 'empty' && 'bg-navy-50',
      )}
    >
      <p className="text-sm font-semibold text-muted">Kembalian</p>
      <p
        key={result.status === 'ok' ? result.change : result.status}
        className={cn(
          'animate-pop text-3xl font-extrabold tabular-nums',
          ok ? 'text-success' : 'text-muted',
          result.status === 'short' && 'text-danger',
        )}
      >
        {result.status === 'ok' && formatRupiah(result.change)}
        {result.status === 'short' && result.message}
        {result.status === 'empty' && '—'}
      </p>
    </div>
  )
}
