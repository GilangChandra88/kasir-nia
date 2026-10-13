import { describe, expect, it } from 'vitest'

import { DEFAULT_LOW_STOCK_THRESHOLD } from '@/config/limits'
import { DEFAULT_RECEIPT_SETTINGS } from '@/config/receipt'

import { parseInvite, parseMember, parseProduct, parseStore, parseUserProfile } from './schemas'

describe('parseUserProfile', () => {
  it('menerima dokumen pengguna yang valid', () => {
    expect(parseUserProfile({ storeId: 'toko1', role: 'owner', email: 'a@b.c' })).toEqual({
      storeId: 'toko1',
      role: 'owner',
    })
  })

  it('menolak peran yang tidak dikenal', () => {
    expect(parseUserProfile({ storeId: 'toko1', role: 'admin' })).toBeNull()
  })

  it('menolak dokumen tanpa storeId', () => {
    expect(parseUserProfile({ role: 'cashier' })).toBeNull()
  })
})

describe('parseStore', () => {
  it('mengisi alamat & telepon kosong dengan null dan batas stok bawaan', () => {
    expect(parseStore('toko1', { name: 'Toko Nia', ownerUid: 'u1' })).toEqual({
      id: 'toko1',
      name: 'Toko Nia',
      ownerUid: 'u1',
      address: null,
      phone: null,
      lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD,
      receipt: DEFAULT_RECEIPT_SETTINGS,
    })
  })

  it('memakai batas stok menipis yang tersimpan', () => {
    expect(parseStore('t', { name: 'Toko', ownerUid: 'u1', lowStockThreshold: 10 })).toMatchObject({
      lowStockThreshold: 10,
    })
  })

  it('memakai pengaturan struk yang tersimpan', () => {
    const receipt = { headerNote: 'Buka 07.00', footerNote: 'Makasih!', showCashier: false }
    expect(parseStore('t', { name: 'Toko', ownerUid: 'u1', receipt })?.receipt).toEqual(receipt)
  })

  it('menolak toko tanpa nama', () => {
    expect(parseStore('toko1', { name: '', ownerUid: 'u1' })).toBeNull()
  })
})

describe('parseProduct', () => {
  const doc = {
    name: 'Rokok A',
    baseUnit: 'batang',
    stock: 40,
    trackStock: true,
    isActive: true,
    variants: [{ id: 'v1', label: '1 bungkus', price: 30000, baseQty: 20 }],
    createdAt: 'diabaikan',
  }

  it('menerima barang valid dan mengisi kategori/barcode kosong dengan null', () => {
    expect(parseProduct('p1', doc)).toEqual({
      id: 'p1',
      name: 'Rokok A',
      category: null,
      baseUnit: 'batang',
      barcode: null,
      stock: 40,
      trackStock: true,
      isActive: true,
      variants: doc.variants,
    })
  })

  it('menolak barang tanpa jenis', () => {
    expect(parseProduct('p1', { ...doc, variants: [] })).toBeNull()
  })

  it('menolak harga pecahan atau minus', () => {
    const variants = [{ id: 'v1', label: 'x', price: 1.5, baseQty: 1 }]
    expect(parseProduct('p1', { ...doc, variants })).toBeNull()
  })
})

describe('parseMember & parseInvite', () => {
  it('membaca anggota toko beserta uid-nya', () => {
    const data = { role: 'cashier', displayName: 'Sari', email: 'sari@gmail.com', isActive: true }
    expect(parseMember('u2', data)).toEqual({ uid: 'u2', ...data })
  })

  it('menolak anggota tanpa status aktif', () => {
    expect(parseMember('u2', { role: 'cashier', displayName: 'Sari', email: 'x' })).toBeNull()
  })

  it('membaca undangan dengan email dari ID dokumen', () => {
    const data = { storeId: 't1', storeName: 'Toko Nia', displayName: 'Sari', invitedBy: 'u1' }
    expect(parseInvite('sari@gmail.com', data)).toEqual({
      email: 'sari@gmail.com',
      storeId: 't1',
      storeName: 'Toko Nia',
      displayName: 'Sari',
    })
  })
})
