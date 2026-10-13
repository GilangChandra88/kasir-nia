import { CircleUserRound, Package, ReceiptText, ScanBarcode } from 'lucide-react'

import type { NavItem } from '@/components/layout/navTypes'
import { ROUTES } from '@/config/routes'

/** Empat tab navbar bawah, urut sesuai rancangan. */
export const NAV_ITEMS: readonly NavItem[] = [
  { to: ROUTES.checkout, label: 'Kasir', icon: ScanBarcode },
  { to: ROUTES.history, label: 'Riwayat', icon: ReceiptText },
  { to: ROUTES.inventory, label: 'Stok', icon: Package },
  { to: ROUTES.profile, label: 'Profil', icon: CircleUserRound },
]
