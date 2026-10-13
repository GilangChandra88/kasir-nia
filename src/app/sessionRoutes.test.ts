import { describe, expect, it } from 'vitest'

import { homePathFor } from './sessionRoutes'

describe('homePathFor', () => {
  it('belum login diarahkan ke halaman masuk', () => {
    expect(homePathFor('signedOut')).toBe('/masuk')
  })

  it('akun tanpa toko diarahkan ke halaman buat toko', () => {
    expect(homePathFor('needsStore')).toBe('/mulai')
  })

  it('akun siap langsung ke halaman kasir', () => {
    expect(homePathFor('ready')).toBe('/kasir')
  })
})
