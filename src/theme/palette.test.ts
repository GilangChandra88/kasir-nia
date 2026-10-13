import { describe, expect, it } from 'vitest'

import css from '@/styles/index.css?raw'

import { PALETTE } from './palette'

/** `navy950` → `navy-950`, `lineStrong` → `line-strong` (aturan nama kelas Tailwind). */
const toCssName = (token: string) =>
  token.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`).replace(/([a-z])(\d)/g, '$1-$2')

const readCssColors = (source: string) =>
  new Map(
    [...source.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)].map(
      ([, name = '', hex = '']) => [name, hex.toUpperCase()],
    ),
  )

describe('PALETTE', () => {
  const cssColors = readCssColors(css)

  it('setiap token TypeScript ada di CSS dengan nilai yang sama', () => {
    for (const [token, hex] of Object.entries(PALETTE)) {
      expect(cssColors.get(toCssName(token)), token).toBe(hex)
    }
  })

  it('CSS tidak punya warna di luar PALETTE', () => {
    expect(cssColors.size).toBe(Object.keys(PALETTE).length)
  })

  it('semua nilai berupa hex 6 digit huruf besar', () => {
    for (const hex of Object.values(PALETTE)) {
      expect(hex).toMatch(/^#[0-9A-F]{6}$/)
    }
  })
})
