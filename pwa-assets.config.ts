import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

import { PALETTE } from './src/theme/palette.ts'

// Latar ikon maskable & Apple disamakan dengan logo agar tidak ada bingkai putih di launcher Android.
const navyBackground = { background: PALETTE.navy950 }

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: navyBackground },
    apple: { ...minimal2023Preset.apple, resizeOptions: navyBackground },
  },
  images: ['public/logo.svg'],
})
