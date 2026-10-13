import * as m from 'motion/react-m'
import { Outlet, useLocation } from 'react-router'

import { ENTER_OFFSET_PX, SPRING } from '@/config/motion'
import { cn } from '@/lib/cn'
import { useKeyboardOpen } from '@/lib/useKeyboardOpen'

import { BottomNav } from './BottomNav'
import type { NavItem } from './navTypes'
import { OfflineBanner } from './OfflineBanner'

type AppShellProps = {
  navItems: readonly NavItem[]
}

/**
 * Kerangka halaman utama: konten + navbar bawah.
 * `--nav-h` = tinggi navbar yang sedang menutupi bawah layar; dipakai konten & tombol menempel
 * (`bottom-above-nav`) agar tidak tertutup. Nol saat keyboard terbuka atau di layar lebar.
 */
export function AppShell({ navItems }: AppShellProps) {
  const { pathname } = useLocation()
  const keyboardOpen = useKeyboardOpen()

  return (
    <div className={cn('min-h-dvh md:pl-24', keyboardOpen ? '[--nav-h:0px]' : '[--nav-h:4rem]')}>
      <OfflineBanner />
      <main className="mx-auto max-w-2xl px-4 pt-[max(env(safe-area-inset-top),1.25rem)] pb-[calc(var(--nav-h)+env(safe-area-inset-bottom)+2rem)] md:px-8 md:pt-8 md:pb-8">
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
      <BottomNav items={navItems} hidden={keyboardOpen} />
    </div>
  )
}
