import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Navigate } from 'react-router'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Sheet } from '@/components/ui/Sheet'
import { Skeleton } from '@/components/ui/Skeleton'
import { ROUTES } from '@/config/routes'
import { can } from '@/domain/permissions'
import { useReadySession } from '@/features/auth/useReadySession'

import { InviteForm } from './InviteForm'
import { TeamList } from './TeamList'
import { useTeam } from './useTeam'

/** Halaman "Kelola Kasir" (`/profil/kasir`). Khusus pemilik. */
export function TeamScreen() {
  const { profile, store, user } = useReadySession()
  const team = useTeam(store.id)
  const [inviting, setInviting] = useState(false)

  if (!can(profile.role, 'manageTeam')) return <Navigate to={ROUTES.profile} replace />

  const takenEmails =
    team.status === 'ready'
      ? [
          ...team.members.map((member) => member.email),
          ...team.invites.map((invite) => invite.email),
        ]
      : []

  return (
    <>
      <PageHeader
        title="Kelola Kasir"
        subtitle="Profil"
        backTo={ROUTES.profile}
        action={
          <Button
            size="sm"
            onClick={() => {
              setInviting(true)
            }}
          >
            <UserPlus className="size-4" aria-hidden="true" />
            Tambah
          </Button>
        }
      />

      <p className="mb-4 rounded-2xl bg-navy-50 p-4 text-sm text-navy-800">
        Daftarkan <strong>email Google</strong> kasir. Kasir cukup membuka aplikasi dan login dengan
        email itu — otomatis masuk ke toko ini.
      </p>

      {team.status === 'loading' && <Skeleton className="h-40" />}
      {team.status === 'error' && (
        <p role="alert" className="rounded-2xl bg-danger/10 p-4 text-sm text-danger">
          {team.message}
        </p>
      )}
      {team.status === 'ready' && (
        <TeamList storeId={store.id} members={team.members} invites={team.invites} />
      )}

      <Sheet
        open={inviting}
        onClose={() => {
          setInviting(false)
        }}
        title="Tambah kasir"
      >
        <InviteForm
          store={store}
          ownerUid={user.uid}
          takenEmails={takenEmails}
          onDone={() => {
            setInviting(false)
          }}
        />
      </Sheet>
    </>
  )
}
