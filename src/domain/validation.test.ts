import { describe, expect, it } from 'vitest'

import { definedOnly } from './validation'

describe('definedOnly', () => {
  it('membuang isian tanpa galat', () => {
    expect(definedOnly({ nama: 'Wajib diisi.', alamat: undefined })).toEqual({
      nama: 'Wajib diisi.',
    })
  })

  it('hasil kosong bila semua valid', () => {
    expect(definedOnly({ nama: undefined })).toEqual({})
  })
})
