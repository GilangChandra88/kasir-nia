import { describe, expect, it } from 'vitest'

import { buildReceipt, formatReceiptDate, type ReceiptSale } from './receipt'

const store = {
  name: 'Toko Nia Jaya',
  address: 'Jl. Raya Mawar No. 12',
  phone: '0812-3456-7890',
  receipt: { headerNote: 'Buka 07.00–22.00', footerNote: 'Terima kasih!', showCashier: true },
}

const sale: ReceiptSale = {
  receiptNo: '261014-K7Q2',
  date: new Date(2026, 9, 14, 9, 5),
  cashierName: 'Sari',
  items: [
    {
      productId: 'r',
      variantId: 'bks',
      name: 'Rokok A',
      variantLabel: '1 bungkus',
      price: 30000,
      qty: 2,
      baseQty: 20,
    },
  ],
  total: 60000,
  itemCount: 2,
  cashReceived: 100000,
  change: 40000,
}

describe('formatReceiptDate', () => {
  it('memakai format tanggal & jam Indonesia dengan nol di depan', () => {
    expect(formatReceiptDate(new Date(2026, 0, 5, 7, 3))).toBe('05/01/2026 07.03')
  })
})

describe('buildReceipt', () => {
  it('menyusun kepala struk dari alamat, telepon, dan catatan atas', () => {
    expect(buildReceipt(store, sale).headerLines).toEqual([
      'Jl. Raya Mawar No. 12',
      'Telp 0812-3456-7890',
      'Buka 07.00–22.00',
    ])
  })

  it('melewati info toko yang kosong', () => {
    const plain = {
      ...store,
      address: null,
      phone: '',
      receipt: { ...store.receipt, headerNote: ' ' },
    }
    expect(buildReceipt(plain, sale).headerLines).toEqual([])
  })

  it('merinci tiap baris: jenis, jumlah × harga, dan subtotal', () => {
    expect(buildReceipt(store, sale).lines).toEqual([
      { name: 'Rokok A', detail: '1 bungkus · 2 × 30.000', amount: 60000 },
    ])
  })

  it('menyembunyikan nama kasir bila dimatikan pemilik', () => {
    expect(buildReceipt(store, sale).cashierName).toBe('Sari')
    const hidden = { ...store, receipt: { ...store.receipt, showCashier: false } }
    expect(buildReceipt(hidden, sale).cashierName).toBeNull()
  })

  it('membawa total, tunai, kembalian, dan penutup', () => {
    expect(buildReceipt(store, sale)).toMatchObject({
      storeName: 'Toko Nia Jaya',
      receiptNo: '261014-K7Q2',
      dateText: '14/10/2026 09.05',
      total: 60000,
      cashReceived: 100000,
      change: 40000,
      footer: 'Terima kasih!',
    })
  })
})
