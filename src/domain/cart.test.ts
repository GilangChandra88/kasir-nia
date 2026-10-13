import { describe, expect, it } from 'vitest'

import { MAX_LINE_QTY } from '@/config/limits'

import {
  addEntry,
  baseNeeded,
  type CartEntry,
  cartKey,
  remainingStock,
  resolveCart,
  setEntryQty,
} from './cart'
import type { Product } from './types'

const rokok: Product = {
  id: 'r',
  name: 'Rokok A',
  category: null,
  baseUnit: 'batang',
  barcode: null,
  stock: 45,
  trackStock: true,
  isActive: true,
  variants: [
    { id: 'bks', label: '1 bungkus', price: 30000, baseQty: 20 },
    { id: 'btg', label: '1 batang', price: 2000, baseQty: 1 },
  ],
}

const jasa: Product = {
  ...rokok,
  id: 'j',
  name: 'Isi ulang galon',
  baseUnit: 'kali',
  stock: 0,
  trackStock: false,
  variants: [{ id: 'x', label: '1 kali', price: 5000, baseQty: 1 }],
}

describe('addEntry & setEntryQty', () => {
  it('menambah baris baru dengan jumlah 1', () => {
    expect(addEntry([], 'r', 'bks')).toEqual([{ productId: 'r', variantId: 'bks', qty: 1 }])
  })

  it('jenis yang sama menambah jumlah, bukan baris baru', () => {
    const cart = addEntry(addEntry([], 'r', 'bks'), 'r', 'bks')
    expect(cart).toEqual([{ productId: 'r', variantId: 'bks', qty: 2 }])
  })

  it('jenis berbeda dari barang yang sama menjadi baris terpisah', () => {
    const cart = addEntry(addEntry([], 'r', 'bks'), 'r', 'btg')
    expect(cart.map((entry) => cartKey(entry.productId, entry.variantId))).toEqual([
      'r:bks',
      'r:btg',
    ])
  })

  it('jumlah 0 menghapus baris', () => {
    expect(setEntryQty([{ productId: 'r', variantId: 'bks', qty: 2 }], 'r', 'bks', 0)).toEqual([])
  })

  it('jumlah dibatasi maksimal', () => {
    const cart = setEntryQty([{ productId: 'r', variantId: 'btg', qty: 1 }], 'r', 'btg', 5000)
    expect(cart[0]?.qty).toBe(MAX_LINE_QTY)
  })
})

describe('baseNeeded & remainingStock', () => {
  const cart: CartEntry[] = [
    { productId: 'r', variantId: 'bks', qty: 1 },
    { productId: 'r', variantId: 'btg', qty: 3 },
  ]

  it('menjumlahkan kebutuhan satuan dasar per barang', () => {
    expect(baseNeeded(cart, [rokok]).get('r')).toBe(23)
  })

  it('sisa stok = stok − isi keranjang', () => {
    expect(remainingStock(rokok, cart)).toBe(22)
  })

  it('barang tanpa hitung stok selalu tersedia', () => {
    expect(remainingStock(jasa, [])).toBe(Number.POSITIVE_INFINITY)
  })
})

describe('resolveCart', () => {
  it('menghitung total rupiah dan jumlah barang', () => {
    const cart: CartEntry[] = [
      { productId: 'r', variantId: 'bks', qty: 2 },
      { productId: 'r', variantId: 'btg', qty: 3 },
    ]
    const { total, itemCount, lines } = resolveCart(cart, [rokok])
    expect(total).toBe(66000)
    expect(itemCount).toBe(5)
    expect(lines.map((line) => line.lineTotal)).toEqual([60000, 6000])
  })

  it('memakai harga terbaru barang', () => {
    const cart: CartEntry[] = [{ productId: 'r', variantId: 'btg', qty: 1 }]
    const naik = { ...rokok, variants: [{ id: 'btg', label: '1 batang', price: 2500, baseQty: 1 }] }
    expect(resolveCart(cart, [naik]).total).toBe(2500)
  })

  it('melewati barang nonaktif atau jenis yang sudah dihapus', () => {
    const cart: CartEntry[] = [
      { productId: 'r', variantId: 'hilang', qty: 1 },
      { productId: 'j', variantId: 'x', qty: 1 },
    ]
    const { lines } = resolveCart(cart, [rokok, { ...jasa, isActive: false }])
    expect(lines).toEqual([])
  })

  it('menandai barang yang stoknya kurang', () => {
    const cart: CartEntry[] = [{ productId: 'r', variantId: 'bks', qty: 3 }]
    expect(resolveCart(cart, [rokok]).shortages).toEqual({ r: 45 })
  })

  it('barang tanpa hitung stok tidak pernah kurang', () => {
    const cart: CartEntry[] = [{ productId: 'j', variantId: 'x', qty: 50 }]
    expect(resolveCart(cart, [jasa]).shortages).toEqual({})
  })
})
