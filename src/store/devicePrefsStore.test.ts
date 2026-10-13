import { beforeEach, describe, expect, it } from 'vitest'

import { useDevicePrefsStore } from './devicePrefsStore'

describe('useDevicePrefsStore', () => {
  beforeEach(() => {
    useDevicePrefsStore.setState({ scanBeep: true, scanVibrate: true })
  })

  it('bip dan getar menyala secara bawaan', () => {
    const { scanBeep, scanVibrate } = useDevicePrefsStore.getState()
    expect(scanBeep).toBe(true)
    expect(scanVibrate).toBe(true)
  })

  it('setScanBeep mematikan bunyi tanpa mengubah getar', () => {
    useDevicePrefsStore.getState().setScanBeep(false)
    expect(useDevicePrefsStore.getState()).toMatchObject({ scanBeep: false, scanVibrate: true })
  })

  it('setScanVibrate mematikan getar tanpa mengubah bunyi', () => {
    useDevicePrefsStore.getState().setScanVibrate(false)
    expect(useDevicePrefsStore.getState()).toMatchObject({ scanBeep: true, scanVibrate: false })
  })
})
