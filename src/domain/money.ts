const NUMBER_FORMAT = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 })

/** Spasi tak-putus agar "Rp" tidak terpisah baris dari angkanya. */
const NBSP = ' '

/** Angka bulat dengan pemisah ribuan Indonesia: 30000 → "30.000". */
export function formatNumber(value: number): string {
  return NUMBER_FORMAT.format(value)
}

/** Rupiah (integer) untuk tampilan: 30000 → "Rp 30.000". */
export function formatRupiah(amount: number): string {
  return `Rp${NBSP}${formatNumber(amount)}`
}

/**
 * Membaca angka dari isian bebas ("30.000", "Rp 30000") dengan membuang selain digit.
 * Kosong → null. Angka di luar batas integer aman → null.
 */
export function parseDigits(text: string): number | null {
  const digits = text.replace(/\D/g, '')
  if (digits === '') return null
  const value = Number(digits)
  return Number.isSafeInteger(value) ? value : null
}
