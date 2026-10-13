import { AppShell } from '@/components/layout/AppShell'
import { ROUTES } from '@/config/routes'
import { useReadySession } from '@/features/auth/useReadySession'
import { useCartEntries } from '@/store/cartStore'

import { NAV_ITEMS } from './navigation'

/** Kerangka halaman utama + angka jumlah barang keranjang di tab Kasir. */
export function AppLayout() {
  const { store } = useReadySession()
  const entries = useCartEntries(store.id)
  const cartCount = entries.reduce((sum, entry) => sum + entry.qty, 0)
  const items = NAV_ITEMS.map((item) =>
    item.to === ROUTES.checkout ? { ...item, badge: cartCount } : item,
  )

  return <AppShell navItems={items} />
}
