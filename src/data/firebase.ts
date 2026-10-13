import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore'

import { readFirebaseConfig } from './env'

const app = initializeApp(readFirebaseConfig(import.meta.env))

export const auth = getAuth(app)
auth.languageCode = 'id'

// Cache lokal agar data tetap bisa DILIHAT saat sinyal hilang. Menyimpan tetap wajib online.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
})

export const googleProvider = new GoogleAuthProvider()
// Selalu tampilkan pilihan akun agar HP yang dipakai bergantian tidak salah akun.
googleProvider.setCustomParameters({ prompt: 'select_account' })
