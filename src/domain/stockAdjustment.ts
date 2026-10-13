import { MAX_STOCK } from '@/config/limits'

import { formatNumber } from './money'
import type { Product } from './types'

/**
 * Perubahan stok manual oleh pemilik (semua angka dalam satuan dasar kecuali `quantity` mode add):
 * - `add`: stok masuk, `quantity` × `perUnit` (mis. 2 × bungkus isi 20 = 40 batang).
 * - `set`: koreksi, stok diganti menjadi `quantity` (hasil hitung fisik).
 */
export type StockAdjustment =
  { mode: 'add'; quantity: number; perUnit: number } | { mode: 'set'; quantity: number }

export type StockAdjustResult = { ok: true; stock: number } | { ok: false; message: string }

const TOO_MUCH = `Stok maksimal ${formatNumber(MAX_STOCK)}.`

/** Menghitung stok baru dari stok sekarang. Tidak pernah menghasilkan stok minus. */
export function applyStockAdjustment(
  current: number,
  adjustment: StockAdjustment,
): StockAdjustResult {
  if (!Number.isInteger(adjustment.quantity)) {
    return { ok: false, message: 'Jumlah harus bilangan bulat.' }
  }

  if (adjustment.mode === 'set') {
    if (adjustment.quantity < 0) return { ok: false, message: 'Stok tidak boleh minus.' }
    if (adjustment.quantity > MAX_STOCK) return { ok: false, message: TOO_MUCH }
    return { ok: true, stock: adjustment.quantity }
  }

  if (adjustment.quantity < 1) return { ok: false, message: 'Jumlah stok masuk minimal 1.' }
  const stock = current + adjustment.quantity * adjustment.perUnit
  return stock > MAX_STOCK ? { ok: false, message: TOO_MUCH } : { ok: true, stock }
}

/** Satuan untuk stok masuk: satuan dasar + jenis yang berisi lebih dari 1 (mis. bungkus isi 20). */
export type StockUnitOption = { id: string; label: string; perUnit: number }

/** Id pilihan satuan dasar pada `stockUnitOptions`. */
export const BASE_UNIT_OPTION_ID = 'base'

export function stockUnitOptions(product: Product): StockUnitOption[] {
  const packs = product.variants
    .filter((variant) => variant.baseQty > 1)
    .map((variant) => ({ id: variant.id, label: variant.label, perUnit: variant.baseQty }))
  return [{ id: BASE_UNIT_OPTION_ID, label: product.baseUnit, perUnit: 1 }, ...packs]
}

/** Menyusun perubahan stok dari isian sheet; null bila jumlah belum diisi. */
export function buildAdjustment(
  mode: StockAdjustment['mode'],
  quantity: number | null,
  perUnit: number,
): StockAdjustment | null {
  if (quantity === null) return null
  return mode === 'add' ? { mode, quantity, perUnit } : { mode, quantity }
}
