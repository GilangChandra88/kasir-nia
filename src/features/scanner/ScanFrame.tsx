import * as m from 'motion/react-m'

import { SPRING } from '@/config/motion'
import { cn } from '@/lib/cn'

type ScanFrameProps = {
  /** Bertambah setiap scan berhasil; memicu animasi "pop" hijau. */
  successCount: number
  /** Garis pindai hanya bergerak saat kamera benar-benar membaca. */
  scanning: boolean
}

const CORNERS = [
  'top-0 left-0 border-t-4 border-l-4 rounded-tl-3xl',
  'top-0 right-0 border-t-4 border-r-4 rounded-tr-3xl',
  'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-3xl',
  'bottom-0 right-0 border-b-4 border-r-4 rounded-br-3xl',
] as const

/** Bingkai bidik dengan latar redup di sekitarnya, garis pindai, dan kilat hijau saat berhasil. */
export function ScanFrame({ successCount, scanning }: ScanFrameProps) {
  const success = successCount > 0

  return (
    <m.div
      key={successCount}
      className="relative h-44 w-72 rounded-3xl scan-mask"
      initial={success ? { scale: 1.08 } : false}
      animate={{ scale: 1 }}
      transition={SPRING.bouncy}
    >
      {CORNERS.map((corner) => (
        <span
          key={corner}
          className={cn(
            'absolute size-10 transition-colors duration-300',
            success ? 'border-success' : 'border-white',
            corner,
          )}
        />
      ))}
      {scanning && (
        <span className="absolute inset-x-5 top-3 h-0.5 animate-scan-line rounded-full bg-success shadow-[0_0_12px] shadow-success" />
      )}
      {success && (
        <m.span
          className="absolute inset-0 rounded-3xl bg-success/25"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </m.div>
  )
}
