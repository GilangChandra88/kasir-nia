/** Peran anggota toko. Pemilik mengelola segalanya, kasir hanya bertransaksi. */
export type Role = 'owner' | 'cashier'

/** Data akun Google yang dipakai aplikasi (bukan objek Firebase mentah). */
export type AuthUser = {
  uid: string
  displayName: string
  email: string
  photoURL: string | null
}

/** Isi dokumen `users/{uid}`: penghubung akun ke tokonya (1 akun = 1 toko). */
export type UserProfile = {
  storeId: string
  role: Role
}

/** Info toko yang ditampilkan di aplikasi & struk. */
export type StoreInfo = {
  id: string
  name: string
  ownerUid: string
  address: string | null
  phone: string | null
}

/**
 * Status sesi aplikasi. Setiap status punya tepat satu tujuan halaman (lihat `app/sessionRoutes.ts`).
 * - `needsStore`: sudah login tapi belum punya toko → halaman buat toko.
 * - `error`: misal akses dinonaktifkan pemilik atau data rusak.
 */
export type Session =
  | { status: 'loading' }
  | { status: 'signedOut' }
  | { status: 'needsStore'; user: AuthUser }
  | { status: 'ready'; user: AuthUser; profile: UserProfile; store: StoreInfo }
  | { status: 'error'; message: string; user: AuthUser | null }

export type SessionStatus = Session['status']
