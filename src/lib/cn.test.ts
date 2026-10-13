import { describe, expect, it } from 'vitest'

import { cn } from './cn'

describe('cn', () => {
  it('menggabungkan kelas dengan spasi', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('melewati nilai false, null, undefined, dan string kosong', () => {
    expect(cn('px-4', false, null, undefined, '', 'text-muted')).toBe('px-4 text-muted')
  })

  it('mengembalikan string kosong bila tidak ada kelas', () => {
    expect(cn()).toBe('')
  })
})
