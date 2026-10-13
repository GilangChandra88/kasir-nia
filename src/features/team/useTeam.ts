import { useEffect, useState } from 'react'

import { describeError } from '@/data/errors'
import { watchTeam } from '@/data/teamRepo'
import type { Invite, Member } from '@/domain/types'

export type TeamState =
  | { status: 'loading' }
  | { status: 'ready'; members: Member[]; invites: Invite[] }
  | { status: 'error'; message: string }

const LOADING: TeamState = { status: 'loading' }

/** Anggota & undangan toko secara realtime (khusus pemilik). */
export function useTeam(storeId: string): TeamState {
  const [state, setState] = useState<{ storeId: string; value: TeamState }>(() => ({
    storeId,
    value: LOADING,
  }))

  useEffect(
    () =>
      watchTeam(
        storeId,
        ({ members, invites }) => {
          setState({ storeId, value: { status: 'ready', members, invites } })
        },
        (error) => {
          setState({ storeId, value: { status: 'error', message: describeError(error) } })
        },
      ),
    [storeId],
  )

  return state.storeId === storeId ? state.value : LOADING
}
