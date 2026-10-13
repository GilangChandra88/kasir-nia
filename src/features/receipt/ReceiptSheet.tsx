import * as m from 'motion/react-m'

import { Button } from '@/components/ui/Button'
import { Sheet } from '@/components/ui/Sheet'
import { SPRING } from '@/config/motion'
import type { ReceiptModel } from '@/domain/receipt'

import { ReceiptPaper } from './ReceiptPaper'

type ReceiptSheetProps = {
  receipt: ReceiptModel
  open: boolean
  onClose: () => void
}

/** Jarak kertas struk "keluar" dari mesin saat muncul (piksel). */
const PRINT_OFFSET_PX = -48

/** Struk di layar. Kertasnya meluncur turun seperti keluar dari mesin kasir. */
export function ReceiptSheet({ receipt, open, onClose }: ReceiptSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title="Struk" elevated>
      <div className="overflow-hidden rounded-2xl bg-paper px-4 pt-2 pb-6">
        {/* Celah "mulut printer" tempat struk keluar. */}
        <div className="mx-auto mb-1 h-1.5 w-56 rounded-full bg-navy-950/80" aria-hidden="true" />
        <m.div
          initial={{ y: PRINT_OFFSET_PX, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...SPRING.gentle, delay: 0.15 }}
        >
          <ReceiptPaper receipt={receipt} />
        </m.div>
      </div>
      <Button variant="secondary" size="lg" fullWidth className="mt-4" onClick={onClose}>
        Tutup
      </Button>
    </Sheet>
  )
}
