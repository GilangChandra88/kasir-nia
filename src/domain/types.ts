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

/** Anggota toko (dokumen `stores/{id}/members/{uid}`). */
export type Member = {
  uid: string
  role: Role
  /** Nama panggilan dari pemilik; tampil di struk & riwayat. */
  displayName: string
  email: string
  isActive: boolean
}

/** Undangan kasir yang belum diklaim (dokumen `invites/{email}`). */
export type Invite = {
  email: string
  storeId: string
  storeName: string
  displayName: string
}

/** Isi tambahan struk yang diatur pemilik di Profil → Toko & Struk. */
export type ReceiptSettings = {
  /** Baris di bawah alamat, mis. "Buka 07.00–22.00". */
  headerNote: string | null
  /** Penutup struk, mis. "Terima kasih, datang lagi!". */
  footerNote: string
  showCashier: boolean
}

/** Info toko yang ditampilkan di aplikasi & struk. */
export type StoreInfo = {
  id: string
  name: string
  ownerUid: string
  address: string | null
  phone: string | null
  /** Stok di bawah atau sama dengan angka ini (satuan dasar) ditandai "menipis". */
  lowStockThreshold: number
  receipt: ReceiptSettings
}

/**
 * Jenis jual sebuah barang, mis. "1 bungkus" (isi 20 batang) atau "1 batang" (isi 1).
 * `price` dalam rupiah (integer), `baseQty` = berapa satuan dasar yang terpakai per 1 jenis ini.
 */
export type Variant = {
  id: string
  label: string
  price: number
  baseQty: number
}

/** Barang di stok. `stock` selalu dalam satuan dasar (`baseUnit`), mis. batang. */
export type Product = {
  id: string
  name: string
  category: string | null
  baseUnit: string
  barcode: string | null
  stock: number
  trackStock: boolean
  isActive: boolean
  variants: Variant[]
}

/** Data barang yang sudah divalidasi dan siap disimpan (tanpa id & stok). */
export type ProductInput = Pick<
  Product,
  'name' | 'category' | 'baseUnit' | 'barcode' | 'trackStock' | 'variants'
>

/**
 * Status sesi aplikasi. Setiap status punya tepat satu tujuan halaman (lihat `app/sessionRoutes.ts`).
 * - `needsStore`: sudah login tapi belum punya toko → halaman buat toko.
 * - `error`: misal akses dinonaktifkan pemilik atau data rusak.
 */
export type Session =
  | { status: 'loading' }
  | { status: 'signedOut' }
  | { status: 'needsStore'; user: AuthUser }
  | { status: 'ready'; user: AuthUser; profile: UserProfile; store: StoreInfo; member: Member }
  | { status: 'error'; message: string; user: AuthUser | null }

export type SessionStatus = Session['status']
