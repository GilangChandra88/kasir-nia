/** Panjang nama toko (karakter, setelah spasi di tepi dibuang). Juga dijaga di firestore.rules. */
export const STORE_NAME_MIN_LENGTH = 2
export const STORE_NAME_MAX_LENGTH = 40

/** Batas stok menipis bawaan untuk toko baru (satuan dasar barang). */
export const DEFAULT_LOW_STOCK_THRESHOLD = 5

/** Batas waktu menunggu Firestore saat menyimpan (milidetik); lewat dari ini dianggap gagal. */
export const SAVE_TIMEOUT_MS = 10_000
