import { describe, expect, it } from 'vitest'

import { MAX_STOCK } from '@/config/limits'

import {
  applyStockAdjustment,
  BASE_UNIT_OPTION_ID,
  buildAdjustment,
  stockUnitOptions,
} from './stockAdjustment'

describe('applyStockAdjustment', () => {
  it('stok masuk dikalikan isi jenis yang dipilih', () => {
    expect(applyStockAdjustment(5, { mode: 'add', quantity: 2, perUnit: 20 })).toEqual({
      ok: true,
      stock: 45,
    })
  })

  it('koreksi mengganti stok dengan hasil hitung', () => {
    expect(applyStockAdjustment(45, { mode: 'set', quantity: 30 })).toEqual({ ok: true, stock: 30 })
    expect(applyStockAdjustment(45, { mode: 'set', quantity: 0 })).toEqual({ ok: true, stock: 0 })
  })

  it('menolak stok masuk nol atau pecahan', () => {
    expect(applyStockAdjustment(5, { mode: 'add', quantity: 0, perUnit: 1 }).ok).toBe(false)
    expect(applyStockAdjustment(5, { mode: 'add', quantity: 1.5, perUnit: 1 }).ok).toBe(false)
  })

  it('menolak koreksi minus', () => {
    expect(applyStockAdjustment(5, { mode: 'set', quantity: -1 })).toEqual({
      ok: false,
      message: 'Stok tidak boleh minus.',
    })
  })

  it('menolak hasil melebihi stok maksimal', () => {
    expect(applyStockAdjustment(MAX_STOCK, { mode: 'add', quantity: 1, perUnit: 1 }).ok).toBe(false)
    expect(applyStockAdjustment(0, { mode: 'set', quantity: MAX_STOCK + 1 }).ok).toBe(false)
  })
})

describe('stockUnitOptions', () => {
  it('menawarkan satuan dasar dan jenis berisi lebih dari satu', () => {
    const options = stockUnitOptions({
      id: 'r',
      name: 'Rokok',
      category: null,
      baseUnit: 'batang',
      barcode: null,
      stock: 0,
      trackStock: true,
      isActive: true,
      variants: [
        { id: 'b', label: '1 bungkus', price: 30000, baseQty: 20 },
        { id: 'e', label: '1 batang', price: 2000, baseQty: 1 },
      ],
    })
    expect(options).toEqual([
      { id: BASE_UNIT_OPTION_ID, label: 'batang', perUnit: 1 },
      { id: 'b', label: '1 bungkus', perUnit: 20 },
    ])
  })
})

describe('buildAdjustment', () => {
  it('belum ada perubahan bila jumlah kosong', () => {
    expect(buildAdjustment('add', null, 20)).toBeNull()
  })

  it('stok masuk membawa isi satuan, koreksi tidak', () => {
    expect(buildAdjustment('add', 2, 20)).toEqual({ mode: 'add', quantity: 2, perUnit: 20 })
    expect(buildAdjustment('set', 30, 20)).toEqual({ mode: 'set', quantity: 30 })
  })
})
