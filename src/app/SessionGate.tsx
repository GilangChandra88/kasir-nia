import { Navigate, Outlet } from 'react-router'

import { SplashScreen } from '@/components/layout/SplashScreen'
import { SessionErrorScreen } from '@/features/auth/SessionErrorScreen'
import { useSessionStore } from '@/store/sessionStore'

import { homePathFor, type RoutableStatus } from './sessionRoutes'

type SessionGateProps = {
  /** Status sesi yang boleh membuka halaman di dalam gerbang ini. */
  allow: RoutableStatus
}

/** Penjaga rute: setiap status sesi hanya boleh berada di halamannya sendiri. */
export function SessionGate({ allow }: SessionGateProps) {
  const session = useSessionStore((state) => state.session)

  if (session.status === 'loading') return <SplashScreen />
  if (session.status === 'error') {
    return <SessionErrorScreen message={session.message} canSignOut={session.user !== null} />
  }
  if (session.status !== allow) return <Navigate to={homePathFor(session.status)} replace />
  return <Outlet />
}
