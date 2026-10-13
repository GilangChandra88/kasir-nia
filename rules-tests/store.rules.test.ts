import {
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { doc, getDoc, serverTimestamp, updateDoc, writeBatch } from 'firebase/firestore'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'

import { CASHIER, createEnv, OWNER, seedStore, signedIn, STORE_ID, STRANGER } from './setup'

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

describe('membuat toko', () => {
  const newOwner = { uid: 'baru', email: 'baru@gmail.com' }

  function createStoreBatch(account: { uid: string; email: string }, storeId: string) {
    const db = signedIn(env, account).firestore()
    const batch = writeBatch(db)
    batch.set(doc(db, 'stores', storeId), {
      name: 'Toko Baru',
      ownerUid: account.uid,
      address: null,
      phone: null,
      lowStockThreshold: 5,
      receipt: { headerNote: null, footerNote: 'Terima kasih!', showCashier: true },
    })
    batch.set(doc(db, 'stores', storeId, 'members', account.uid), {
      role: 'owner',
      displayName: 'Baru',
      email: account.email,
      isActive: true,
    })
    batch.set(doc(db, 'users', account.uid), { storeId, role: 'owner' })
    return batch.commit()
  }

  it('akun baru bisa membuat toko dan menjadi pemiliknya', async () => {
    await assertSucceeds(createStoreBatch(newOwner, 'toko-baru'))
  })

  it('akun yang sudah punya toko tidak bisa membuat toko kedua', async () => {
    await assertFails(createStoreBatch(OWNER, 'toko-kedua'))
  })
})

describe('akses toko', () => {
  it('anggota aktif bisa membaca toko', async () => {
    await assertSucceeds(getDoc(doc(signedIn(env, CASHIER).firestore(), 'stores', STORE_ID)))
  })

  it('orang luar tidak bisa membaca toko', async () => {
    await assertFails(getDoc(doc(signedIn(env, STRANGER).firestore(), 'stores', STORE_ID)))
  })

  it('pemilik bisa mengubah info & struk toko', async () => {
    const db = signedIn(env, OWNER).firestore()
    await assertSucceeds(
      updateDoc(doc(db, 'stores', STORE_ID), {
        address: 'Jl. Mawar 12',
        updatedAt: serverTimestamp(),
      }),
    )
  })

  it('kasir tidak bisa mengubah info toko', async () => {
    const db = signedIn(env, CASHIER).firestore()
    await assertFails(updateDoc(doc(db, 'stores', STORE_ID), { name: 'Toko Sari' }))
  })

  it('nama toko terlalu panjang ditolak', async () => {
    const db = signedIn(env, OWNER).firestore()
    await assertFails(updateDoc(doc(db, 'stores', STORE_ID), { name: 'x'.repeat(41) }))
  })
})

describe('barang', () => {
  it('kasir tidak bisa mengubah harga barang', async () => {
    const db = signedIn(env, CASHIER).firestore()
    await assertFails(updateDoc(doc(db, 'stores', STORE_ID, 'products', 'p1'), { name: 'Murah' }))
  })

  it('kasir tidak bisa mengurangi stok tanpa penjualan', async () => {
    const db = signedIn(env, CASHIER).firestore()
    await assertFails(updateDoc(doc(db, 'stores', STORE_ID, 'products', 'p1'), { stock: 0 }))
  })

  it('pemilik bisa mendaftarkan barcode yang cocok dengan barangnya', async () => {
    const db = signedIn(env, OWNER).firestore()
    const batch = writeBatch(db)
    batch.update(doc(db, 'stores', STORE_ID, 'products', 'p1'), { barcode: '8991' })
    batch.set(doc(db, 'stores', STORE_ID, 'barcodes', '8991'), { productId: 'p1' })
    await assertSucceeds(batch.commit())
  })

  it('barcode yang menunjuk barang lain ditolak', async () => {
    const db = signedIn(env, OWNER).firestore()
    const batch = writeBatch(db)
    batch.set(doc(db, 'stores', STORE_ID, 'barcodes', '8991'), { productId: 'p1' })
    await assertFails(batch.commit())
  })
})
