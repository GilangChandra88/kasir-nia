import { Clock, X } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/Badge'
import { ConfirmSheet } from '@/components/ui/ConfirmSheet'
import { IconButton } from '@/components/ui/IconButton'
import { cancelInvite } from '@/data/teamRepo'
import type { Invite } from '@/domain/types'
import { useAsyncAction } from '@/features/shared/useAsyncAction'
import { useIsOnline } from '@/lib/useConnectivity'
import { useToastStore } from '@/store/toastStore'

type InviteRowProps = {
  invite: Invite
}

/** Kasir yang sudah didaftarkan tapi belum pernah login. */
export function InviteRow({ invite }: InviteRowProps) {
  const online = useIsOnline()
  const showToast = useToastStore((state) => state.show)
  const [confirming, setConfirming] = useState(false)

  const cancel = useAsyncAction(async () => {
    await cancelInvite(invite.storeId, invite.email)
    setConfirming(false)
    showToast(`Undangan ${invite.displayName} dibatalkan`, 'info')
  })

  return (
    <div className="flex items-center gap-3 py-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-warning/15 text-navy-950">
        <Clock className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold">{invite.displayName}</p>
        <p className="truncate text-sm text-muted">{invite.email}</p>
        <div className="mt-1">
          <Badge tone="warning">Menunggu login pertama</Badge>
        </div>
      </div>
      <IconButton
        icon={X}
        label={`Batalkan undangan ${invite.displayName}`}
        tone="danger"
        disabled={!online}
        onClick={() => {
          setConfirming(true)
        }}
      />
      <ConfirmSheet
        open={confirming}
        title={`Batalkan undangan ${invite.displayName}?`}
        description={
          cancel.error ?? `${invite.email} tidak bisa lagi masuk sebagai kasir toko ini.`
        }
        confirmLabel="Ya, batalkan"
        tone="danger"
        loading={cancel.pending}
        onConfirm={() => void cancel.run()}
        onClose={() => {
          setConfirming(false)
        }}
      />
    </div>
  )
}
