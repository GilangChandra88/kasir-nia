import { collection, doc, serverTimestamp } from 'firebase/firestore'

import { DEFAULT_LOW_STOCK_THRESHOLD } from '@/config/limits'
import { DEFAULT_RECEIPT_SETTINGS } from '@/config/receipt'
import { UserFacingError } from '@/domain/errors'
import type { AuthUser } from '@/domain/types'

import { db } from './firebase'
import { runTimedTransaction } from './transaction'

/**
 * Membuat toko baru dengan `user` sebagai pemilik. Toko, keanggotaan, dan `users/{uid}` ditulis
 * dalam satu transaksi agar tidak pernah ada toko tanpa pemilik. `name` harus sudah divalidasi
 * (`domain/store.ts`). Wajib online.
 */
export async function createStore(user: AuthUser, name: string): Promise<void> {
  const storeRef = doc(collection(db, 'stores'))
  const memberRef = doc(db, 'stores', storeRef.id, 'members', user.uid)
  const userRef = doc(db, 'users', user.uid)

  await runTimedTransaction(async (tx) => {
    // Aturan 1 akun = 1 toko (juga dijaga firestore.rules).
    if ((await tx.get(userRef)).exists()) {
      throw new UserFacingError('Akun ini sudah terdaftar di sebuah toko.')
    }

    tx.set(storeRef, {
      name,
      ownerUid: user.uid,
      address: null,
      phone: null,
      lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD,
      receipt: DEFAULT_RECEIPT_SETTINGS,
      createdAt: serverTimestamp(),
    })
    tx.set(memberRef, {
      role: 'owner',
      displayName: user.displayName,
      email: user.email,
      isActive: true,
      joinedAt: serverTimestamp(),
    })
    tx.set(userRef, {
      storeId: storeRef.id,
      role: 'owner',
      displayName: user.displayName,
      email: user.email,
      createdAt: serverTimestamp(),
    })
  })
}
