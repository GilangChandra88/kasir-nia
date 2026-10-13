import { formatNumber } from './money'
import type { Product, Variant } from './types'

export type StockStatus = 'untracked' | 'out' | 'low' | 'ok'

export type StockFilter = 'all' | 'low' | 'out'

/** Status stok untuk penanda warna. `threshold` dalam satuan dasar. */
export function stockStatus(product: Product, threshold: number): StockStatus {
  if (!product.trackStock) return 'untracked'
  if (product.stock <= 0) return 'out'
  if (product.stock <= threshold) return 'low'
  return 'ok'
}

/** Stok dalam satuan dasar: 45 batang → "45 batang". */
export function formatStock(product: Product): string {
  return `${formatNumber(product.stock)} ${product.baseUnit}`
}

/**
 * Rincian stok memakai jenis terbesar agar mudah dibayangkan:
 * 45 batang & jenis "1 bungkus" (20) → "2 × 1 bungkus + 5 batang". Null bila tidak membantu.
 */
export function stockBreakdown(product: Product): string | null {
  const largest = product.variants.reduce<Variant | null>(
    (best, variant) => (variant.baseQty > (best?.baseQty ?? 1) ? variant : best),
    null,
  )
  if (!product.trackStock || !largest || product.stock < largest.baseQty) return null

  const whole = Math.floor(product.stock / largest.baseQty)
  const rest = product.stock % largest.baseQty
  const head = `${formatNumber(whole)} × ${largest.label}`
  return rest === 0 ? head : `${head} + ${formatNumber(rest)} ${product.baseUnit}`
}

/** Harga termurah & termahal dari semua jenis (rupiah). */
export function priceRange(variants: Variant[]): { min: number; max: number } {
  const prices = variants.map((variant) => variant.price)
  return { min: Math.min(...prices), max: Math.max(...prices) }
}

/** Kategori unik yang sudah dipakai, untuk saran isian. */
export function collectCategories(products: Product[]): string[] {
  const categories = new Set(products.flatMap((product) => product.category ?? []))
  return [...categories].sort((a, b) => a.localeCompare(b, 'id'))
}

type ProductQuery = {
  text: string
  filter: StockFilter
  threshold: number
}

function matchesText(product: Product, text: string): boolean {
  if (text === '') return true
  return [product.name, product.category ?? '', product.barcode ?? ''].some((value) =>
    value.toLowerCase().includes(text),
  )
}

function matchesFilter(product: Product, filter: StockFilter, threshold: number): boolean {
  if (filter === 'all') return true
  const status = stockStatus(product, threshold)
  return filter === 'out' ? status === 'out' : status === 'low'
}

/** Barang aktif yang cocok dengan pencarian & filter, urut nama A–Z. */
export function filterProducts(products: Product[], query: ProductQuery): Product[] {
  const text = query.text.trim().toLowerCase()
  return products
    .filter(
      (product) =>
        product.isActive &&
        matchesText(product, text) &&
        matchesFilter(product, query.filter, query.threshold),
    )
    .sort((a, b) => a.name.localeCompare(b.name, 'id'))
}

/** Jumlah barang aktif per filter, untuk angka di chip filter. */
export function countByFilter(products: Product[], threshold: number): Record<StockFilter, number> {
  const active = products.filter((product) => product.isActive)
  return {
    all: active.length,
    low: active.filter((product) => stockStatus(product, threshold) === 'low').length,
    out: active.filter((product) => stockStatus(product, threshold) === 'out').length,
  }
}

/** Barang aktif pemilik barcode ini (untuk scan & cegah barcode ganda), atau null. */
export function findProductByBarcode(products: Product[], barcode: string): Product | null {
  if (barcode === '') return null
  return products.find((product) => product.isActive && product.barcode === barcode) ?? null
}
