import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'dangerOutline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

const BASE =
  'inline-flex select-none items-center justify-center gap-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-navy-950 text-white shadow-soft enabled:hover:bg-navy-800',
  secondary: 'border border-line bg-white text-navy-950 shadow-soft enabled:hover:bg-navy-50',
  danger: 'bg-danger text-white shadow-soft enabled:hover:opacity-90',
  dangerOutline: 'border border-danger/30 bg-white text-danger enabled:hover:bg-danger/5',
  ghost: 'text-navy-800 enabled:hover:bg-navy-50',
}

// Tinggi minimal 40 px (sm) agar tetap nyaman disentuh; md/lg untuk aksi utama.
const SIZES: Record<ButtonSize, string> = {
  sm: 'h-10 rounded-xl px-4 text-sm',
  md: 'h-12 rounded-2xl px-5 text-base',
  lg: 'h-14 rounded-2xl px-6 text-base',
}

type ButtonClassOptions = {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  className?: string
}

export function buttonClassName({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: ButtonClassOptions): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className)
}
