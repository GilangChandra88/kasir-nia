import { describe, expect, it } from 'vitest'

import { pickMainBackCamera } from './cameraSelection'

describe('pickMainBackCamera', () => {
  it('memilih kamera belakang bernomor terkecil (kamera utama Android)', () => {
    const cameras = [
      { deviceId: 'ultra', label: 'camera2 2, facing back' },
      { deviceId: 'depan', label: 'camera2 1, facing front' },
      { deviceId: 'utama', label: 'camera2 0, facing back' },
      { deviceId: 'makro', label: 'camera2 3, facing back' },
    ]
    expect(pickMainBackCamera(cameras)).toBe('utama')
  })

  it('memakai kamera belakang pertama bila namanya tanpa nomor', () => {
    const cameras = [
      { deviceId: 'depan', label: 'Front Camera' },
      { deviceId: 'belakang', label: 'Back Camera' },
    ]
    expect(pickMainBackCamera(cameras)).toBe('belakang')
  })

  it('mengenali nama berbahasa Indonesia', () => {
    expect(pickMainBackCamera([{ deviceId: 'x', label: 'Kamera belakang' }])).toBe('x')
  })

  it('null bila tidak ada kamera belakang yang dikenali (mis. webcam laptop)', () => {
    expect(pickMainBackCamera([{ deviceId: 'w', label: 'Integrated Webcam' }])).toBeNull()
    expect(pickMainBackCamera([])).toBeNull()
  })
})
