import { describe, expect, it } from 'vitest'

import type { CartEntry } from './cart'
import { dayKey, prepareSale, receiptNumber } from './sale'
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

const galon: Product = {
  ...rokok,
  id: 'g',
  name: 'Isi ulang galon',
  stock: 0,
  trackStock: false,
  variants: [{ id: 'x', label: '1 galon', price: 5000, baseQty: 1 }],
}

const entries: CartEntry[] = [
  { productId: 'r', variantId: 'bks', qty: 1 },
  { productId: 'r', variantId: 'btg', qty: 3 },
  { productId: 'g', variantId: 'x', qty: 2 },
]

const base = { entries, products: [rokok, galon], cashReceived: 50000, expectedTotal: 46000 }

describe('prepareSale', () => {
  it('menyusun transaksi lengkap dengan salinan nama & harga', () => {
    const result = prepareSale(base)
    if (!result.ok) throw new Error(result.message)
    expect(result.sale).toMatchObject({
      total: 46000,
      itemCount: 6,
      cashReceived: 50000,
      change: 4000,
    })
    expect(result.sale.items[0]).toEqual({
      productId: 'r',
      variantId: 'bks',
      name: 'Rokok A',
      variantLabel: '1 bungkus',
      price: 30000,
      qty: 1,
      baseQty: 20,
    })
  })

  it('mengurangi stok dalam satuan dasar, hanya untuk barang yang dihitung', () => {
    const result = prepareSale(base)
    expect(result.ok && result.sale.stockUpdates).toEqual([{ productId: 'r', stock: 22 }])
  })

  it('menolak keranjang kosong', () => {
    expect(prepareSale({ ...base, entries: [] })).toEqual({
      ok: false,
      message: 'Keranjang masih kosong.',
    })
  })

  it('menolak bila stok di server sudah tidak cukup', () => {
    const result = prepareSale({ ...base, products: [{ ...rokok, stock: 10 }, galon] })
    expect(result).toEqual({ ok: false, message: 'Stok Rokok A tinggal 10.' })
  })

  it('menolak bila harga berubah dari yang terlihat di layar', () => {
    const result = prepareSale({ ...base, expectedTotal: 45000 })
    expect(result.ok).toBe(false)
  })

  it('menolak bila ada barang yang sudah dinonaktifkan', () => {
    const result = prepareSale({ ...base, products: [rokok, { ...galon, isActive: false }] })
    expect(result.ok).toBe(false)
  })

  it('menolak uang kurang', () => {
    const result = prepareSale({ ...base, cashReceived: 40000 })
    expect(result).toEqual({ ok: false, message: 'Uang kurang Rp 6.000' })
  })
})

describe('dayKey & receiptNumber', () => {
  const date = new Date(2026, 9, 13, 14, 32)

  it('kunci hari memakai tanggal lokal', () => {
    expect(dayKey(date)).toBe('2026-10-13')
  })

  it('nomor struk = tanggal singkat + 4 huruf akhir ID', () => {
    expect(receiptNumber(date, 'abcdk7q2')).toBe('261013-K7Q2')
  })
})
