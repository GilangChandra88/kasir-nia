import { create } from 'zustand'

export type ToastTone = 'success' | 'error' | 'info'

export type Toast = {
  id: number
  message: string
  tone: ToastTone
}

type ToastState = {
  toasts: Toast[]
  show: (message: string, tone?: ToastTone) => void
  dismiss: (id: number) => void
}

/** Jumlah toast maksimal yang tampil bersamaan; yang lama tergeser. */
const MAX_VISIBLE = 3

let nextId = 1

/** Notifikasi singkat di atas layar ("Barang disimpan"). Ditampilkan oleh `Toaster`. */
export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  show: (message, tone = 'success') => {
    const toast = { id: nextId++, message, tone }
    set((state) => ({ toasts: [...state.toasts, toast].slice(-MAX_VISIBLE) }))
  },
  dismiss: (id) => {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
  },
}))
