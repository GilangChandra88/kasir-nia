import { describe, expect, it } from 'vitest'

import { STORE_NAME_MAX_LENGTH } from '@/config/limits'

import { validateStoreName } from './store'

describe('validateStoreName', () => {
  it('menerima nama wajar dan membuang spasi di tepi', () => {
    expect(validateStoreName('  Toko Nia Jaya  ')).toEqual({ ok: true, value: 'Toko Nia Jaya' })
  })

  it('merapatkan spasi ganda di tengah', () => {
    expect(validateStoreName('Toko   Nia')).toEqual({ ok: true, value: 'Toko Nia' })
  })

  it('menolak nama kosong atau terlalu pendek', () => {
    expect(validateStoreName('   ').ok).toBe(false)
    expect(validateStoreName('A').ok).toBe(false)
  })

  it('menolak nama yang melebihi batas panjang', () => {
    const result = validateStoreName('x'.repeat(STORE_NAME_MAX_LENGTH + 1))
    expect(result).toEqual({
      ok: false,
      message: `Nama toko maksimal ${STORE_NAME_MAX_LENGTH} huruf.`,
    })
  })

  it('menerima nama tepat di batas panjang', () => {
    expect(validateStoreName('x'.repeat(STORE_NAME_MAX_LENGTH)).ok).toBe(true)
  })
})
