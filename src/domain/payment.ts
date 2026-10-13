import { CASH_ROUNDING_STEPS, QUICK_CASH_COUNT } from '@/config/payment'

import { formatRupiah } from './money'

/**
 * Nominal uang cepat (rupiah) untuk total tertentu: dibulatkan ke atas ke pecahan umum.
 * 61.500 → [62.000, 65.000, 70.000, 100.000]. "Uang pas" (= total) ditangani terpisah.
 */
export function quickCashOptions(total: number): number[] {
  if (total <= 0) return []
  const rounded = CASH_ROUNDING_STEPS.map((step) => Math.ceil(total / step) * step)
  return [...new Set(rounded)]
    .filter((amount) => amount > total)
    .sort((a, b) => a - b)
    .slice(0, QUICK_CASH_COUNT)
}

export type ChangeResult =
  | { status: 'empty' }
  | { status: 'short'; missing: number; message: string }
  | { status: 'ok'; change: number }

/** Kembalian dari uang tunai yang diterima (rupiah). Kosong/kurang tidak bisa disimpan. */
export function changeDue(total: number, received: number | null): ChangeResult {
  if (received === null) return { status: 'empty' }
  if (received < total) {
    const missing = total - received
    return { status: 'short', missing, message: `Uang kurang ${formatRupiah(missing)}` }
  }
  return { status: 'ok', change: received - total }
}
