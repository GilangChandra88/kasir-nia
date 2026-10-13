import { readFileSync } from 'node:fs'

import {
  initializeTestEnvironment,
  type RulesTestContext,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { doc, setDoc } from 'firebase/firestore'

/** Proyek "demo-*" hanya ada di emulator: tes tidak pernah menyentuh database sungguhan. */
export const PROJECT_ID = 'demo-nia-kasir'

export const OWNER = { uid: 'pemilik', email: 'pemilik@gmail.com' }
export const CASHIER = { uid: 'kasir', email: 'sari@gmail.com' }
export const STRANGER = { uid: 'orang-luar', email: 'luar@gmail.com' }
export const STORE_ID = 'toko-1'

export async function createEnv(): Promise<RulesTestEnvironment> {
  return initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  })
}

/** Akun Google yang login (email terverifikasi seperti akun Google sungguhan). */
export function signedIn(env: RulesTestEnvironment, account: { uid: string; email: string }) {
  return env.authenticatedContext(account.uid, { email: account.email, email_verified: true })
}

export const product = {
  name: 'Rokok A',
  category: null,
  baseUnit: 'batang',
  barcode: null,
  stock: 45,
  trackStock: true,
  isActive: true,
  variants: [{ id: 'bks', label: '1 bungkus', price: 30000, baseQty: 20 }],
}

/** Toko berisi pemilik, satu kasir aktif, dan satu barang — ditulis tanpa aturan. */
export async function seedStore(env: RulesTestEnvironment): Promise<void> {
  await env.withSecurityRulesDisabled(async (context: RulesTestContext) => {
    const db = context.firestore()
    await setDoc(doc(db, 'stores', STORE_ID), {
      name: 'Toko Nia',
      ownerUid: OWNER.uid,
      address: null,
      phone: null,
      lowStockThreshold: 5,
      receipt: { headerNote: null, footerNote: 'Terima kasih!', showCashier: true },
    })
    await setDoc(doc(db, 'users', OWNER.uid), { storeId: STORE_ID, role: 'owner' })
    await setDoc(doc(db, 'users', CASHIER.uid), { storeId: STORE_ID, role: 'cashier' })
    await setDoc(doc(db, 'stores', STORE_ID, 'members', OWNER.uid), {
      role: 'owner',
      displayName: 'Pemilik',
      email: OWNER.email,
      isActive: true,
    })
    await setDoc(doc(db, 'stores', STORE_ID, 'members', CASHIER.uid), {
      role: 'cashier',
      displayName: 'Sari',
      email: CASHIER.email,
      isActive: true,
    })
    await setDoc(doc(db, 'stores', STORE_ID, 'products', 'p1'), product)
  })
}
