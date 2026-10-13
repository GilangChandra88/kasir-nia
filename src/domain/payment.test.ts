import { describe, expect, it } from 'vitest'

import { changeDue, quickCashOptions } from './payment'

describe('quickCashOptions', () => {
  it('membulatkan ke atas ke pecahan umum', () => {
    expect(quickCashOptions(61500)).toEqual([62000, 65000, 70000, 100000])
  })

  it('tidak mengulang nominal yang sama dan tidak menyertakan uang pas', () => {
    expect(quickCashOptions(50000)).toEqual([100000])
    expect(quickCashOptions(2000)).toEqual([5000, 10000, 50000, 100000])
  })

  it('total nol tidak punya pilihan', () => {
    expect(quickCashOptions(0)).toEqual([])
  })
})

describe('changeDue', () => {
  it('menghitung kembalian', () => {
    expect(changeDue(61500, 100000)).toEqual({ status: 'ok', change: 38500 })
  })

  it('uang pas berarti kembalian nol', () => {
    expect(changeDue(61500, 61500)).toEqual({ status: 'ok', change: 0 })
  })

  it('menolak uang kurang dengan pesan jumlah kekurangan', () => {
    expect(changeDue(61500, 50000)).toEqual({
      status: 'short',
      missing: 11500,
      message: 'Uang kurang Rp 11.500',
    })
  })

  it('belum diisi', () => {
    expect(changeDue(61500, null)).toEqual({ status: 'empty' })
  })
})
