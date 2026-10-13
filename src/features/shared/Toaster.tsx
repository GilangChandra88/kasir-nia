import { AnimatePresence } from 'motion/react'

import { useToastStore } from '@/store/toastStore'

import { ToastItem } from './ToastItem'

/** Wadah toast di atas layar. Dipasang sekali di akar aplikasi. */
export function Toaster() {
  const toasts = useToastStore((state) => state.toasts)

  return (
    <ol
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 px-4 pt-[max(env(safe-area-inset-top),0.75rem)]"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </ol>
  )
}
