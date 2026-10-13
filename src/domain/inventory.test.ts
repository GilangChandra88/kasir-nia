import { describe, expect, it } from 'vitest'

import {
  collectCategories,
  countByFilter,
  filterProducts,
  formatStock,
  priceRange,
  stockBreakdown,
  stockStatus,
} from './inventory'
import type { Product } from './types'

function product(overrides: Partial<Product>): Product {
  return {
    id: 'p',
    name: 'Barang',
    category: null,
    baseUnit: 'pcs',
    barcode: null,
    stock: 10,
    trackStock: true,
    isActive: true,
    variants: [{ id: 'v', label: '1 pcs', price: 1000, baseQty: 1 }],
    ...overrides,
  }
}

const rokok = product({
  id: 'r',
  name: 'Rokok A',
  category: 'Rokok',
  baseUnit: 'batang',
  barcode: '8991',
  stock: 45,
  variants: [
    { id: 'b', label: '1 bungkus', price: 30000, baseQty: 20 },
    { id: 'e', label: '1 batang', price: 2000, baseQty: 1 },
  ],
})

describe('stockStatus', () => {
  it('membedakan habis, menipis, aman, dan tidak dilacak', () => {
    expect(stockStatus(product({ stock: 0 }), 5)).toBe('out')
    expect(stockStatus(product({ stock: 5 }), 5)).toBe('low')
    expect(stockStatus(product({ stock: 6 }), 5)).toBe('ok')
    expect(stockStatus(product({ stock: 0, trackStock: false }), 5)).toBe('untracked')
  })
})

describe('formatStock & stockBreakdown', () => {
  it('menampilkan stok dalam satuan dasar', () => {
    expect(formatStock(product({ stock: 1500, baseUnit: 'gram' }))).toBe('1.500 gram')
  })

  it('merinci stok memakai jenis terbesar', () => {
    expect(stockBreakdown(rokok)).toBe('2 × 1 bungkus + 5 batang')
    expect(stockBreakdown({ ...rokok, stock: 40 })).toBe('2 × 1 bungkus')
  })

  it('tidak merinci bila stok kurang dari satu jenis terbesar atau hanya satuan', () => {
    expect(stockBreakdown({ ...rokok, stock: 19 })).toBeNull()
    expect(stockBreakdown(product({}))).toBeNull()
  })
})

describe('priceRange & collectCategories', () => {
  it('mencari harga termurah dan termahal', () => {
    expect(priceRange(rokok.variants)).toEqual({ min: 2000, max: 30000 })
  })

  it('mengumpulkan kategori unik terurut', () => {
    const products = [rokok, product({ category: 'Minuman' }), product({ category: 'Rokok' })]
    expect(collectCategories(products)).toEqual(['Minuman', 'Rokok'])
  })
})

describe('filterProducts', () => {
  const teh = product({ id: 't', name: 'Teh Botol', category: 'Minuman', stock: 2 })
  const kopi = product({ id: 'k', name: 'Kopi', stock: 0 })
  const lama = product({ id: 'l', name: 'Barang lama', isActive: false })
  const all = [teh, rokok, kopi, lama]

  it('menyembunyikan barang nonaktif dan mengurutkan A–Z', () => {
    const names = filterProducts(all, { text: '', filter: 'all', threshold: 5 }).map((p) => p.name)
    expect(names).toEqual(['Kopi', 'Rokok A', 'Teh Botol'])
  })

  it('mencari di nama, kategori, dan barcode tanpa memandang huruf besar', () => {
    const search = (text: string) =>
      filterProducts(all, { text, filter: 'all', threshold: 5 }).map((p) => p.id)
    expect(search('TEH')).toEqual(['t'])
    expect(search('minuman')).toEqual(['t'])
    expect(search('8991')).toEqual(['r'])
  })

  it('menyaring stok menipis dan habis', () => {
    expect(filterProducts(all, { text: '', filter: 'low', threshold: 5 }).map((p) => p.id)).toEqual(
      ['t'],
    )
    expect(filterProducts(all, { text: '', filter: 'out', threshold: 5 }).map((p) => p.id)).toEqual(
      ['k'],
    )
  })

  it('menghitung jumlah per filter dari barang aktif saja', () => {
    expect(countByFilter(all, 5)).toEqual({ all: 3, low: 1, out: 1 })
  })
})
