import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { withTimeout } from './withTimeout'

describe('withTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('meneruskan hasil bila selesai sebelum batas waktu', async () => {
    await expect(withTimeout(Promise.resolve('ok'), 1000, new Error('lama'))).resolves.toBe('ok')
  })

  it('gagal dengan galat yang diberikan bila melewati batas waktu', async () => {
    const never = new Promise<string>(() => undefined)
    const result = withTimeout(never, 1000, new Error('terlalu lama'))
    vi.advanceTimersByTime(1000)
    await expect(result).rejects.toThrow('terlalu lama')
  })

  it('meneruskan galat asli bila gagal lebih dulu', async () => {
    const failing = Promise.reject(new Error('asli'))
    await expect(withTimeout(failing, 1000, new Error('lama'))).rejects.toThrow('asli')
  })
})
