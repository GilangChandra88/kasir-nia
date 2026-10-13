import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createConnectivityStore } from './connectivity'

const NOTICE_MS = 2000

function setup(initiallyOnline: boolean) {
  const events = new EventTarget()
  const store = createConnectivityStore({ isOnline: () => initiallyOnline, events }, NOTICE_MS)
  const listener = vi.fn()
  const unsubscribe = store.subscribe(listener)
  const fire = (type: 'online' | 'offline') => events.dispatchEvent(new Event(type))
  return { store, listener, unsubscribe, fire }
}

describe('createConnectivityStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('mengikuti status awal perangkat', () => {
    expect(setup(true).store.getSnapshot()).toBe('online')
    expect(setup(false).store.getSnapshot()).toBe('offline')
  })

  it('menjadi offline saat sinyal hilang dan memberi tahu pendengar', () => {
    const { store, listener, fire } = setup(true)
    fire('offline')
    expect(store.getSnapshot()).toBe('offline')
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('menampilkan "tersambung lagi" sebentar lalu kembali online', () => {
    const { store, fire } = setup(false)
    fire('online')
    expect(store.getSnapshot()).toBe('reconnected')
    vi.advanceTimersByTime(NOTICE_MS)
    expect(store.getSnapshot()).toBe('online')
  })

  it('tidak menampilkan "tersambung lagi" bila memang sudah online', () => {
    const { store, fire } = setup(true)
    fire('online')
    expect(store.getSnapshot()).toBe('online')
  })

  it('putus lagi saat masih "tersambung lagi" langsung kembali offline', () => {
    const { store, fire } = setup(false)
    fire('online')
    fire('offline')
    vi.advanceTimersByTime(NOTICE_MS)
    expect(store.getSnapshot()).toBe('offline')
  })

  it('berhenti mendengar event setelah pendengar terakhir pergi', () => {
    const { store, listener, unsubscribe, fire } = setup(true)
    unsubscribe()
    fire('offline')
    expect(listener).not.toHaveBeenCalled()
    expect(store.getSnapshot()).toBe('online')
  })
})
