import { Button } from './Button'
import { Sheet } from './Sheet'

type ConfirmSheetProps = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  tone?: 'primary' | 'danger'
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

/** Konfirmasi sebelum aksi penting (keluar, hapus). Tombol utama di bawah agar dekat jempol. */
export function ConfirmSheet({
  open,
  title,
  description,
  confirmLabel,
  tone = 'primary',
  loading = false,
  onConfirm,
  onClose,
}: ConfirmSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title={title} description={description}>
      <div className="flex flex-col gap-2">
        <Button
          variant={tone === 'danger' ? 'danger' : 'primary'}
          size="lg"
          fullWidth
          loading={loading}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
        <Button variant="ghost" size="lg" fullWidth disabled={loading} onClick={onClose}>
          Batal
        </Button>
      </div>
    </Sheet>
  )
}
