import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { AuthUser, Role } from '@/domain/types'

const ROLE_LABEL: Record<Role, string> = {
  owner: 'Pemilik',
  cashier: 'Kasir',
}

type AccountCardProps = {
  user: AuthUser
  role: Role
}

export function AccountCard({ user, role }: AccountCardProps) {
  return (
    <Card className="flex items-center gap-4">
      <Avatar name={user.displayName} photoURL={user.photoURL} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-bold">{user.displayName || 'Tanpa nama'}</p>
        <p className="truncate text-sm text-muted">{user.email}</p>
        <div className="mt-1.5">
          <Badge tone={role === 'owner' ? 'navy' : 'success'}>{ROLE_LABEL[role]}</Badge>
        </div>
      </div>
    </Card>
  )
}
