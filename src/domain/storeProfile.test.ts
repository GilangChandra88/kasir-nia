import { describe, expect, it } from 'vitest'

import { RECEIPT_NOTE_MAX_LENGTH } from '@/config/limits'

import { draftFromStore, type StoreProfileDraft, validateStoreProfile } from './storeProfile'
import type { StoreInfo } from './types'

const store: StoreInfo = {
  id: 't1',
  name: 'Toko Nia',
  ownerUid: 'u1',
  address: null,
  phone: '0812',
  lowStockThreshold: 5,
  receipt: { headerNote: null, footerNote: 'Terima kasih!', showCashier: true },
}

const draft: StoreProfileDraft = {
  name: '  Toko  Nia Jaya ',
  address: ' Jl. Mawar 12 ',
  phone: '0812-3456 7890',
  headerNote: '',
  footerNote: 'Datang lagi ya!',
  showCashier: false,
  lowStockThreshold: 10,
}

describe('draftFromStore', () => {
  it('mengisi form dari data toko, isian kosong menjadi teks kosong', () => {
    expect(draftFromStore(store)).toEqual({
      name: 'Toko Nia',
      address: '',
      phone: '0812',
      headerNote: '',
      footerNote: 'Terima kasih!',
      showCashier: true,
      lowStockThreshold: 5,
    })
  })
})

describe('validateStoreProfile', () => {
  it('merapikan teks dan mengubah isian kosong menjadi null', () => {
    expect(validateStoreProfile(draft)).toEqual({
      ok: true,
      value: {
        name: 'Toko Nia Jaya',
        address: 'Jl. Mawar 12',
        phone: '0812-3456 7890',
        lowStockThreshold: 10,
        receipt: { headerNote: null, footerNote: 'Datang lagi ya!', showCashier: false },
      },
    })
  })

  it('menolak nama toko terlalu pendek', () => {
    const result = validateStoreProfile({ ...draft, name: 'A' })
    expect(!result.ok && result.errors.name).toMatch(/minimal/)
  })

  it('menolak telepon berisi huruf', () => {
    const result = validateStoreProfile({ ...draft, phone: '0812abc' })
    expect(!result.ok && result.errors.phone).toMatch(/angka/)
  })

  it('menolak catatan struk terlalu panjang', () => {
    const result = validateStoreProfile({
      ...draft,
      footerNote: 'x'.repeat(RECEIPT_NOTE_MAX_LENGTH + 1),
    })
    expect(!result.ok && result.errors.footerNote).toMatch(/maksimal/)
  })

  it('batas stok menipis wajib diisi', () => {
    const result = validateStoreProfile({ ...draft, lowStockThreshold: null })
    expect(!result.ok && result.errors.lowStockThreshold).toMatch(/wajib/)
  })
})
