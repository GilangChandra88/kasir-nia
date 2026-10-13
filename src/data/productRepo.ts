import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  type Transaction,
  type Unsubscribe,
} from 'firebase/firestore'
import { z } from 'zod'

import { UserFacingError } from '@/domain/errors'
import { applyStockAdjustment, type StockAdjustment } from '@/domain/stockAdjustment'
import type { Product, ProductInput } from '@/domain/types'

import { db } from './firebase'
import { parseProduct } from './schemas'
import { runTimedTransaction } from './transaction'

const barcodeDocSchema = z.object({ productId: z.string().min(1) })

const productsOf = (storeId: string) => collection(db, 'stores', storeId, 'products')
export const productRef = (storeId: string, productId: string) =>
  doc(productsOf(storeId), productId)
// Barcode menjadi ID dokumen: Firestore sendiri yang menjamin satu barcode = satu barang.
const barcodeRef = (storeId: string, barcode: string) =>
  doc(db, 'stores', storeId, 'barcodes', barcode)

const NOT_FOUND = 'Barang tidak ditemukan. Mungkin sudah dinonaktifkan.'

/** Memantau semua barang toko (termasuk nonaktif; penyaringan di `domain/inventory.ts`). */
export function watchProducts(
  storeId: string,
  onData: (products: Product[]) => void,
  onError: (error: unknown) => void,
): Unsubscribe {
  return onSnapshot(
    productsOf(storeId),
    (snapshot) => {
      onData(snapshot.docs.flatMap((document) => parseProduct(document.id, document.data()) ?? []))
    },
    onError,
  )
}

/** Membaca barang di dalam transaksi; galat ramah bila tidak ada. */
export async function readProduct(
  tx: Transaction,
  storeId: string,
  productId: string,
): Promise<Product> {
  const snapshot = await tx.get(productRef(storeId, productId))
  const product = snapshot.exists() ? parseProduct(snapshot.id, snapshot.data()) : null
  if (!product) throw new UserFacingError(NOT_FOUND)
  return product
}

/** Memastikan barcode belum dipakai barang lain. Harus dipanggil sebelum ada penulisan. */
async function assertBarcodeFree(
  tx: Transaction,
  storeId: string,
  barcode: string,
  productId: string,
): Promise<void> {
  const snapshot = await tx.get(barcodeRef(storeId, barcode))
  const owner = barcodeDocSchema.safeParse(snapshot.data())
  if (!snapshot.exists() || !owner.success || owner.data.productId === productId) return

  const ownerProduct = await tx.get(productRef(storeId, owner.data.productId))
  const ownerName = parseProduct(ownerProduct.id, ownerProduct.data())?.name ?? 'barang lain'
  throw new UserFacingError(`Barcode ${barcode} sudah dipakai "${ownerName}".`)
}

type SaveProductOptions = {
  storeId: string
  input: ProductInput
  /** Null = barang baru. */
  productId: string | null
  /** Stok awal (satuan dasar), hanya dipakai untuk barang baru. */
  initialStock: number
}

/** Menyimpan barang baru atau perubahan barang. Mengembalikan id barang. Wajib online. */
export function saveProduct({
  storeId,
  input,
  productId,
  initialStock,
}: SaveProductOptions): Promise<string> {
  const ref = productId ? productRef(storeId, productId) : doc(productsOf(storeId))

  return runTimedTransaction(async (tx) => {
    const existing = productId ? await readProduct(tx, storeId, productId) : null
    const oldBarcode = existing?.barcode ?? null
    if (input.barcode && input.barcode !== oldBarcode) {
      await assertBarcodeFree(tx, storeId, input.barcode, ref.id)
    }

    // Semua pembacaan selesai; mulai menulis.
    if (existing) {
      tx.update(ref, { ...input, updatedAt: serverTimestamp() })
    } else {
      tx.set(ref, {
        ...input,
        stock: initialStock,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }
    if (oldBarcode && oldBarcode !== input.barcode) tx.delete(barcodeRef(storeId, oldBarcode))
    if (input.barcode && input.barcode !== oldBarcode) {
      tx.set(barcodeRef(storeId, input.barcode), { productId: ref.id })
    }
    return ref.id
  })
}

/** Stok masuk / koreksi. Dihitung dari stok terbaru di server agar tidak menimpa penjualan. */
export async function adjustStock(
  storeId: string,
  productId: string,
  adjustment: StockAdjustment,
): Promise<void> {
  await runTimedTransaction(async (tx) => {
    const product = await readProduct(tx, storeId, productId)
    const result = applyStockAdjustment(product.stock, adjustment)
    if (!result.ok) throw new UserFacingError(result.message)
    tx.update(productRef(storeId, productId), { stock: result.stock, updatedAt: serverTimestamp() })
  })
}

/**
 * Menyembunyikan barang dari kasir & stok tanpa menghapusnya, agar riwayat transaksi tetap utuh.
 * Barcode-nya dilepas supaya bisa dipakai barang lain.
 */
export async function deactivateProduct(storeId: string, productId: string): Promise<void> {
  await runTimedTransaction(async (tx) => {
    const product = await readProduct(tx, storeId, productId)
    tx.update(productRef(storeId, productId), {
      isActive: false,
      barcode: null,
      updatedAt: serverTimestamp(),
    })
    if (product.barcode) tx.delete(barcodeRef(storeId, product.barcode))
  })
}
