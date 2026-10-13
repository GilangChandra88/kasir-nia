import { cn } from '@/lib/cn'

import { BottomNavLink } from './BottomNavLink'
import type { NavItem } from './navTypes'

type BottomNavProps = {
  items: readonly NavItem[]
  /** Disembunyikan (meluncur turun) saat keyboard terbuka agar tidak menutupi isian. */
  hidden?: boolean
}

/**
 * Navbar bawah ala aplikasi di HP; berubah menjadi sidebar kiri di layar ≥ 768 px.
 * Padding bawah mengikuti area aman layar (gesture bar Android / home indicator).
 */
export function BottomNav({ items, hidden = false }: BottomNavProps) {
  return (
    <nav
      aria-label="Navigasi utama"
      aria-hidden={hidden || undefined}
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 rounded-t-3xl border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom)] shadow-lift backdrop-blur transition-transform duration-200 md:inset-x-auto md:inset-y-0 md:left-0 md:w-24 md:translate-y-0 md:rounded-none md:rounded-r-3xl md:border-t-0 md:border-r md:pb-0',
        hidden && 'translate-y-full',
      )}
    >
      <ul className="mx-auto flex h-16 max-w-md md:h-full md:flex-col md:justify-center md:gap-2">
        {items.map((item) => (
          <li key={item.to} className="flex-1 md:flex-none">
            <BottomNavLink item={item} />
          </li>
        ))}
      </ul>
    </nav>
  )
}
