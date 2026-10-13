import { STORE_NAME_MAX_LENGTH, STORE_NAME_MIN_LENGTH } from '@/config/limits'

export type StoreNameResult = { ok: true; value: string } | { ok: false; message: string }

/**
 * Merapikan & memeriksa nama toko: spasi di tepi dibuang, spasi ganda dirapatkan.
 * Masukan: teks bebas dari form. Keluaran: nama siap simpan atau pesan galat berbahasa Indonesia.
 */
export function validateStoreName(input: string): StoreNameResult {
  const value = input.trim().replace(/\s+/g, ' ')

  if (value.length < STORE_NAME_MIN_LENGTH) {
    return { ok: false, message: `Nama toko minimal ${STORE_NAME_MIN_LENGTH} huruf.` }
  }
  if (value.length > STORE_NAME_MAX_LENGTH) {
    return { ok: false, message: `Nama toko maksimal ${STORE_NAME_MAX_LENGTH} huruf.` }
  }
  return { ok: true, value }
}
