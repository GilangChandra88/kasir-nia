import { AnimatePresence, type PanInfo } from 'motion/react'
import * as m from 'motion/react-m'
import { type ReactNode, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

import { SHEET_DISMISS_OFFSET_PX, SHEET_DISMISS_VELOCITY, SPRING } from '@/config/motion'

import { useModalBehavior } from './useModalBehavior'

type SheetProps = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
}

/**
 * Bottom sheet ala aplikasi: naik dengan pegas, latar redup, bisa ditarik turun untuk menutup.
 * Di layar lebar tampil sebagai dialog di tengah.
 */
export function Sheet({ open, onClose, title, description, children }: SheetProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  useModalBehavior(open, onClose, panelRef)

  const handleDragEnd = (_event: PointerEvent, info: PanInfo) => {
    if (info.offset.y > SHEET_DISMISS_OFFSET_PX || info.velocity.y > SHEET_DISMISS_VELOCITY) {
      onClose()
    }
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          key="sheet"
          className="fixed inset-0 z-50 flex items-end justify-center md:items-center"
        >
          <m.div
            className="absolute inset-0 bg-navy-950/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="relative w-full max-w-md rounded-t-3xl bg-card px-5 pt-3 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-lift outline-none md:rounded-3xl md:pb-5"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={SPRING.gentle}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={handleDragEnd}
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line" aria-hidden="true" />
            <h2 id={titleId} className="text-lg font-bold">
              {title}
            </h2>
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
            <div className="mt-5">{children}</div>
          </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
