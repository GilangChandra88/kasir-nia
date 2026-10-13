/**
 * Balasan untuk satu hasil scan, ditampilkan di layar scanner mode beruntun.
 * `close` = tutup scanner (mis. perlu memilih jenis barang dulu).
 */
export type ScanFeedback = {
  tone: 'success' | 'error'
  text: string
  close?: boolean
}

/** Penerima hasil scan. Mengembalikan balasan, atau `undefined` bila tidak perlu pesan khusus. */
export type ScanHandler = (code: string) => ScanFeedback | undefined
