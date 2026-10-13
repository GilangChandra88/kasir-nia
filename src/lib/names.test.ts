import { describe, expect, it } from 'vitest'

import { firstName, initials } from './names'

describe('firstName', () => {
  it('mengambil kata pertama', () => {
    expect(firstName('Gilang Chandra')).toBe('Gilang')
  })

  it('mengabaikan spasi berlebih', () => {
    expect(firstName('   Sari   Dewi ')).toBe('Sari')
  })

  it('memakai sapaan "Kak" bila nama kosong', () => {
    expect(firstName('   ')).toBe('Kak')
  })
})

describe('initials', () => {
  it('mengambil huruf depan dua kata pertama dalam huruf besar', () => {
    expect(initials('gilang chandra putra')).toBe('GC')
  })

  it('satu kata menghasilkan satu huruf', () => {
    expect(initials('Nia')).toBe('N')
  })

  it('nama kosong menghasilkan tanda tanya', () => {
    expect(initials('')).toBe('?')
  })
})
