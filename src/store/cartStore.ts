import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { addEntry, type CartEntry, setEntryQty } from '@/domain/cart'

type CartState = {
  /** Keranjang per toko (id toko → isi), agar akun lain di HP yang sama tidak melihatnya. */
  carts: Record<string, CartEntry[]>
  add: (storeId: string, productId: string, variantId: string) => void
  setQty: (storeId: string, productId: string, variantId: string, qty: number) => void
  clear: (storeId: string) => void
  /** Dipanggil saat keluar akun: HP bisa dipakai bergantian. */
  clearAll: () => void
}

const EMPTY: CartEntry[] = []

/**
 * Keranjang kasir. Disimpan di localStorage supaya tidak hilang saat aplikasi tertutup tak sengaja
 * di tengah melayani pembeli.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      carts: {},
      add: (storeId, productId, variantId) => {
        set((state) => ({
          carts: {
            ...state.carts,
            [storeId]: addEntry(state.carts[storeId] ?? EMPTY, productId, variantId),
          },
        }))
      },
      setQty: (storeId, productId, variantId, qty) => {
        set((state) => ({
          carts: {
            ...state.carts,
            [storeId]: setEntryQty(state.carts[storeId] ?? EMPTY, productId, variantId, qty),
          },
        }))
      },
      clear: (storeId) => {
        set((state) => ({ carts: { ...state.carts, [storeId]: EMPTY } }))
      },
      clearAll: () => {
        set({ carts: {} })
      },
    }),
    {
      name: 'nia-kasir:keranjang',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ carts }) => ({ carts }),
    },
  ),
)

/** Isi keranjang toko ini (array yang sama bila kosong agar tidak memicu render ulang). */
export function useCartEntries(storeId: string): CartEntry[] {
  return useCartStore((state) => state.carts[storeId] ?? EMPTY)
}
