/**
 * Pecahan uang (rupiah) untuk tombol "uang cepat" di layar bayar. Total dibulatkan ke atas ke
 * kelipatan pecahan ini, mis. total 61.500 → 62.000, 65.000, 70.000, 100.000.
 */
export const CASH_ROUNDING_STEPS = [1_000, 5_000, 10_000, 50_000, 100_000] as const

/** Jumlah tombol uang cepat selain "Uang pas". */
export const QUICK_CASH_COUNT = 4
