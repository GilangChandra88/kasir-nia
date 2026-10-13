import { useSyncExternalStore } from 'react'

import { KEYBOARD_MIN_HEIGHT_PX } from '@/config/layout'

function subscribe(onChange: () => void) {
  const viewport = window.visualViewport
  viewport?.addEventListener('resize', onChange)
  return () => {
    viewport?.removeEventListener('resize', onChange)
  }
}

function getSnapshot(): boolean {
  const viewport = window.visualViewport
  if (!viewport) return false
  return window.innerHeight - viewport.height > KEYBOARD_MIN_HEIGHT_PX
}

/** `true` saat keyboard layar HP terbuka (dipakai untuk menyembunyikan navbar bawah). */
export function useKeyboardOpen(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
