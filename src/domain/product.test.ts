import { describe, expect, it } from 'vitest'

import { MAX_PRICE } from '@/config/limits'

import { normalizeBarcode, normalizeText, validateProductDraft } from './product'
import type { ProductDraft } from './productDraft'

const validDraft: ProductDraft = {
  name: '  Rokok   Merk A ',
  category: 'Rokok',
  baseUnit: 'batang',
  barcode: ' 8999 9090 ',
  trackStock: true,
  initialStock: 40,
  variants: [
    { id: 'v1', label: '1 bungkus', price: 30000, baseQty: 20 },
    { id: 'v2', label: '1 batang', price: 2000, baseQty: 1 },
  ],
}

function errorsOf(draft: ProductDraft) {
  const result = validateProductDraft(draft)
  if (result.ok) throw new Error('seharusnya gagal')
  return result.errors
}

describe('normalizeText & normalizeBarcode', () => {
  it('merapikan spasi teks', () => {
    expect(normalizeText('  a   b ')).toBe('a b')
  })

  it('membuang semua spasi dari barcode', () => {
    expect(normalizeBarcode(' 899 123\t')).toBe('899123')
  })
})

describe('validateProductDraft', () => {
  it('menerima isian valid dan merapikan datanya', () => {
    const result = validateProductDraft(validDraft)
    expect(result).toEqual({
      ok: true,
      initialStock: 40,
      value: {
        name: 'Rokok Merk A',
        category: 'Rokok',
        baseUnit: 'batang',
        barcode: '89999090',
        trackStock: true,
        variants: validDraft.variants,
      },
    })
  })

  it('kategori & barcode kosong disimpan sebagai null', () => {
    const result = validateProductDraft({ ...validDraft, category: ' ', barcode: '' })
    expect(result.ok && result.value.category).toBeNull()
    expect(result.ok && result.value.barcode).toBeNull()
  })

  it('stok awal kosong dianggap nol, dan nol bila stok tidak dilacak', () => {
    const empty = validateProductDraft({ ...validDraft, initialStock: null })
    expect(empty.ok && empty.initialStock).toBe(0)
    const untracked = validateProductDraft({ ...validDraft, trackStock: false })
    expect(untracked.ok && untracked.initialStock).toBe(0)
  })

  it('menolak nama barang terlalu pendek', () => {
    expect(errorsOf({ ...validDraft, name: 'A' }).name).toMatch(/minimal/)
  })

  it('menolak barcode dengan karakter aneh', () => {
    expect(errorsOf({ ...validDraft, barcode: '89/99' }).barcode).toMatch(/huruf, angka/)
  })

  it('menolak harga kosong, nol, atau terlalu besar per jenis', () => {
    const errors = errorsOf({
      ...validDraft,
      variants: [
        { id: 'a', label: 'A', price: null, baseQty: 1 },
        { id: 'b', label: 'B', price: 0, baseQty: 1 },
        { id: 'c', label: 'C', price: MAX_PRICE + 1, baseQty: 1 },
      ],
    })
    expect(errors.variants.a?.price).toMatch(/wajib/)
    expect(errors.variants.b?.price).toMatch(/minimal/)
    expect(errors.variants.c?.price).toMatch(/maksimal/)
  })

  it('menolak isi jenis kosong', () => {
    const errors = errorsOf({
      ...validDraft,
      variants: [{ id: 'a', label: '1 bungkus', price: 1000, baseQty: null }],
    })
    expect(errors.variants.a?.baseQty).toMatch(/wajib/)
  })

  it('menolak nama jenis kembar tanpa memandang huruf besar', () => {
    const errors = errorsOf({
      ...validDraft,
      variants: [
        { id: 'a', label: '1 Batang', price: 2000, baseQty: 1 },
        { id: 'b', label: '1 batang ', price: 2000, baseQty: 1 },
      ],
    })
    expect(errors.variants.a?.label).toMatch(/tidak boleh sama/)
    expect(errors.variants.b?.label).toMatch(/tidak boleh sama/)
  })

  it('jenis yang valid tidak punya entri galat', () => {
    const errors = errorsOf({ ...validDraft, name: '' })
    expect(errors.variants).toEqual({})
  })
})
