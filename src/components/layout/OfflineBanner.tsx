import { Wifi, WifiOff } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'

import { SPRING } from '@/config/motion'
import { cn } from '@/lib/cn'
import { useConnectivity } from '@/lib/useConnectivity'

/** Banner atas: peringatan saat offline, lalu kabar hijau singkat saat tersambung lagi. */
export function OfflineBanner() {
  const connectivity = useConnectivity()
  const offline = connectivity === 'offline'

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-[max(env(safe-area-inset-top),0.75rem)]"
    >
      <AnimatePresence>
        {connectivity !== 'online' && (
          <m.div
            key={connectivity}
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={SPRING.gentle}
            className={cn(
              'flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-lift',
              offline ? 'bg-warning text-navy-950' : 'bg-success text-white',
            )}
          >
            {offline ? (
              <WifiOff className="size-4" aria-hidden="true" />
            ) : (
              <Wifi className="size-4" aria-hidden="true" />
            )}
            {offline ? 'Tidak ada internet. Anda hanya bisa melihat data.' : 'Kembali online'}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
