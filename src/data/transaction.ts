import { runTransaction, type Transaction } from 'firebase/firestore'

import { SAVE_TIMEOUT_MS } from '@/config/limits'
import { UserFacingError } from '@/domain/errors'
import { withTimeout } from '@/lib/withTimeout'

import { db } from './firebase'

/**
 * Semua penulisan memakai transaksi: transaksi GAGAL saat offline (bukan diam-diam mengantre),
 * sehingga yang dilihat pengguna selalu sama dengan yang tersimpan di server.
 */
export function runTimedTransaction<T>(work: (tx: Transaction) => Promise<T>): Promise<T> {
  return withTimeout(
    runTransaction(db, work),
    SAVE_TIMEOUT_MS,
    new UserFacingError('Gagal menyimpan karena koneksi lambat. Coba lagi.'),
  )
}
