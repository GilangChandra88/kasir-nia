import { describe, expect, it } from 'vitest'

import { MAX_VARIANTS } from '@/config/limits'

import {
  draftFromProduct,
  emptyDraft,
  type ProductDraft,
  productDraftReducer,
} from './productDraft'
import type { Product } from './types'

const base = emptyDraft('v1')

describe('emptyDraft', () => {
  it('mulai dengan satu jenis satuan', () => {
    expect(base.variants).toEqual([{ id: 'v1', label: '1 pcs', price: null, baseQty: 1 }])
    expect(base.trackStock).toBe(true)
  })
})

describe('draftFromProduct', () => {
  it('mengisi form dari barang yang ada tanpa stok awal', () => {
    const product: Product = {
      id: 'p1',
      name: 'Rokok A',
      category: null,
      baseUnit: 'batang',
      barcode: '899',
      stock: 40,
      trackStock: true,
      isActive: true,
      variants: [{ id: 'v1', label: '1 bungkus', price: 30000, baseQty: 20 }],
    }
    const draft = draftFromProduct(product)
    expect(draft.category).toBe('')
    expect(draft.barcode).toBe('899')
    expect(draft.initialStock).toBeNull()
    expect(draft.variants).toEqual(product.variants)
    expect(draft.variants[0]).not.toBe(product.variants[0])
  })
})

describe('productDraftReducer', () => {
  it('mengubah teks isian', () => {
    const next = productDraftReducer(base, { type: 'setText', field: 'name', value: 'Teh' })
    expect(next.name).toBe('Teh')
  })

  it('menambah jenis kosong di akhir', () => {
    const next = productDraftReducer(base, { type: 'addVariant', id: 'v2' })
    expect(next.variants.at(-1)).toEqual({ id: 'v2', label: '', price: null, baseQty: null })
  })

  it('tidak menambah jenis melebihi batas', () => {
    let draft: ProductDraft = base
    for (let index = 0; index < MAX_VARIANTS + 3; index += 1) {
      draft = productDraftReducer(draft, { type: 'addVariant', id: `x${index}` })
    }
    expect(draft.variants).toHaveLength(MAX_VARIANTS)
  })

  it('mengubah satu jenis saja', () => {
    const withTwo = productDraftReducer(base, { type: 'addVariant', id: 'v2' })
    const next = productDraftReducer(withTwo, {
      type: 'updateVariant',
      id: 'v2',
      patch: { price: 2000 },
    })
    expect(next.variants[0]?.price).toBeNull()
    expect(next.variants[1]?.price).toBe(2000)
  })

  it('menghapus jenis tapi menyisakan minimal satu', () => {
    const withTwo = productDraftReducer(base, { type: 'addVariant', id: 'v2' })
    const one = productDraftReducer(withTwo, { type: 'removeVariant', id: 'v1' })
    expect(one.variants.map((variant) => variant.id)).toEqual(['v2'])
    expect(productDraftReducer(one, { type: 'removeVariant', id: 'v2' })).toBe(one)
  })

  it('template bungkus + eceran mengganti satuan dasar dan jenis', () => {
    const next = productDraftReducer(base, {
      type: 'applyTemplate',
      template: 'packAndLoose',
      ids: ['a', 'b', 'c'],
    })
    expect(next.baseUnit).toBe('batang')
    expect(next.variants.map(({ label, baseQty }) => [label, baseQty])).toEqual([
      ['1 bungkus', 20],
      ['1 batang', 1],
      ['3 batang', 3],
    ])
  })

  it('template satuan memakai satuan dasar yang sedang diisi', () => {
    const botol = productDraftReducer(base, { type: 'setText', field: 'baseUnit', value: 'botol' })
    const next = productDraftReducer(botol, {
      type: 'applyTemplate',
      template: 'single',
      ids: ['a'],
    })
    expect(next.variants).toEqual([{ id: 'a', label: '1 botol', price: null, baseQty: 1 }])
  })
})
