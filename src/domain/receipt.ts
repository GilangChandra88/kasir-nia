import { formatNumber } from './money'
import type { SaleItem } from './sale'
import type { ReceiptSettings, StoreInfo } from './types'

/** Data penjualan yang dibutuhkan struk (dari transaksi baru maupun riwayat). */
export type ReceiptSale = {
  receiptNo: string
  date: Date
  cashierName: string
  items: SaleItem[]
  total: number
  itemCount: number
  cashReceived: number
  change: number
}

export type ReceiptLine = {
  name: string
  /** Mis. "1 bungkus · 2 × 30.000" — tanpa "Rp" agar muat satu baris seperti struk asli. */
  detail: string
  /** Rupiah. */
  amount: number
}

/**
 * Model struk siap tampil. Dipakai ulang kelak untuk cetak printer Bluetooth (ESC/POS),
 * jadi tidak boleh bergantung pada tampilan.
 */
export type ReceiptModel = {
  storeName: string
  /** Alamat, telepon, catatan atas — hanya yang terisi. */
  headerLines: string[]
  receiptNo: string
  dateText: string
  cashierName: string | null
  lines: ReceiptLine[]
  itemCount: number
  total: number
  cashReceived: number
  change: number
  footer: string
}

type StoreForReceipt = Pick<StoreInfo, 'name' | 'address' | 'phone'> & {
  receipt: ReceiptSettings
}

const pad = (value: number) => String(value).padStart(2, '0')

/** Tanggal & jam lokal ala struk Indonesia: "14/10/2026 14.32". */
export function formatReceiptDate(date: Date): string {
  const day = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
  return `${day} ${pad(date.getHours())}.${pad(date.getMinutes())}`
}

function nonEmpty(values: (string | null)[]): string[] {
  return values.flatMap((value) => (value && value.trim() !== '' ? [value.trim()] : []))
}

/** Menyusun isi struk dari transaksi + info & pengaturan toko. */
export function buildReceipt(store: StoreForReceipt, sale: ReceiptSale): ReceiptModel {
  return {
    storeName: store.name,
    headerLines: nonEmpty([
      store.address,
      store.phone ? `Telp ${store.phone}` : null,
      store.receipt.headerNote,
    ]),
    receiptNo: sale.receiptNo,
    dateText: formatReceiptDate(sale.date),
    cashierName: store.receipt.showCashier ? sale.cashierName : null,
    lines: sale.items.map((item) => ({
      name: item.name,
      detail: `${item.variantLabel} · ${formatNumber(item.qty)} × ${formatNumber(item.price)}`,
      amount: item.price * item.qty,
    })),
    itemCount: sale.itemCount,
    total: sale.total,
    cashReceived: sale.cashReceived,
    change: sale.change,
    footer: store.receipt.footerNote,
  }
}
