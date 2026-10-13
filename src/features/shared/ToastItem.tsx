import { CircleAlert, CircleCheck, Info } from 'lucide-react'
import * as m from 'motion/react-m'
import { useEffect } from 'react'

import { SPRING, TOAST_DURATION_MS } from '@/config/motion'
import { cn } from '@/lib/cn'
import { type Toast, useToastStore } from '@/store/toastStore'

const ICONS = { success: CircleCheck, error: CircleAlert, info: Info } as const

const TONES = {
  success: 'bg-navy-950 text-white',
  error: 'bg-danger text-white',
  info: 'bg-white text-navy-950',
} as const

type ToastItemProps = {
  toast: Toast
}

export function ToastItem({ toast }: ToastItemProps) {
  const dismiss = useToastStore((state) => state.dismiss)
  const Icon = ICONS[toast.tone]

  useEffect(() => {
    const timer = setTimeout(() => {
      dismiss(toast.id)
    }, TOAST_DURATION_MS)
    return () => {
      clearTimeout(timer)
    }
  }, [dismiss, toast.id])

  return (
    <m.li
      layout
      initial={{ y: -40, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -20, opacity: 0, scale: 0.95 }}
      transition={SPRING.bouncy}
      className={cn(
        'pointer-events-auto flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lift',
        TONES[toast.tone],
      )}
      onClick={() => {
        dismiss(toast.id)
      }}
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      {toast.message}
    </m.li>
  )
}
