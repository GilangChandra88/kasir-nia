import type { Variants } from 'motion/react'

import { ENTER_OFFSET_PX, SPRING, STAGGER_SECONDS } from '@/config/motion'

/** Induk yang memunculkan anak-anaknya bertahap. Pakai bersama `fadeUpItem` dengan `initial="hidden"`. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER_SECONDS, delayChildren: 0.15 } },
}

/** Anak yang muncul sambil naik sedikit. */
export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: ENTER_OFFSET_PX },
  show: { opacity: 1, y: 0, transition: SPRING.gentle },
}

/** Ilustrasi yang "meletup" muncul dengan pegas. */
export const popInItem: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: { opacity: 1, scale: 1, transition: SPRING.bouncy },
}
