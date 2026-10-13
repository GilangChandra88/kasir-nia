import { describe, expect, it } from 'vitest'

import { UserFacingError } from '@/domain/errors'

import { describeError, errorCode, isCancelledSignIn } from './errors'

describe('errorCode', () => {
  it('mengambil kode dari objek galat Firebase', () => {
    expect(errorCode({ code: 'auth/popup-blocked' })).toBe('auth/popup-blocked')
  })

  it('mengembalikan null untuk galat tanpa kode', () => {
    expect(errorCode(new Error('x'))).toBeNull()
    expect(errorCode('teks')).toBeNull()
    expect(errorCode({ code: 42 })).toBeNull()
  })
})

describe('isCancelledSignIn', () => {
  it('mengenali jendela login yang ditutup pengguna', () => {
    expect(isCancelledSignIn({ code: 'auth/popup-closed-by-user' })).toBe(true)
  })

  it('tidak menganggap galat jaringan sebagai pembatalan', () => {
    expect(isCancelledSignIn({ code: 'auth/network-request-failed' })).toBe(false)
  })
})

describe('describeError', () => {
  it('menampilkan pesan UserFacingError apa adanya', () => {
    expect(describeError(new UserFacingError('Akun sudah punya toko.'))).toBe(
      'Akun sudah punya toko.',
    )
  })

  it('menerjemahkan kode Firebase yang dikenal', () => {
    expect(describeError({ code: 'unavailable' })).toMatch(/internet/)
  })

  it('tidak membocorkan pesan teknis galat lain', () => {
    expect(describeError(new Error('FirebaseError: internal stack'))).toBe(
      'Terjadi kesalahan. Coba lagi sebentar lagi.',
    )
  })
})
