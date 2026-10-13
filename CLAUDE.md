# Nia Kasir — Aplikasi Kasir Web untuk HP

Aplikasi kasir PWA untuk **HP Android (Chrome)**: scan barcode, barang dengan **jenis** (varian harga),
riwayat & rekap, struk di layar. Banyak pemilik toko, pemilik menambahkan kasir lewat email Google.
Backend **Firebase** (Auth Google, Firestore); hosting **Vercel** (deploy otomatis dari GitHub). Bahasa tampilan: **Indonesia saja**.

Dokumen wajib baca sebelum mengubah kode:

- `docs/RANCANGAN.md` — keputusan produk, arsitektur, model data Firestore, keamanan, desain visual,
  animasi, dan **tahapan pengerjaan** (kerjakan sesuai urutan tahap).

## Stack

Vite 8 · React 19 · TypeScript 6 (strict) · Tailwind CSS 4 · React Router 7 · motion (LazyMotion) ·
lucide-react · Firebase · Zustand · Zod · Vitest · ESLint 10 · Prettier 3 · vite-plugin-pwa.

> TypeScript dikunci di `~6.0` karena typescript-eslint belum mendukung TypeScript 7.
> React Router tetap di v7 karena v8 butuh Node ≥ 22.22.

## Perintah

| Perintah               | Fungsi                                                        |
| ---------------------- | ------------------------------------------------------------- |
| `npm run dev`          | Server pengembangan di `http://localhost:5180`                |
| `npm run dev:hp`       | Sama, tapi bisa dibuka dari HP di jaringan yang sama          |
| `npm run build`        | Typecheck + build produksi (+ ikon PWA) ke `dist/`            |
| `npm run check`        | **Gerbang wajib**: typecheck + lint + cek format + test       |
| `npm run fix`          | Perbaiki lint otomatis + format semua file                    |
| `npm run test:watch`   | Test mode pantau                                              |
| `npm run test:rules`   | Uji `firestore.rules` di emulator (butuh Java 21+)            |
| `npm run rules:deploy` | Pasang `firestore.rules` ke Firebase (perlu `firebase login`) |

> Kamera (scan barcode) hanya jalan di `localhost` atau HTTPS. Untuk uji di HP sungguhan pakai
> URL preview Vercel (otomatis untuk setiap push) atau tunnel HTTPS, bukan `http://192.168.x.x`.

## Aturan Wajib

### 1. Definisi "selesai"

Pekerjaan belum selesai sebelum `npm run check` **lulus tanpa error dan tanpa warning**.
Jangan menonaktifkan aturan lint (`eslint-disable`) atau memakai `@ts-ignore`/`@ts-expect-error`.
Jika aturan benar-benar harus dikecualikan, tulis alasannya di komentar yang sama dan sebutkan di
ringkasan pekerjaan.

### 2. Bahasa

- **Teks tampilan, dokumen, pesan galat untuk pengguna**: Bahasa Indonesia yang ramah.
- **Nama di kode** (variabel, fungsi, tipe, file, folder): Bahasa Inggris (`CartItem`, `addToCart`).
- **Komentar**: Bahasa Indonesia, singkat, menjelaskan _mengapa_, bukan _apa_.
- Rute URL boleh Indonesia (`/kasir`, `/riwayat`, `/stok`, `/profil`, `/masuk`).

### 3. Struktur & batas lapisan

```
src/
├── app/          Router, provider, penjaga rute. Tanpa logika bisnis.
├── pages/        Satu file per rute. Hanya menyusun fitur.
├── features/     Fitur utuh (auth, checkout, receipt, history, inventory, team, profile).
├── components/
│   ├── ui/       Komponen UI generik (Button, Sheet, ...). Tanpa store, tanpa Firebase.
│   ├── layout/   AppShell, BottomNav, PageHeader, OfflineBanner.
│   ├── motion/   Pembungkus animasi yang dipakai ulang.
│   └── brand/    Maskot & ilustrasi SVG.
├── domain/       LOGIKA MURNI (uang, keranjang, stok, struk, rekap, izin). Tanpa React/Firebase.
├── data/         Satu-satunya tempat yang mengimpor `firebase`. Repository + skema Zod.
├── store/        State global Zustand.
├── lib/          Utilitas kecil (cn, format tanggal).
├── config/       Konstanta angka dengan satuan di komentar.
├── theme/        Palet warna (satu-satunya tempat hex di src/).
└── styles/       CSS global + token Tailwind.
```

