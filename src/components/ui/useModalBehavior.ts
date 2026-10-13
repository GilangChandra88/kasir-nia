import { type RefObject, useEffect } from 'react'

/**
 * Perilaku standar jendela modal saat terbuka: tombol Escape menutup, halaman di belakang tidak ikut
 * tergulir, dan fokus pindah ke jendela (penting untuk pembaca layar & keyboard).
 */
export function useModalBehavior(
  open: boolean,
  onClose: () => void,
  panelRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [open, onClose, panelRef])
}
