import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'

import { Card } from '@/components/ui/Card'
import { SPRING } from '@/config/motion'
import { sortMembers } from '@/domain/team'
import type { Invite, Member } from '@/domain/types'

import { InviteRow } from './InviteRow'
import { MemberRow } from './MemberRow'

type TeamListProps = {
  storeId: string
  members: Member[]
  invites: Invite[]
}

const rowMotion = {
  layout: true,
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -32 },
  transition: SPRING.gentle,
} as const

/** Anggota toko (pemilik, kasir aktif, nonaktif) lalu undangan yang menunggu login. */
export function TeamList({ storeId, members, invites }: TeamListProps) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="py-2">
        <h2 className="pt-2 text-sm font-semibold text-muted">Anggota toko</h2>
        <ul className="divide-y divide-line">
          <AnimatePresence initial={false}>
            {sortMembers(members).map((member) => (
              <m.li key={member.uid} {...rowMotion}>
                <MemberRow storeId={storeId} member={member} />
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
      </Card>

      {invites.length > 0 && (
        <Card className="py-2">
          <h2 className="pt-2 text-sm font-semibold text-muted">Menunggu login</h2>
          <ul className="divide-y divide-line">
            <AnimatePresence initial={false}>
              {invites.map((invite) => (
                <m.li key={invite.email} {...rowMotion}>
                  <InviteRow invite={invite} />
                </m.li>
              ))}
            </AnimatePresence>
          </ul>
        </Card>
      )}
    </div>
  )
}
