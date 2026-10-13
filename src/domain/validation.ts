/**
 * Hanya menyisakan isian yang benar-benar bergalat: `{ nama: 'Wajib', alamat: undefined }`
 * → `{ nama: 'Wajib' }`. Hasil kosong berarti semua isian valid.
 */
export function definedOnly<K extends string>(
  checks: Record<K, string | undefined>,
): Partial<Record<K, string>> {
  const result: Partial<Record<K, string>> = {}
  for (const key of Object.keys(checks) as K[]) {
    const message = checks[key]
    if (message !== undefined) result[key] = message
  }
  return result
}
