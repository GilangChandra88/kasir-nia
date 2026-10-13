import { MAX_LINE_QTY } from '@/config/limits'

import type { Product, Variant } from './types'

/**
 * Isi keranjang yang disimpan: hanya kunci & jumlah. Nama dan harga SELALU diambil dari data
 * barang terkini (`resolveCart`), jadi perubahan harga oleh pemilik langsung terlihat di kasir.
 */
export type CartEntry = { productId: string; variantId: string; qty: number }

export type CartLine = {
  key: string
  product: Product
  variant: Variant
  qty: number
  /** Rupiah: harga jenis × jumlah. */
  lineTotal: number
}

export type ResolvedCart = {
  lines: CartLine[]
  /** Rupiah. */
  total: number
  /** Jumlah semua barang (bukan jumlah baris). */
  itemCount: number
  /** Barang yang stoknya tidak cukup: id barang → sisa stok (satuan dasar). */
  shortages: Record<string, number>
}

export function cartKey(productId: string, variantId: string): string {
  return `${productId}:${variantId}`
}

const sameLine = (entry: CartEntry, productId: string, variantId: string) =>
  entry.productId === productId && entry.variantId === variantId

/** Menambah 1 jenis ke keranjang; bila sudah ada, jumlahnya naik (maksimal `MAX_LINE_QTY`). */
export function addEntry(entries: CartEntry[], productId: string, variantId: string): CartEntry[] {
  const existing = entries.find((entry) => sameLine(entry, productId, variantId))
  if (!existing) return [...entries, { productId, variantId, qty: 1 }]
  return setEntryQty(entries, productId, variantId, existing.qty + 1)
}

/** Mengubah jumlah satu baris; 0 atau kurang menghapus baris. */
export function setEntryQty(
  entries: CartEntry[],
  productId: string,
  variantId: string,
  qty: number,
): CartEntry[] {
  if (qty <= 0) return entries.filter((entry) => !sameLine(entry, productId, variantId))
  const capped = Math.min(Math.floor(qty), MAX_LINE_QTY)
  return entries.map((entry) =>
    sameLine(entry, productId, variantId) ? { ...entry, qty: capped } : entry,
  )
}

/** Total satuan dasar yang dibutuhkan keranjang per barang (mis. 1 bungkus + 3 batang = 23). */
export function baseNeeded(entries: CartEntry[], products: Product[]): Map<string, number> {
  const needed = new Map<string, number>()
  for (const entry of entries) {
    const variant = products
      .find((product) => product.id === entry.productId)
      ?.variants.find((item) => item.id === entry.variantId)
    if (!variant) continue
    needed.set(entry.productId, (needed.get(entry.productId) ?? 0) + entry.qty * variant.baseQty)
  }
  return needed
}

/**
 * Sisa stok barang setelah dikurangi isi keranjang (satuan dasar).
 * `Infinity` untuk barang yang stoknya tidak dihitung.
 */
export function remainingStock(product: Product, entries: CartEntry[]): number {
  if (!product.trackStock) return Number.POSITIVE_INFINITY
  return product.stock - (baseNeeded(entries, [product]).get(product.id) ?? 0)
}

/**
 * Menggabungkan keranjang dengan data barang terkini. Baris yang barangnya sudah nonaktif atau
 * jenisnya dihapus pemilik dilewati.
 */
export function resolveCart(entries: CartEntry[], products: Product[]): ResolvedCart {
  const lines: CartLine[] = []
  for (const entry of entries) {
    const product = products.find((item) => item.id === entry.productId && item.isActive)
    const variant = product?.variants.find((item) => item.id === entry.variantId)
    if (!product || !variant) continue
    lines.push({
      key: cartKey(product.id, variant.id),
      product,
      variant,
      qty: entry.qty,
      lineTotal: variant.price * entry.qty,
    })
  }

  const shortages: Record<string, number> = {}
  for (const [productId, needed] of baseNeeded(entries, products)) {
    const product = products.find((item) => item.id === productId)
    if (product?.trackStock && needed > product.stock) shortages[productId] = product.stock
  }

  return {
    lines,
    total: lines.reduce((sum, line) => sum + line.lineTotal, 0),
    itemCount: lines.reduce((sum, line) => sum + line.qty, 0),
    shortages,
  }
}
