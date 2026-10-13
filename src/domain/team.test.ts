import { describe, expect, it } from 'vitest'

import { normalizeEmail, sortMembers, validateInvite } from './team'
import type { Member } from './types'

describe('normalizeEmail', () => {
  it('huruf kecil dan tanpa spasi di tepi', () => {
    expect(normalizeEmail('  Sari.Dewi@Gmail.COM ')).toBe('sari.dewi@gmail.com')
  })
})

describe('validateInvite', () => {
  const context = { takenEmails: ['pemilik@gmail.com'] }

  it('menerima email & nama yang benar lalu merapikannya', () => {
    expect(validateInvite({ email: ' Sari@Gmail.com', displayName: '  Sari  ' }, context)).toEqual({
      ok: true,
      value: { email: 'sari@gmail.com', displayName: 'Sari' },
    })
  })

  it('menolak format email yang salah', () => {
    const result = validateInvite({ email: 'sari@gmail', displayName: 'Sari' }, context)
    expect(!result.ok && result.errors.email).toMatch(/Format email/)
  })

  it('menolak email yang sudah terdaftar di toko ini, tanpa beda huruf besar', () => {
    const result = validateInvite({ email: 'PEMILIK@gmail.com', displayName: 'Sari' }, context)
    expect(!result.ok && result.errors.email).toMatch(/sudah terdaftar/)
  })

  it('menolak nama panggilan terlalu pendek', () => {
    const result = validateInvite({ email: 'sari@gmail.com', displayName: 'S' }, context)
    expect(!result.ok && result.errors.displayName).toMatch(/minimal/)
  })
})

describe('sortMembers', () => {
  const member = (overrides: Partial<Member>): Member => ({
    uid: 'u',
    role: 'cashier',
    displayName: 'X',
    email: 'x@contoh.id',
    isActive: true,
    ...overrides,
  })

  it('pemilik di atas, lalu kasir aktif A–Z, lalu kasir nonaktif', () => {
    const sorted = sortMembers([
      member({ uid: 'b', displayName: 'Budi', isActive: false }),
      member({ uid: 's', displayName: 'Sari' }),
      member({ uid: 'o', displayName: 'Zaki', role: 'owner' }),
      member({ uid: 'a', displayName: 'Ani' }),
    ])
    expect(sorted.map((item) => item.uid)).toEqual(['o', 'a', 's', 'b'])
  })
})
