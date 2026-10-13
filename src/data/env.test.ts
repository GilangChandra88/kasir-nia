import { describe, expect, it } from 'vitest'

import { readFirebaseConfig } from './env'

const completeEnv = {
  VITE_FIREBASE_API_KEY: 'kunci',
  VITE_FIREBASE_AUTH_DOMAIN: 'contoh.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'contoh',
  VITE_FIREBASE_STORAGE_BUCKET: 'contoh.firebasestorage.app',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '123',
  VITE_FIREBASE_APP_ID: '1:123:web:abc',
}

describe('readFirebaseConfig', () => {
  it('memetakan variabel lingkungan ke opsi Firebase', () => {
    expect(readFirebaseConfig(completeEnv)).toEqual({
      apiKey: 'kunci',
      authDomain: 'contoh.firebaseapp.com',
      projectId: 'contoh',
      storageBucket: 'contoh.firebasestorage.app',
      messagingSenderId: '123',
      appId: '1:123:web:abc',
    })
  })

  it('menyebut variabel yang kosong dalam pesan galat', () => {
    expect(() => readFirebaseConfig({ ...completeEnv, VITE_FIREBASE_API_KEY: '' })).toThrow(
      /VITE_FIREBASE_API_KEY/,
    )
  })
})
