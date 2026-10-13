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
} as const

/** Alamat form ubah barang. */
export function productEditPath(productId: string): string {
  return `${ROUTES.inventory}/${encodeURIComponent(productId)}`
}
