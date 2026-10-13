# Nia Kasir

Aplikasi kasir web untuk HP Android: scan barcode, barang dengan jenis (bungkus/batang/…),
riwayat & rekap harian, dan struk. Dibangun dengan React + Vite, Firebase (Auth Google & Firestore),
dan di-hosting di Vercel.

Rancangan lengkap: [docs/RANCANGAN.md](docs/RANCANGAN.md) · Aturan kode: [CLAUDE.md](CLAUDE.md)

## Menjalankan di komputer

```bash
npm install
cp .env.example .env.local   # lalu isi dari Firebase Console
npm run dev                  # http://localhost:5180
```

`npm run check` wajib lulus sebelum commit (typecheck + lint + format + test).

## Menyiapkan Firebase (sekali)

1. **Authentication → Sign-in method** → aktifkan **Google**.
2. **Firestore Database** → buat database (mode _production_, lokasi `asia-southeast2` Jakarta).
3. Pasang aturan keamanan dari `firestore.rules`:
   ```bash
   npx firebase-tools login
   npm run rules:deploy
   ```
   Aturan bisa diuji dulu di emulator lokal (butuh Java 21+): `npm run test:rules`.
   (Atau salin isi `firestore.rules` ke Firestore → tab **Rules** → Publish.)
4. **Authentication → Settings → Authorized domains** → tambahkan domain Vercel
   (mis. `kasir-nia.vercel.app`). Tanpa ini, login Google di situs Vercel akan ditolak.

## Deploy ke Vercel

1. Buka [vercel.com/new](https://vercel.com/new) → impor repo `GilangChandra88/kasir-nia`.
2. Framework terdeteksi **Vite** (pengaturan build ada di `vercel.json`).
3. **Environment Variables**: tempel seluruh isi `.env.local` (enam variabel `VITE_FIREBASE_*`).
4. Deploy. Setiap `git push` ke `main` otomatis terdeploy ulang; branch lain mendapat URL preview.
