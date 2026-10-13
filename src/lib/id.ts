/** Id acak unik untuk data lokal (mis. id jenis barang). Bukan untuk keamanan. */
export function createId(): string {
  return crypto.randomUUID()
}
