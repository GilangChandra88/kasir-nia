import { useState } from 'react'

import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmSheet } from '@/components/ui/ConfirmSheet'
import { setMemberActive } from '@/data/teamRepo'
import type { Member } from '@/domain/types'
import { useAsyncAction } from '@/features/shared/useAsyncAction'
import { cn } from '@/lib/cn'
import { useIsOnline } from '@/lib/useConnectivity'
import { useToastStore } from '@/store/toastStore'

type MemberRowProps = {
  storeId: string
  member: Member
}

export function MemberRow({ storeId, member }: MemberRowProps) {
  const online = useIsOnline()
  const showToast = useToastStore((state) => state.show)
  const [confirming, setConfirming] = useState(false)
  const isOwner = member.role === 'owner'

  const toggle = useAsyncAction(async (isActive: boolean) => {
    await setMemberActive(storeId, member.uid, isActive)
    setConfirming(false)
    showToast(
      isActive ? `${member.displayName} aktif lagi` : `${member.displayName} dinonaktifkan`,
      isActive ? 'success' : 'info',
    )
  })

  return (
    <div className={cn('flex items-center gap-3 py-3', !member.isActive && 'opacity-60')}>
      <Avatar name={member.displayName} photoURL={null} size="md" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold">{member.displayName}</p>
        <p className="truncate text-sm text-muted">{member.email}</p>
        <div className="mt-1">
          {isOwner && <Badge>Pemilik</Badge>}
          {!isOwner && (
            <Badge tone={member.isActive ? 'success' : 'muted'}>
              {member.isActive ? 'Kasir aktif' : 'Nonaktif'}
            </Badge>
          )}
        </div>
      </div>
      {!isOwner && (
        <Button
          size="sm"
          variant={member.isActive ? 'dangerOutline' : 'secondary'}
          disabled={!online}
          loading={toggle.pending && !confirming}
          onClick={() => {
            if (member.isActive) setConfirming(true)
            else void toggle.run(true)
          }}
        >
          {member.isActive ? 'Nonaktifkan' : 'Aktifkan'}
        </Button>
      )}
      <ConfirmSheet
        open={confirming}
        title={`Nonaktifkan ${member.displayName}?`}
        description={
          toggle.error ??
          'Akses kasir ini langsung terputus. Riwayat transaksinya tetap aman, dan bisa diaktifkan lagi kapan saja.'
        }
        confirmLabel="Ya, nonaktifkan"
        tone="danger"
        loading={toggle.pending}
        onConfirm={() => void toggle.run(false)}
        onClose={() => {
          setConfirming(false)
        }}
      />
    </div>
  )
}
