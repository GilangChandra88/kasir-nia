/** Panjang nama toko (karakter, setelah spasi di tepi dibuang). Juga dijaga di firestore.rules. */
export const STORE_NAME_MIN_LENGTH = 2
export const STORE_NAME_MAX_LENGTH = 40

/** Batas stok menipis bawaan untuk toko baru (satuan dasar barang). */
export const DEFAULT_LOW_STOCK_THRESHOLD = 5

/** Batas waktu menunggu Firestore saat menyimpan (milidetik); lewat dari ini dianggap gagal. */
export const SAVE_TIMEOUT_MS = 10_000

/** Panjang teks barang (karakter). Nama juga dijaga di firestore.rules. */
export const PRODUCT_NAME_MIN_LENGTH = 2
export const PRODUCT_NAME_MAX_LENGTH = 60
export const CATEGORY_MAX_LENGTH = 30
export const BASE_UNIT_MAX_LENGTH = 20
export const VARIANT_LABEL_MAX_LENGTH = 30

/** Panjang barcode (karakter). EAN-13 = 13; kode buatan toko boleh lebih pendek. */
export const BARCODE_MIN_LENGTH = 3
export const BARCODE_MAX_LENGTH = 64

/** Jumlah jenis per barang. Juga dijaga di firestore.rules. */
export const MAX_VARIANTS = 10

/** Harga tertinggi per jenis (rupiah). Mencegah salah ketik nol berlebih. */
export const MAX_PRICE = 100_000_000

/** Isi satu jenis tertinggi (satuan dasar), mis. 1 dus = 1.000 batang. */
export const MAX_BASE_QTY = 10_000

/** Stok tertinggi per barang (satuan dasar). */
export const MAX_STOCK = 10_000_000
