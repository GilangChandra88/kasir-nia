import { ROUTES } from '@/config/routes'
import type { SessionStatus } from '@/domain/types'

/** Status sesi yang punya halaman tujuan sendiri (memuat & galat ditampilkan di tempat). */
export type RoutableStatus = Exclude<SessionStatus, 'loading' | 'error'>

const HOME_BY_STATUS: Record<RoutableStatus, string> = {
  signedOut: ROUTES.login,
  needsStore: ROUTES.createStore,
  ready: ROUTES.checkout,
}

/** Halaman yang seharusnya dibuka untuk status sesi tertentu. */
export function homePathFor(status: RoutableStatus): string {
  return HOME_BY_STATUS[status]
}
