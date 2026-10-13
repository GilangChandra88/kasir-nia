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

const NEW_CASHIER = { uid: 'budi', email: 'budi@gmail.com' }

/** Pemilik mendaftarkan email kasir (dua lokasi undangan, seperti `inviteCashier`). */
function invite(email = NEW_CASHIER.email, account = OWNER) {
  const db = signedIn(env, account).firestore()
  const data = {
    storeId: STORE_ID,
    storeName: 'Toko Nia',
    displayName: 'Budi',
    invitedBy: account.uid,
    createdAt: serverTimestamp(),
  }
  const batch = writeBatch(db)
  batch.set(doc(db, 'stores', STORE_ID, 'invites', email), data)
  batch.set(doc(db, 'invites', email), data)
  return batch.commit()
}

/** Kasir mengklaim undangan (seperti `claimInvite`). */
function claim(account: { uid: string; email: string }, email = NEW_CASHIER.email) {
  const db = signedIn(env, account).firestore()
  const batch = writeBatch(db)
  batch.set(doc(db, 'stores', STORE_ID, 'members', account.uid), {
    role: 'cashier',
    displayName: 'Budi',
    email,
    isActive: true,
    joinedAt: serverTimestamp(),
  })
  batch.set(doc(db, 'users', account.uid), { storeId: STORE_ID, role: 'cashier' })
  batch.delete(doc(db, 'invites', email))
  batch.delete(doc(db, 'stores', STORE_ID, 'invites', email))
  return batch.commit()
}

describe('undangan kasir', () => {
  it('pemilik bisa mendaftarkan email kasir', async () => {
    await assertSucceeds(invite())
  })

  it('kasir tidak bisa mengundang orang lain', async () => {
    await assertFails(invite(NEW_CASHIER.email, CASHIER))
  })

  it('akun baru boleh mengecek undangan yang belum ada saat login', async () => {
    const db = signedIn(env, STRANGER).firestore()
    await assertSucceeds(getDoc(doc(db, 'invites', STRANGER.email)))
  })

  it('akun dengan email yang diundang bisa bergabung sebagai kasir', async () => {
    await invite()
    await assertSucceeds(claim(NEW_CASHIER))
  })

  it('akun dengan email lain tidak bisa memakai undangan orang', async () => {
    await invite()
    await assertFails(claim(STRANGER))
  })

  it('tidak bisa bergabung tanpa undangan', async () => {
    await assertFails(claim(NEW_CASHIER))
  })
})

describe('mengelola kasir', () => {
  it('pemilik bisa menonaktifkan kasir dan kasir langsung kehilangan akses', async () => {
    const ownerDb = signedIn(env, OWNER).firestore()
    await assertSucceeds(
      updateDoc(doc(ownerDb, 'stores', STORE_ID, 'members', CASHIER.uid), {
        isActive: false,
        updatedAt: serverTimestamp(),
      }),
    )
    const cashierDb = signedIn(env, CASHIER).firestore()
    await assertFails(getDoc(doc(cashierDb, 'stores', STORE_ID)))
    await assertFails(getDoc(doc(cashierDb, 'stores', STORE_ID, 'members', CASHIER.uid)))
  })

  it('pemilik tidak bisa menonaktifkan dirinya sendiri', async () => {
    const db = signedIn(env, OWNER).firestore()
    await assertFails(
      updateDoc(doc(db, 'stores', STORE_ID, 'members', OWNER.uid), { isActive: false }),
    )
  })

  it('pemilik tidak bisa mengubah peran kasir', async () => {
    const db = signedIn(env, OWNER).firestore()
    await assertFails(
      updateDoc(doc(db, 'stores', STORE_ID, 'members', CASHIER.uid), { role: 'owner' }),
    )
  })

  it('kasir tidak bisa mengaktifkan dirinya sendiri', async () => {
    const db = signedIn(env, CASHIER).firestore()
    await assertFails(
      updateDoc(doc(db, 'stores', STORE_ID, 'members', CASHIER.uid), { isActive: true }),
    )
  })
})
