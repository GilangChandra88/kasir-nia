import { UserFacingError } from '@/domain/errors'

const MESSAGES: Record<string, string> = {
  'auth/network-request-failed': 'Tidak ada internet. Periksa koneksi lalu coba lagi.',
  unavailable: 'Tidak ada internet. Periksa koneksi lalu coba lagi.',
  'auth/unauthorized-domain':
    'Alamat web ini belum diizinkan untuk login. Tambahkan di Firebase Console → Authentication → Settings → Authorized domains.',
  'auth/operation-not-allowed':
    'Login Google belum diaktifkan. Aktifkan di Firebase Console → Authentication → Sign-in method.',
  'auth/too-many-requests': 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.',
  'auth/user-disabled': 'Akun ini dinonaktifkan.',
  'permission-denied': 'Anda tidak punya akses ke data ini.',
}

const FALLBACK_MESSAGE = 'Terjadi kesalahan. Coba lagi sebentar lagi.'

/** Login dibatalkan sendiri oleh pengguna (menutup jendela Google) — bukan galat yang perlu ditampilkan. */
const CANCELLED_CODES = new Set(['auth/popup-closed-by-user', 'auth/cancelled-popup-request'])

/** Mengambil kode galat Firebase (`auth/...` atau kode Firestore) tanpa bergantung pada kelas Firebase. */
export function errorCode(error: unknown): string | null {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return typeof error.code === 'string' ? error.code : null
  }
  return null
}

export function isCancelledSignIn(error: unknown): boolean {
  return CANCELLED_CODES.has(errorCode(error) ?? '')
}

/** Mengubah galat apa pun menjadi kalimat Bahasa Indonesia yang aman ditampilkan. */
export function describeError(error: unknown): string {
  if (error instanceof UserFacingError) return error.message
  const code = errorCode(error)
  return (code && MESSAGES[code]) ?? FALLBACK_MESSAGE
}
