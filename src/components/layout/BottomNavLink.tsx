import * as m from 'motion/react-m'
import { NavLink } from 'react-router'

import { SPRING } from '@/config/motion'

import type { NavItem } from './navTypes'

type BottomNavLinkProps = {
  item: NavItem
}

export function BottomNavLink({ item: { to, label, icon: Icon } }: BottomNavLinkProps) {
  return (
    <NavLink
      to={to}
      className="flex h-full flex-col items-center justify-center gap-1 text-xs font-medium text-muted transition-colors aria-[current=page]:font-bold aria-[current=page]:text-navy-950 md:h-20"
    >
      {({ isActive }) => (
        <>
          <span className="relative grid h-8 w-14 place-items-center">
            {/* Pil aktif meluncur antar tab karena berbagi layoutId yang sama. */}
            {isActive && (
              <m.span
                layoutId="nav-pill"
                className="absolute inset-0 rounded-full bg-navy-100"
                transition={SPRING.gentle}
              />
            )}
            <m.span
              key={String(isActive)}
              className="relative"
              initial={false}
              animate={isActive ? { scale: [1, 1.25, 1], y: [0, -3, 0] } : undefined}
              transition={{ duration: 0.35 }}
            >
              <Icon className="size-6" strokeWidth={isActive ? 2.4 : 2} aria-hidden="true" />
            </m.span>
          </span>
          {label}
        </>
      )}
    </NavLink>
  )
}
