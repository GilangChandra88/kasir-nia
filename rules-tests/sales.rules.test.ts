import {
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import {
  deleteDoc,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'

import { CASHIER, createEnv, OWNER, seedStore, signedIn, STORE_ID } from './setup'

let env: RulesTestEnvironment

beforeAll(async () => {
  env = await createEnv()
})

afterAll(async () => {
  await env.cleanup()
})

beforeEach(async () => {
  await env.clearFirestore()
  await seedStore(env)
})

const DAY = '2026-10-14'

/** Penjualan 1 bungkus (20 batang) persis seperti yang ditulis `recordSale`. */
function sellOnePack(
  account: { uid: string; email: string },
  saleId: string,
  cashierUid = account.uid,
) {
  const db = signedIn(env, account).firestore()
  const batch = writeBatch(db)
  batch.set(doc(db, 'stores', STORE_ID, 'sales', saleId), {
    receiptNo: '261014-ABCD',
    day: DAY,
    cashierUid,
    cashierName: 'Sari',
    items: [
      {
        productId: 'p1',
        variantId: 'bks',
        name: 'Rokok A',
        variantLabel: '1 bungkus',
        price: 30000,
        qty: 1,
        baseQty: 20,
      },
    ],
    total: 30000,
    itemCount: 1,
    cashReceived: 50000,
    change: 20000,
    createdAt: serverTimestamp(),
  })
  batch.update(doc(db, 'stores', STORE_ID, 'products', 'p1'), {
    stock: 25,
    lastSaleId: saleId,
    updatedAt: serverTimestamp(),
  })
  batch.set(
    doc(db, 'stores', STORE_ID, 'dailyStats', `${DAY}_${cashierUid}`),
    {
      date: DAY,
      cashierUid,
      total: increment(30000),
      saleCount: increment(1),
      itemCount: increment(1),
    },
    { merge: true },
  )
  return batch.commit()
}

describe('penjualan', () => {
  it('kasir bisa mencatat penjualan, mengurangi stok, dan menambah rekap harian', async () => {
    await assertSucceeds(sellOnePack(CASHIER, 'jual-1'))
  })

  it('pemilik juga bisa berjualan', async () => {
    await assertSucceeds(sellOnePack(OWNER, 'jual-2'))
  })

  it('kasir tidak bisa mencatat penjualan atas nama kasir lain', async () => {
    await assertFails(sellOnePack(CASHIER, 'jual-3', OWNER.uid))
  })

  it('penjualan tidak bisa diubah atau dihapus', async () => {
    await sellOnePack(CASHIER, 'jual-4')
    const db = signedIn(env, OWNER).firestore()
    await assertFails(updateDoc(doc(db, 'stores', STORE_ID, 'sales', 'jual-4'), { total: 0 }))
    await assertFails(deleteDoc(doc(db, 'stores', STORE_ID, 'sales', 'jual-4')))
  })

  it('pemilik bisa membaca penjualan kasir', async () => {
    await sellOnePack(CASHIER, 'jual-5')
    const db = signedIn(env, OWNER).firestore()
    await assertSucceeds(getDoc(doc(db, 'stores', STORE_ID, 'sales', 'jual-5')))
  })

  it('kasir tidak bisa membaca penjualan pemilik', async () => {
    await sellOnePack(OWNER, 'jual-6')
    const db = signedIn(env, CASHIER).firestore()
    await assertFails(getDoc(doc(db, 'stores', STORE_ID, 'sales', 'jual-6')))
  })
})
