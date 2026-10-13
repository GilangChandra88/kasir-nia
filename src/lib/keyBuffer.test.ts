import { describe, expect, it } from 'vitest'

import { EMPTY_KEY_BUFFER, type KeyBuffer, pushKey } from './keyBuffer'

const OPTIONS = { maxGapMs: 50, minLength: 3 }

/** Mengetik `text` dengan jeda `gap` ms per karakter mulai `start`, lalu Enter. */
function type(text: string, gap: number, start = 1000) {
  let buffer: KeyBuffer = EMPTY_KEY_BUFFER
  let now = start
  for (const char of text) {
    buffer = pushKey(buffer, char, now, OPTIONS).buffer
    now += gap
  }
  return pushKey(buffer, 'Enter', now, OPTIONS)
}

describe('pushKey', () => {
  it('mengenali tembakan scanner yang cepat diakhiri Enter', () => {
    expect(type('8991234567890', 10).scanned).toBe('8991234567890')
  })

  it('tidak menganggap ketikan manusia yang lambat sebagai scan', () => {
    expect(type('8991234', 150).scanned).toBeNull()
  })

  it('jeda lama di tengah memulai ulang penampung', () => {
    let buffer = pushKey(EMPTY_KEY_BUFFER, 'x', 0, OPTIONS).buffer
    buffer = pushKey(buffer, '1', 500, OPTIONS).buffer
    buffer = pushKey(buffer, '2', 510, OPTIONS).buffer
    expect(buffer.chars).toBe('12')
  })

  it('kode terlalu pendek diabaikan', () => {
    expect(type('12', 10).scanned).toBeNull()
  })

  it('tombol non-karakter tidak memutus tembakan', () => {
    let buffer = pushKey(EMPTY_KEY_BUFFER, 'A', 0, OPTIONS).buffer
    buffer = pushKey(buffer, 'Shift', 5, OPTIONS).buffer
    buffer = pushKey(buffer, 'B', 10, OPTIONS).buffer
    buffer = pushKey(buffer, 'C', 20, OPTIONS).buffer
    expect(pushKey(buffer, 'Enter', 30, OPTIONS).scanned).toBe('ABC')
  })

  it('Enter selalu mengosongkan penampung', () => {
    expect(type('8991234', 10).buffer).toEqual(EMPTY_KEY_BUFFER)
  })
})
