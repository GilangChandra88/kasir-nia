/**
 * Status koneksi untuk UI:
 * - `offline`: tidak ada internet (hanya bisa melihat data).
 * - `reconnected`: baru tersambung lagi; tampil sebentar sebagai kabar baik, lalu jadi `online`.
 */
export type Connectivity = 'online' | 'offline' | 'reconnected'

type ConnectivitySource = {
  isOnline: () => boolean
  events: Pick<EventTarget, 'addEventListener' | 'removeEventListener'>
}

/**
 * Store kecil berbasis event `online`/`offline` untuk `useSyncExternalStore`.
 * `noticeMs` = lama status `reconnected` (milidetik).
 */
export function createConnectivityStore(source: ConnectivitySource, noticeMs: number) {
  let state: Connectivity = source.isOnline() ? 'online' : 'offline'
  let noticeTimer: ReturnType<typeof setTimeout> | undefined
  const listeners = new Set<() => void>()

  const setState = (next: Connectivity) => {
    state = next
    listeners.forEach((listener) => {
      listener()
    })
  }

  const handleOffline = () => {
    clearTimeout(noticeTimer)
    setState('offline')
  }

  const handleOnline = () => {
    if (state !== 'offline') return
    setState('reconnected')
    noticeTimer = setTimeout(() => {
      setState('online')
    }, noticeMs)
  }

  return {
    getSnapshot: () => state,
    subscribe: (listener: () => void) => {
      if (listeners.size === 0) {
        source.events.addEventListener('online', handleOnline)
        source.events.addEventListener('offline', handleOffline)
      }
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
        if (listeners.size > 0) return
        source.events.removeEventListener('online', handleOnline)
        source.events.removeEventListener('offline', handleOffline)
      }
    },
  }
}
