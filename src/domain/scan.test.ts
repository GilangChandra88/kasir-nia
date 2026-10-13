import { describe, expect, it } from 'vitest'

import { acceptScan } from './scan'

const WINDOW = 1500

describe('acceptScan', () => {
  it('menerima pembacaan pertama', () => {
    expect(acceptScan(null, '899', 1000, WINDOW)).toEqual({
      accepted: true,
      gate: { code: '899', at: 1000 },
    })
  })

  it('menolak kode sama yang terbaca lagi dalam rentang waktu', () => {
    const first = acceptScan(null, '899', 1000, WINDOW)
    expect(acceptScan(first.gate, '899', 1800, WINDOW).accepted).toBe(false)
  })

  it('barcode yang terus terlihat tetap ditolak karena waktunya diperbarui', () => {
    let gate = acceptScan(null, '899', 0, WINDOW).gate
    for (const now of [1000, 2000, 3000]) {
      const decision = acceptScan(gate, '899', now, WINDOW)
      expect(decision.accepted).toBe(false)
      gate = decision.gate
    }
  })

  it('menerima lagi kode sama setelah jeda melewati rentang', () => {
    const first = acceptScan(null, '899', 1000, WINDOW)
    expect(acceptScan(first.gate, '899', 2500, WINDOW).accepted).toBe(true)
  })

  it('kode berbeda selalu diterima', () => {
    const first = acceptScan(null, '899', 1000, WINDOW)
    expect(acceptScan(first.gate, '123', 1100, WINDOW).accepted).toBe(true)
  })
})
