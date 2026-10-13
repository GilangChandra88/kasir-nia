import { collection, doc, increment, serverTimestamp } from 'firebase/firestore'

import type { CartEntry } from '@/domain/cart'
import { UserFacingError } from '@/domain/errors'
import { dayKey, prepareSale, receiptNumber, type SaleItem } from '@/domain/sale'

import { db } from './firebase'
import { productRef, readProduct } from './productRepo'
import { runTimedTransaction } from './transaction'

/** Transaksi yang baru tersimpan, untuk layar sukses & struk. */
export type RecordedSale = {
  saleId: string
  receiptNo: string
  /** Waktu di HP saat disimpan (waktu resmi di server: `createdAt`). */
  savedAt: Date
  items: SaleItem[]
  total: number
  itemCount: number
  cashReceived: number
  change: number
}

type RecordSaleInput = {
  storeId: string
  cashier: { uid: string; name: string }
  entries: CartEntry[]
  /** Rupiah. */
  cashReceived: number
  /** Total yang ditampilkan ke pembeli; transaksi batal bila server menghitung lain. */
  expectedTotal: number
}

/**
 * Menyimpan penjualan tunai secara ATOMIK: baca stok terbaru → periksa → tulis transaksi,
 * kurangi stok, dan tambah rekap harian kasir. Gagal satu, batal semua. Wajib online.
 */
export async function recordSale({
  storeId,
  cashier,
  entries,
  cashReceived,
  expectedTotal,
}: RecordSaleInput): Promise<RecordedSale> {
  const saleRef = doc(collection(db, 'stores', storeId, 'sales'))
  const savedAt = new Date()
  const day = dayKey(savedAt)
  const statsRef = doc(db, 'stores', storeId, 'dailyStats', `${day}_${cashier.uid}`)
  const receiptNo = receiptNumber(savedAt, saleRef.id)
  const productIds = [...new Set(entries.map((entry) => entry.productId))]

  const sale = await runTimedTransaction(async (tx) => {
    const products = await Promise.all(productIds.map((id) => readProduct(tx, storeId, id)))
    const prepared = prepareSale({ entries, products, cashReceived, expectedTotal })
    if (!prepared.ok) throw new UserFacingError(prepared.message)
    const { stockUpdates, ...summary } = prepared.sale

    tx.set(saleRef, {
      ...summary,
      receiptNo,
      day,
      cashierUid: cashier.uid,
      cashierName: cashier.name,
      createdAt: serverTimestamp(),
    })
    for (const update of stockUpdates) {
      tx.update(productRef(storeId, update.productId), {
        stock: update.stock,
        lastSaleId: saleRef.id,
        updatedAt: serverTimestamp(),
      })
    }
    tx.set(
      statsRef,
      {
        date: day,
        cashierUid: cashier.uid,
        total: increment(summary.total),
        saleCount: increment(1),
        itemCount: increment(summary.itemCount),
      },
      { merge: true },
    )
    return summary
  })

  return { ...sale, saleId: saleRef.id, receiptNo, savedAt }
}
