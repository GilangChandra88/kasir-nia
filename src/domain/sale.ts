import { MAX_SALE_LINES } from '@/config/limits'

import { baseNeeded, type CartEntry, resolveCart, type ResolvedCart } from './cart'
import { formatNumber } from './money'
import { changeDue } from './payment'
import type { Product } from './types'

/** Satu baris transaksi: SALINAN nama & harga saat itu, agar riwayat tidak berubah bila harga naik. */
export type SaleItem = {
  productId: string
  variantId: string
  name: string
  variantLabel: string
  /** Rupiah per jenis. */
  price: number
  qty: number
  /** Satuan dasar per jenis (untuk riwayat stok). */
  baseQty: number
}

export type PreparedSale = {
  items: SaleItem[]
  total: number
  itemCount: number
  cashReceived: number
  change: number
  /** Stok baru (satuan dasar) untuk barang yang stoknya dihitung. */
  stockUpdates: { productId: string; stock: number }[]
}

export type PrepareSaleResult = { ok: true; sale: PreparedSale } | { ok: false; message: string }

type PrepareSaleInput = {
  entries: CartEntry[]
  /** Data barang TERBARU dari server (dibaca di dalam transaksi). */
  products: Product[]
  cashReceived: number
  /** Total yang dilihat kasir & pembeli di layar; harus sama dengan hitungan server. */
  expectedTotal: number
}

/** Alasan keranjang tidak bisa dibayar (Bahasa Indonesia), atau null bila aman. */
function cartProblem(
  cart: ResolvedCart,
  entries: CartEntry[],
  products: Product[],
  expectedTotal: number,
): string | null {
  if (cart.lines.length === 0) return 'Keranjang masih kosong.'
  if (cart.lines.length !== entries.length) {
    return 'Ada barang yang sudah tidak dijual. Periksa keranjang lagi.'
  }
  if (cart.lines.length > MAX_SALE_LINES) return `Maksimal ${MAX_SALE_LINES} baris per transaksi.`

  const [shortId, available = 0] = Object.entries(cart.shortages)[0] ?? []
  if (shortId !== undefined) {
    const name = products.find((product) => product.id === shortId)?.name ?? 'Barang'
    return `Stok ${name} tinggal ${formatNumber(available)}.`
  }
  if (cart.total !== expectedTotal) {
    return 'Harga barang baru saja berubah. Periksa total lalu bayar lagi.'
  }
  return null
}

/**
 * Menyusun transaksi tunai dari keranjang dan memeriksa semuanya terhadap data server:
 * barang masih dijual, harga tidak berubah, stok cukup, dan uang cukup.
 */
export function prepareSale({
  entries,
  products,
  cashReceived,
  expectedTotal,
}: PrepareSaleInput): PrepareSaleResult {
  const cart = resolveCart(entries, products)
  const problem = cartProblem(cart, entries, products, expectedTotal)
  if (problem) return { ok: false, message: problem }

  const payment = changeDue(cart.total, cashReceived)
  if (payment.status === 'empty') return { ok: false, message: 'Isi uang diterima.' }
  if (payment.status === 'short') return { ok: false, message: payment.message }

  const needed = baseNeeded(entries, products)
  const stockUpdates = products
    .filter((product) => product.trackStock && needed.has(product.id))
    .map((product) => ({
      productId: product.id,
      stock: product.stock - (needed.get(product.id) ?? 0),
    }))

  return {
    ok: true,
    sale: {
      items: cart.lines.map(({ product, variant, qty }) => ({
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        variantLabel: variant.label,
        price: variant.price,
        qty,
        baseQty: variant.baseQty,
      })),
      total: cart.total,
      itemCount: cart.itemCount,
      cashReceived,
      change: payment.change,
      stockUpdates,
    },
  }
}

const pad = (value: number) => String(value).padStart(2, '0')

/** Kunci hari lokal "yyyy-MM-dd" untuk rekap harian (zona waktu perangkat). */
export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Panjang kode unik di nomor struk (karakter). */
const RECEIPT_CODE_LENGTH = 4

/** Nomor struk yang mudah dibaca: "261013-K7Q2" (tanggal + 4 huruf akhir ID transaksi). */
export function receiptNumber(date: Date, saleId: string): string {
  const day = `${pad(date.getFullYear() % 100)}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
  return `${day}-${saleId.slice(-RECEIPT_CODE_LENGTH).toUpperCase()}`
}