Arah impor yang diizinkan (kiri boleh mengimpor kanan, **tidak sebaliknya**):

```
pages → features → components → store/data → domain → lib/config/theme
```

- `domain/` tidak boleh mengimpor React, Firebase, `store/`, atau `data/`.
- Komponen tidak memanggil Firestore langsung; selalu lewat hook di `features/` yang memakai `data/`.
- Hindari impor melingkar. Alias `@/` untuk lintas folder, relatif `./` di folder sendiri.

### 4. Komponen React

- Satu komponen per file, nama file = nama komponen (`PascalCase.tsx`), **named export** saja.
- Props diberi tipe `type NamaKomponenProps = { ... }` tepat di atas komponen.
- Maksimal **200 baris** per file (dijaga lint). Pecah bila lebih.
- Hook kustom di `useNamaHook.ts`. Logika berat dipindah ke `domain/`.

### 5. Warna, gaya & animasi

- Hanya token di `src/theme/palette.ts` = `src/styles/index.css` (dijaga `palette.test.ts`).
  Hex warna **dilarang** di `src/` selain `theme/` (dijaga lint). Warna baru: diskusikan dulu.
- Tailwind: kelas token (`bg-navy-950`, `text-muted`); dilarang warna arbitrer.
- Aset SVG di `public/` boleh memuat hex (logo mengikuti palet; logo Google wajib warna asli).
- Animasi pakai `m.*` dari `motion/react-m` (LazyMotion `strict`), **bukan** `motion.*`.
  Hanya animasikan `transform` & `opacity`. Preset pegas/durasi di `src/config/motion.ts`.
- Hormati `prefers-reduced-motion` (sudah diatur global; jangan dilawan).
- Target sentuh minimal 44×44 px; angka uang pakai `tabular-nums`.

### 6. Uang, angka & satuan

- **Uang selalu integer rupiah**, tidak pernah float. Format lewat `domain/money.ts`.
- Tanpa angka ajaib: konstanta di `src/config/` dengan satuan di komentar (piksel, detik, rupiah).

### 7. Firebase & keamanan

- Konfigurasi di `.env.local` (`VITE_FIREBASE_*`), tidak masuk Git; contoh di `.env.example`.
- Data dari Firestore wajib divalidasi Zod (`data/schemas.ts`).
- Setiap hak akses yang dibatasi di UI **juga** ditegakkan di `firestore.rules` dan diuji dengan emulator
  (`rules-tests/`, `npm run test:rules`). Ubah rules → tambah/ubah tesnya dan pastikan lulus.
- Di Windows, bila emulator galat "Unable to establish loopback connection", set
  `JAVA_TOOL_OPTIONS=-Djdk.net.unixdomain.tmpdir=C:/Temp` (folder tanpa spasi) sebelum menjalankan.
- Transaksi penjualan memakai `runTransaction` dan **wajib online**; saat offline tombol simpan dinonaktifkan.

### 8. TypeScript

- Dilarang `any`, `as unknown as`, dan non-null assertion `!`. Persempit tipe dengan pengecekan.
- Gunakan `type`, bukan `interface`.

### 9. Test

- Setiap fungsi publik di `domain/` dan setiap aksi store **wajib** punya test (`*.test.ts` di sebelahnya).
- Nama test dalam Bahasa Indonesia, menjelaskan perilaku: `'menolak bayar bila uang kurang'`.

### 10. Git

- Pesan commit: Conventional Commits, isi Bahasa Indonesia (`feat: editor jenis barang`).
- Hook pre-commit menjalankan lint + format pada file yang diubah.
