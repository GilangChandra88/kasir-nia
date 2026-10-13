import { LogOut } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { ConfirmSheet } from '@/components/ui/ConfirmSheet'
import { signOutUser } from '@/data/authRepo'
import { useAsyncAction } from '@/features/shared/useAsyncAction'

export function SignOutButton() {
  const [confirming, setConfirming] = useState(false)
  const { run, pending } = useAsyncAction(signOutUser)

  return (
    <>
      <Button
        variant="dangerOutline"
        size="lg"
        fullWidth
        onClick={() => {
          setConfirming(true)
        }}
      >
        <LogOut className="size-5" aria-hidden="true" />
        Keluar
      </Button>
      <ConfirmSheet
        open={confirming}
        title="Keluar dari akun?"
        description="Keranjang yang belum dibayar di HP ini akan hilang. Anda bisa masuk lagi kapan saja."
        confirmLabel="Ya, keluar"
        tone="danger"
        loading={pending}
        onConfirm={() => void run()}
        onClose={() => {
          setConfirming(false)
        }}
      />
    </>
  )
}
