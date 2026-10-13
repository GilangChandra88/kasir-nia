/** Penampung ketikan untuk mengenali scanner fisik (mode keyboard/HID). Waktu dalam milidetik. */
export type KeyBuffer = { chars: string; lastAt: number }

export const EMPTY_KEY_BUFFER: KeyBuffer = { chars: '', lastAt: Number.NEGATIVE_INFINITY }

type KeyBufferOptions = {
  /** Jeda maksimal antar-karakter agar dianggap satu tembakan scanner. */
  maxGapMs: number
  /** Panjang minimal kode agar Enter dianggap hasil scan. */
  minLength: number
}

/**
 * Memproses satu tombol. Karakter yang datang cepat dikumpulkan; jeda lama memulai ulang
 * (ketikan manusia). Enter mengakhiri: bila cukup panjang → `scanned` berisi kode.
 */
export function pushKey(
  buffer: KeyBuffer,
  key: string,
  now: number,
  { maxGapMs, minLength }: KeyBufferOptions,
): { buffer: KeyBuffer; scanned: string | null } {
  if (key === 'Enter') {
    const fast = now - buffer.lastAt <= maxGapMs
    const scanned = fast && buffer.chars.length >= minLength ? buffer.chars : null
    return { buffer: EMPTY_KEY_BUFFER, scanned }
  }

  // Tombol non-karakter (Shift, Alt, ...) diabaikan tanpa memutus tembakan.
  if (key.length !== 1) return { buffer, scanned: null }

  const continues = now - buffer.lastAt <= maxGapMs
  return {
    buffer: { chars: continues ? buffer.chars + key : key, lastAt: now },
    scanned: null,
  }
}
