/**
 * Preset animasi. Semua animasi hanya menggerakkan transform & opacity agar ringan di HP.
 * Durasi dalam detik (satuan yang dipakai library `motion`).
 */
export const SPRING = {
  /** Gerak lembut untuk masuknya konten. */
  gentle: { type: 'spring', stiffness: 260, damping: 24 },
  /** Sedikit memantul untuk hal "lucu": tombol, ikon, item masuk keranjang. */
  bouncy: { type: 'spring', stiffness: 420, damping: 16 },
} as const

/** Jeda antar-anak saat muncul bertahap (detik). */
export const STAGGER_SECONDS = 0.07

/** Skala tombol saat ditekan (rasio, 1 = ukuran asli). */
export const PRESS_SCALE = 0.97

/** Jarak geser vertikal saat konten muncul (piksel). */
export const ENTER_OFFSET_PX = 12

/** Lama kabar "Kembali online" tampil sebelum hilang (milidetik). */
export const ONLINE_NOTICE_MS = 2500

/** Bottom sheet ditutup bila ditarik turun sejauh ini (piksel) atau secepat ini (piksel/detik). */
export const SHEET_DISMISS_OFFSET_PX = 120
export const SHEET_DISMISS_VELOCITY = 600
