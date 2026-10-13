import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'

import { PALETTE } from './src/theme/palette.ts'

export default defineConfig({
  define: {
    // Versi tampil di Profil. npm mengisi variabel ini saat menjalankan skrip (lokal maupun Vercel).
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.0.0'),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Ikon PNG dibuat otomatis dari public/logo.svg (lihat pwa-assets.config.ts).
      pwaAssets: { config: true },
      manifest: {
        name: 'Nia Kasir',
        short_name: 'Kasir',
        description: 'Kasir toko di HP: scan barcode, stok berjenis, riwayat, dan struk.',
        lang: 'id',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: PALETTE.paper,
        background_color: PALETTE.paper,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Jalur /__/ milik Firebase Hosting (login Google) tidak boleh dilayani service worker.
        navigateFallbackDenylist: [/^\/__\//],
      },
    }),
  ],
  build: {
    // SDK Firebase (Auth + Firestore dengan cache offline) ≈ 250 kB gzip dan dibutuhkan sejak awal
    // untuk cek sesi. Pemecahan per rute dijadwalkan di tahap optimasi (RANCANGAN §15, Tahap 10).
    chunkSizeWarningLimit: 1200,
  },
  // Port tetap agar tidak bentrok dengan proyek lain yang memakai 5173.
  server: { port: 5180, strictPort: true },
  preview: { port: 5181, strictPort: true },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    // Agar `index.css?raw` berisi CSS asli (dipakai palette.test.ts).
    css: { include: [/styles\/index\.css/] },
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
