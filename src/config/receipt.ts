/** Isi bawaan struk untuk toko baru; pemilik bisa mengubahnya di Profil. */
export const DEFAULT_RECEIPT_SETTINGS: {
  headerNote: string | null
  footerNote: string
  showCashier: boolean
} = {
  headerNote: null,
  footerNote: 'Terima kasih, datang lagi!',
  showCashier: true,
}
