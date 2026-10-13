import * as m from 'motion/react-m'
import { Outlet, useLocation } from 'react-router'

import { ENTER_OFFSET_PX, SPRING } from '@/config/motion'

import { BottomNav } from './BottomNav'
import type { NavItem } from './navTypes'
import { OfflineBanner } from './OfflineBanner'

type AppShellProps = {
  navItems: readonly NavItem[]
}

/** Kerangka halaman utama: konten + navbar bawah. Ruang bawah disisakan agar konten tidak tertutup. */
export function AppShell({ navItems }: AppShellProps) {
  const { pathname } = useLocation()

  return (
    <div className="min-h-dvh md:pl-24">
      <OfflineBanner />
      <main className="mx-auto max-w-2xl px-4 pt-[max(env(safe-area-inset-top),1.25rem)] pb-[calc(6rem+env(safe-area-inset-bottom))] md:px-8 md:pt-8 md:pb-8">
        {/* Animasi masuk saja (tanpa animasi keluar) agar pindah tab terasa instan. */}
        <m.div
          key={pathname}
          initial={{ opacity: 0, y: ENTER_OFFSET_PX }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING.gentle}
        >
          <Outlet />
        </m.div>
      </main>
      <BottomNav items={navItems} />
    </div>
  )
}
