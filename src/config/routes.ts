/** Alamat halaman (berbahasa Indonesia sesuai rancangan). */
export const ROUTES = {
  login: '/masuk',
  createStore: '/mulai',
  checkout: '/kasir',
  history: '/riwayat',
  inventory: '/stok',
  inventoryNew: '/stok/baru',
  inventoryEdit: '/stok/:productId',
  profile: '/profil',
  storeSettings: '/profil/toko',
} as const

/** Alamat form ubah barang. */
export function productEditPath(productId: string): string {
  return `${ROUTES.inventory}/${encodeURIComponent(productId)}`
}

/** Alamat form barang baru, opsional langsung berisi barcode hasil scan. */
export function newProductPath(barcode?: string): string {
  return barcode
    ? `${ROUTES.inventoryNew}?${new URLSearchParams({ barcode }).toString()}`
    : ROUTES.inventoryNew
}
