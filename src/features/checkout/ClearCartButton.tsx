import { Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { ConfirmSheet } from '@/components/ui/ConfirmSheet'

type ClearCartButtonProps = {
  onClear: () => void
}

export function ClearCartButton({ onClear }: ClearCartButtonProps) {
  const [confirming, setConfirming] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setConfirming(true)
        }}
      >
        <Trash2 className="size-4" aria-hidden="true" />
        Kosongkan
      </Button>
      <ConfirmSheet
        open={confirming}
        title="Kosongkan keranjang?"
        description="Semua barang di keranjang dihapus. Stok tidak berubah karena belum dibayar."
        confirmLabel="Ya, kosongkan"
        tone="danger"
        onConfirm={() => {
          onClear()
          setConfirming(false)
        }}
        onClose={() => {
          setConfirming(false)
        }}
      />
    </>
  )
}
