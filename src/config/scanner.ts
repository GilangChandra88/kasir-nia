/**
 * Format barcode yang dicari kamera. Barang toko umumnya EAN-13/EAN-8/UPC; Code 128/39/ITF untuk
 * kode buatan distributor; QR untuk label buatan sendiri. Format yang tidak didukung perangkat
 * dilewati otomatis.
 */
export const SCAN_FORMATS = [
  'ean_13',
  'ean_8',
  'upc_a',
  'upc_e',
  'code_128',
  'code_39',
  'itf',
  'qr_code',
] as const

/** Jeda antar-pembacaan gambar kamera (milidetik). Lebih kecil = lebih cepat tapi boros baterai. */
export const SCAN_INTERVAL_MS = 120

/** Kode sama yang terbaca lagi dalam rentang ini dianggap pembacaan ulang kamera (milidetik). */
export const SCAN_DUPLICATE_WINDOW_MS = 1500

/** Lama bingkai hijau tampil sebelum scanner sekali-pakai menutup (milidetik). */
export const SCAN_SUCCESS_HOLD_MS = 450

/** Resolusi kamera yang diminta (piksel). Full HD agar barcode tetap tajam walau HP agak jauh. */
export const CAMERA_IDEAL_WIDTH_PX = 1920
export const CAMERA_IDEAL_HEIGHT_PX = 1080

/**
 * Zoom bawaan kamera (kali). Dengan zoom 2×, HP bisa dipegang lebih jauh (± 20–25 cm) — di luar
 * jarak fokus minimum lensa — sementara barcode tetap tampil besar. Ini kunci barcode tidak buram.
 */
export const CAMERA_DEFAULT_ZOOM = 2

/** Setelah ketuk-untuk-fokus, kembali ke fokus otomatis terus-menerus setelah jeda ini (milidetik). */
export const REFOCUS_RESET_MS = 1500

/**
 * Scanner fisik "mengetik" sangat cepat (± 5–30 ms per karakter); manusia jauh lebih lambat.
 * Jeda di atas ini (milidetik) dianggap ketikan manusia dan memulai ulang penampung.
 */
export const HARDWARE_SCANNER_MAX_GAP_MS = 50

/** Bunyi bip saat scan berhasil: frekuensi (Hz), lama (milidetik), volume (0–1). */
export const BEEP_FREQUENCY_HZ = 1760
export const BEEP_DURATION_MS = 90
export const BEEP_VOLUME = 0.12

/** Lama getar saat scan berhasil (milidetik). */
export const SCAN_VIBRATE_MS = 60
