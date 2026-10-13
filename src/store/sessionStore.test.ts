import { beforeEach, describe, expect, it } from 'vitest'

import type { Session } from '@/domain/types'

import { useSessionStore } from './sessionStore'

const user = { uid: 'u1', displayName: 'Sari', email: 'sari@contoh.id', photoURL: null }

describe('useSessionStore', () => {
  beforeEach(() => {
    useSessionStore.setState({ session: { status: 'loading' } })
  })

  it('mulai dalam status memuat', () => {
    expect(useSessionStore.getState().session).toEqual({ status: 'loading' })
  })

  it('setSession mengganti sesi sepenuhnya', () => {
    const ready: Session = {
      status: 'ready',
      user,
      profile: { storeId: 't1', role: 'owner' },
      store: { id: 't1', name: 'Toko Nia', ownerUid: 'u1', address: null, phone: null },
    }
    useSessionStore.getState().setSession(ready)
    expect(useSessionStore.getState().session).toEqual(ready)

    useSessionStore.getState().setSession({ status: 'signedOut' })
    expect(useSessionStore.getState().session).toEqual({ status: 'signedOut' })
  })
})
