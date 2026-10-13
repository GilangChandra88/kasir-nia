import { create } from 'zustand'

import type { Session } from '@/domain/types'

type SessionState = {
  session: Session
  setSession: (session: Session) => void
}

/** Sesi global. Diisi oleh `useSessionSync` (satu-satunya penulis), dibaca di mana saja. */
export const useSessionStore = create<SessionState>()((set) => ({
  session: { status: 'loading' },
  setSession: (session) => {
    set({ session })
  },
}))
