import type { HTMLMotionProps } from 'motion/react'
import * as m from 'motion/react-m'
import type { ReactNode } from 'react'

import { PRESS_SCALE, SPRING } from '@/config/motion'

import { buttonClassName, type ButtonSize, type ButtonVariant } from './buttonStyles'
import { Spinner } from './Spinner'

type ButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  /** Menampilkan putaran & menonaktifkan tombol selama proses berjalan. */
  loading?: boolean
  children?: ReactNode
}

export function Button({
  variant,
  size,
  fullWidth,
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const isDisabled = disabled === true || loading

  return (
    // Default `type="button"` agar tombol di dalam form tidak mengirim form tanpa sengaja.
    <m.button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      whileTap={isDisabled ? undefined : { scale: PRESS_SCALE }}
      transition={SPRING.bouncy}
      className={buttonClassName({ variant, size, fullWidth, className })}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </m.button>
  )
}
