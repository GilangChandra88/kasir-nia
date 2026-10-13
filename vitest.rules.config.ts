import { defineConfig } from 'vitest/config'

// Tes aturan keamanan Firestore. Butuh emulator: jalankan lewat `npm run test:rules`.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['rules-tests/**/*.test.ts'],
    // Semua file memakai emulator yang sama; dijalankan berurutan agar data tidak saling hapus.
    fileParallelism: false,
    testTimeout: 20_000,
  },
})
