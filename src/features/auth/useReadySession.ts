import type { Session } from '@/domain/types'
import { useSessionStore } from '@/store/sessionStore'

type ReadySession = Extract<Session, { status: 'ready' }>

/**
 * Sesi yang sudah siap (akun + toko). Hanya dipakai di halaman di balik `SessionGate allow="ready"`,
 * jadi status lain berarti ada kesalahan susunan rute.
 */
export function useReadySession(): ReadySession {
  const session = useSessionStore((state) => state.session)
  if (session.status !== 'ready') {
    throw new Error('useReadySession dipakai di luar halaman yang membutuhkan toko.')
  }
  return session
}
