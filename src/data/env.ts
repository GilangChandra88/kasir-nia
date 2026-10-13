import type { FirebaseOptions } from 'firebase/app'
import { z } from 'zod'

const envSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string().min(1),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  VITE_FIREBASE_APP_ID: z.string().min(1),
})

/** Membaca konfigurasi Firebase dari variabel lingkungan Vite; gagal cepat bila belum diisi. */
export function readFirebaseConfig(source: unknown): FirebaseOptions {
  const result = envSchema.safeParse(source)
  if (!result.success) {
    const missing = result.error.issues.map((issue) => issue.path.join('.')).join(', ')
    throw new Error(
      `Konfigurasi Firebase belum lengkap (${missing}). Salin .env.example menjadi .env.local ` +
        'atau isi Environment Variables di Vercel.',
    )
  }
  const env = result.data
  return {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  }
}
