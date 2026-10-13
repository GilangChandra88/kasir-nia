import { describe, expect, it } from 'vitest'

import { formatNumber, formatRupiah, parseDigits } from './money'

describe('formatNumber', () => {
  it('memakai titik sebagai pemisah ribuan', () => {
    expect(formatNumber(1500000)).toBe('1.500.000')
  })

  it('angka kecil tanpa pemisah', () => {
    expect(formatNumber(500)).toBe('500')
  })
})

describe('formatRupiah', () => {
  it('menambahkan Rp dengan spasi tak-putus', () => {
    expect(formatRupiah(30000)).toBe('Rp 30.000')
  })

  it('nol tetap ditampilkan', () => {
    expect(formatRupiah(0)).toBe('Rp 0')
  })
})

describe('parseDigits', () => {
  it('membaca angka berformat ribuan', () => {
    expect(parseDigits('30.000')).toBe(30000)
  })

  it('membuang awalan Rp dan spasi', () => {
    expect(parseDigits('Rp 2.500')).toBe(2500)
  })

  it('isian kosong atau tanpa digit menjadi null', () => {
    expect(parseDigits('')).toBeNull()
    expect(parseDigits('abc')).toBeNull()
  })

  it('angka terlalu besar menjadi null', () => {
    expect(parseDigits('99999999999999999999')).toBeNull()
  })
})
