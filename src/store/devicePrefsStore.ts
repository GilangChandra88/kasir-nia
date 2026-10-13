import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type DevicePrefsState = {
  /** Bunyi bip saat scan berhasil. */
  scanBeep: boolean
  /** Getar saat scan berhasil. */
  scanVibrate: boolean
  setScanBeep: (on: boolean) => void
  setScanVibrate: (on: boolean) => void
}

/**
 * Pengaturan milik HP ini saja (bukan toko), disimpan di localStorage.
 * Bila penyimpanan diblokir browser, nilai bawaan tetap dipakai.
 */
export const useDevicePrefsStore = create<DevicePrefsState>()(
  persist(
    (set) => ({
      scanBeep: true,
      scanVibrate: true,
      setScanBeep: (on) => {
        set({ scanBeep: on })
      },
      setScanVibrate: (on) => {
        set({ scanVibrate: on })
      },
    }),
    {
      name: 'nia-kasir:perangkat',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ scanBeep, scanVibrate }) => ({ scanBeep, scanVibrate }),
    },
  ),
)
