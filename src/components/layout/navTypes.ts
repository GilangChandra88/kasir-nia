import type { LucideIcon } from 'lucide-react'

/** Satu tab di navbar bawah. */
export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  /** Angka kecil di pojok ikon (mis. jumlah barang di keranjang); 0 = disembunyikan. */
  badge?: number
}
