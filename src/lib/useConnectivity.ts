import { useSyncExternalStore } from 'react'

import { ONLINE_NOTICE_MS } from '@/config/motion'

import { type Connectivity, createConnectivityStore } from './connectivity'

const store = createConnectivityStore(
  { isOnline: () => navigator.onLine, events: window },
  ONLINE_NOTICE_MS,
)

/** Status koneksi perangkat: `online`, `offline`, atau `reconnected` (baru tersambung lagi). */
export function useConnectivity(): Connectivity {
  return useSyncExternalStore(store.subscribe, store.getSnapshot)
}

/** `true` bila bisa menyimpan ke server (tidak offline). */
export function useIsOnline(): boolean {
  return useConnectivity() !== 'offline'
}
