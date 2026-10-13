import { describe, expect, it } from 'vitest'

import { can } from './permissions'

describe('can', () => {
  it('pemilik boleh mengelola barang, kasir, dan toko', () => {
    expect(can('owner', 'manageInventory')).toBe(true)
    expect(can('owner', 'manageTeam')).toBe(true)
    expect(can('owner', 'manageStore')).toBe(true)
  })

  it('kasir boleh bertransaksi dan melihat stok', () => {
    expect(can('cashier', 'checkout')).toBe(true)
    expect(can('cashier', 'viewInventory')).toBe(true)
  })

  it('kasir tidak boleh mengubah barang atau melihat transaksi kasir lain', () => {
    expect(can('cashier', 'manageInventory')).toBe(false)
    expect(can('cashier', 'viewAllSales')).toBe(false)
    expect(can('cashier', 'manageTeam')).toBe(false)
  })
})
