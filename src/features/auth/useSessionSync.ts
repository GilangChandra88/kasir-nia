import { useEffect } from 'react'

import { watchSession } from '@/data/sessionRepo'
import { useSessionStore } from '@/store/sessionStore'

/** Menyambungkan Firebase ke store sesi. Dipanggil sekali di akar aplikasi. */
export function useSessionSync() {
  const setSession = useSessionStore((state) => state.setSession)

  useEffect(() => watchSession(setSession), [setSession])
}
