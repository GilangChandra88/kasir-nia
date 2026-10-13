import { describe, expect, it } from 'vitest'

import { parseStore, parseUserProfile } from './schemas'

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
  it('mengisi alamat & telepon kosong dengan null', () => {
    expect(parseStore('toko1', { name: 'Toko Nia', ownerUid: 'u1' })).toEqual({
      id: 'toko1',
      name: 'Toko Nia',
      ownerUid: 'u1',
      address: null,
      phone: null,
    })
  })

  it('menolak toko tanpa nama', () => {
    expect(parseStore('toko1', { name: '', ownerUid: 'u1' })).toBeNull()
  })
})
