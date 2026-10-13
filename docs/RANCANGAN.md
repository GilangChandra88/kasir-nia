# Rancangan Aplikasi Kasir (Web HP, Firebase)

Aplikasi kasir berbasis web untuk **HP Android**, bisa di-install seperti aplikasi (PWA).
Mendukung **banyak pemilik toko**, tiap pemilik bisa **menambahkan kasir**, dan struk ditampilkan di
layar setelah transaksi. Aplikasi butuh internet untuk transaksi.

## 1. Keputusan Produk (final)

| Topik            | Keputusan                                                                                      |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| Perangkat utama  | **HP Android, Chrome**. Tampilan juga rapi di tablet/desktop, iPhone tidak jadi prioritas uji. |
| Pengguna         | Banyak pemilik, masing-masing punya toko sendiri. Pemilik menambahkan kasir.                   |
| Login            | Google Sign-In untuk semua. Kasir didaftarkan pemilik lewat **email Google**-nya.              |
| Akun & toko      | **1 akun = 1 toko** (sebagai pemilik atau kasir, tidak keduanya).                              |
| Offline          | Data tetap bisa **dilihat**. Transaksi & ubah data **diblokir** + peringatan.                  |
| Pembayaran       | **Tunai saja** (uang diterima & kembalian).                                                    |
| Struk            | **Ditampilkan di layar** setelah transaksi berhasil & dari riwayat. Cetak Bluetooth menyusul.  |
| Laba             | Belum. Cukup **omzet** (tanpa harga modal).                                                    |
| Diskon / catatan | Belum ada.                                                                                     |

## 2. Halaman

| Halaman     | Rute       | Isi utama                                                                                              |
| ----------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| Login       | `/masuk`   | Masuk dengan Google                                                                                    |
| Buat toko   | `/mulai`   | Hanya untuk akun baru tanpa undangan: isi nama toko → jadi pemilik                                     |
| Kasir       | `/kasir`   | Scan barcode (kamera / scanner fisik) atau cari barang → pilih jenis → keranjang → bayar tunai → struk |
| Riwayat     | `/riwayat` | Rekap hari ini & minggu ini, daftar transaksi, detail & lihat ulang struk                              |
| Stok Barang | `/stok`    | Tambah/ubah barang, daftarkan barcode, atur **jenis** per barang, atur stok                            |
| Profil      | `/profil`  | Akun, info toko, pengaturan struk, **kelola kasir** (pemilik), pengaturan, keluar                      |
| Struk       | (sheet)    | Struk transaksi di layar; tombol Selesai                                                               |

Navigasi: **navbar bawah ala aplikasi native** (Kasir · Riwayat · Stok · Profil). Detail di §12.

## 3. Peran & Hak Akses

| Kemampuan                                   | Pemilik                             | Kasir                        |
| ------------------------------------------- | ----------------------------------- | ---------------------------- |
| Transaksi di halaman Kasir                  | ✅                                  | ✅                           |
| Lihat daftar barang & stok                  | ✅                                  | ✅ (hanya lihat)             |
| Tambah/ubah/nonaktifkan barang, jenis, stok | ✅                                  | ❌                           |
| Riwayat & rekap                             | Semua kasir (bisa filter per kasir) | Hanya transaksi **miliknya** |
| Ubah info toko & isi struk                  | ✅                                  | ❌                           |
| Kelola kasir (tambah, nonaktifkan)          | ✅                                  | ❌                           |

Hak akses **ditegakkan di Firestore Rules**, bukan cuma disembunyikan di UI.

### Alur akun (tanpa halaman daftar terpisah)

Satu tombol "Masuk dengan Google". Setelah login, aplikasi memeriksa status akun:

```
Login Google
   │
   ├─ sudah terdaftar di sebuah toko?   ──► masuk (peran: pemilik / kasir)
   │
   ├─ email ada di undangan kasir?      ──► otomatis jadi kasir di toko itu ──► masuk
   │
   └─ bukan keduanya                    ──► /mulai: isi nama toko ──► jadi pemilik toko baru
```

**Menambah kasir (oleh pemilik)**: Profil → Kelola Kasir → "Tambah kasir" → isi **email Google** kasir
dan nama panggilan. Kasir cukup membuka aplikasi lalu login dengan Google tersebut; tidak ada kata sandi
yang dibuat atau dibagikan.

- Email yang sudah terdaftar di toko lain (sebagai pemilik atau kasir) **ditolak**, sesuai aturan 1 akun = 1 toko.
- Status kasir di daftar: _Menunggu login pertama_ → _Aktif_ → (bisa) _Nonaktif_.
- Menonaktifkan kasir langsung memutus aksesnya; riwayat transaksinya tetap ada.

## 4. Konsep Kunci: Barang & Jenis (Varian)

Satu barang punya banyak **jenis** dengan harga berbeda. Contoh rokok:

| Jenis     | Harga  | Isi (satuan dasar) |
| --------- | ------ | ------------------ |
| 1 bungkus | 30.000 | 20 batang          |
| 1 batang  | 2.000  | 1 batang           |
| 3 batang  | 5.500  | 3 batang           |

**Stok disimpan dalam satuan dasar** (batang). Tiap jenis punya `baseQty`; menjual 1 bungkus mengurangi
stok 20 batang. Stok antar jenis tidak mungkin tidak sinkron.

- Barcode ada di level **barang**; opsional barcode khusus per jenis.
- Scan/klik barang → **bottom sheet pilih jenis** → masuk keranjang. Barang berjenis tunggal langsung masuk.
- Stok boleh tidak dilacak (`trackStock: false`).

## 5. Stack

| Kebutuhan            | Pilihan                                                                                | Alasan                                                  |
| -------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Build & UI           | Vite + React + TypeScript (strict)                                                     | Cepat, ringan                                           |
| Styling              | Tailwind CSS 4 + token warna navy                                                      | Konsisten, bundle kecil                                 |
| Routing              | React Router                                                                           | Standar                                                 |
| Backend              | Firebase: Auth (Google) + Firestore                                                    | Login & database realtime tanpa server sendiri          |
| Hosting              | **Vercel** (deploy otomatis dari GitHub `GilangChandra88/kasir-nia`)                   | HTTPS otomatis (wajib untuk kamera), preview per branch |
| State UI / keranjang | Zustand                                                                                | Kecil, tanpa boilerplate                                |
| Validasi             | Zod                                                                                    | Validasi form & dokumen Firestore                       |
| Scan kamera          | `BarcodeDetector` bawaan Chrome Android + polyfill `barcode-detector` sebagai cadangan | Cepat di Android, tetap jalan di browser lain           |
| Animasi              | `motion` dengan `LazyMotion` + CSS                                                     | Halus tapi ringan                                       |
| Ikon                 | `lucide-react`                                                                         | Bersih, tree-shakeable                                  |
| Font                 | Plus Jakarta Sans (self-host via Fontsource)                                           | Ramah, jelas, tanpa permintaan ke Google Fonts          |
| PWA                  | `vite-plugin-pwa`                                                                      | Bisa di-install, aset ter-cache                         |
| Test                 | Vitest + Testing Library + Firebase Emulator                                           | Logika uang, stok, dan Rules wajib teruji               |
| Kualitas             | ESLint + Prettier + `npm run check`                                                    | Gerbang sebelum dianggap selesai                        |

## 6. Arsitektur (Clean, per Fitur)

```
src/
├── app/            Router, provider, penjaga rute. Tanpa logika bisnis.
├── pages/          Satu file per rute. Hanya menyusun fitur.
├── features/
│   ├── auth/       Login Google, onboarding (buat toko / klaim undangan)
│   ├── checkout/   Kasir: scanner, pencarian, keranjang, pilih jenis, bayar tunai
│   ├── receipt/    Tampilan struk (sheet)
│   ├── history/    Rekap & daftar transaksi
│   ├── inventory/  Daftar barang, form barang + jenis, registrasi barcode
│   ├── team/       Kelola kasir (daftar, tambah email, nonaktifkan)
│   └── profile/    Kartu akun, info toko, pengaturan struk, pengaturan, keluar
├── components/
│   ├── ui/         Button, Sheet, Badge, Input, Switch, Toast, EmptyState, SettingRow
│   ├── layout/     AppShell, BottomNav, PageHeader, OfflineBanner
│   └── motion/     Pembungkus animasi (FadeIn, PopIn, SheetTransition, CountUp)
├── domain/         LOGIKA MURNI. Tanpa React, tanpa Firebase.
│   ├── money.ts        Format rupiah, penjumlahan integer
│   ├── cart.ts         Tambah/ubah/hapus item, hitung total
│   ├── payment.ts      Validasi uang diterima, hitung kembalian
│   ├── stock.ts        Pengurangan stok dari baseQty
│   ├── receipt.ts      Susun model struk dari transaksi + pengaturan toko
│   ├── report.ts       Rekap harian/mingguan
│   ├── permissions.ts  Apa yang boleh dilakukan tiap peran
│   └── types.ts        Product, Variant, CartItem, Sale, Member, Role
├── data/           AKSES FIREBASE. Satu-satunya tempat yang mengimpor firebase.
│   ├── firebase.ts       Init app, auth, firestore (cache lokal)
│   ├── membershipRepo.ts Keanggotaan, undangan kasir, buat toko
│   ├── storeRepo.ts      Info toko & pengaturan struk
│   ├── productRepo.ts    CRUD barang + jenis, cari by barcode
│   ├── saleRepo.ts       Simpan transaksi (atomik), baca riwayat
│   └── schemas.ts        Skema Zod dokumen Firestore
├── store/          Zustand: keranjang, sesi (user, toko, peran), status online
├── lib/            Utilitas kecil lintas lapisan (cn, format tanggal)
├── config/         Konstanta (batas, durasi animasi) dengan satuan
├── theme/          Palet warna (satu-satunya tempat hex)
└── styles/         CSS global + token Tailwind
```

Arah impor (kiri boleh mengimpor kanan, tidak sebaliknya):

```
pages → features → components → store/data → domain → lib/config/theme
```

- `domain/` murni dan mudah di-test, tidak tahu Firebase maupun React.
- Komponen tidak memanggil Firestore langsung; semuanya lewat hook yang memakai repository.
- Struk disusun oleh `domain/receipt.ts` (model data), lalu ditampilkan oleh komponen. Saat printer
  Bluetooth ditambahkan nanti, model yang **sama** cukup diubah ke perintah printer; tidak ada logika ganda.
- Izin diperiksa lewat `domain/permissions.ts` (satu sumber kebenaran untuk UI), dan diulang di Rules.
- Komponen maksimal 200 baris, satu komponen per file, named export, tanpa `any`.

## 7. Model Data Firestore

```
users/{uid}                          ← pintu masuk setelah login (1 akun = 1 toko)
   storeId, role ("owner" | "cashier"), displayName, email, photoURL

invites/{emailLower}                 ← penunjuk undangan, dicari kasir saat login (ID = email)
   storeId, storeName, displayName, invitedBy, createdAt

stores/{storeId}
   ├─ name, address?, phone?, ownerUid, createdAt, lowStockThreshold
   ├─ receipt: { headerNote?, footerNote, showCashier }
   │
   ├─ members/{uid}                  ← siapa saja yang boleh akses toko ini
   │    role, displayName, email, isActive, joinedAt
   │
   ├─ invites/{emailLower}           ← salinan undangan untuk daftar "Kelola Kasir" pemilik
   │    (isi sama dengan invites/{email}; keduanya ditulis & dihapus dalam satu transaksi)
   │
   ├─ products/{productId}
   │    name, barcode?, category, baseUnit ("batang"), stock, trackStock, isActive,
   │    variants: [ { id, label: "1 bungkus", price (rupiah), baseQty } ],     ← barcode per jenis: lanjutan
   │    createdAt, updatedAt
   │
   ├─ barcodes/{barcode}             ← menjamin barcode unik per toko, pencarian scan = 1 baca
   │    productId, variantId?
   │
   ├─ sales/{saleId}                 ← tambah-saja (tidak bisa diubah/dihapus dari klien)
   │    receiptNo, createdAt, cashierUid, cashierName,
   │    total, itemCount, cashReceived, change,
   │    items: [ { productId, variantId, name, variantLabel, price, qty, baseQty } ]  ← SNAPSHOT
   │
   └─ dailyStats/{yyyy-MM-dd}_{cashierUid}
        date, cashierUid, total, saleCount, itemCount     ← agregat per kasir per hari
```

Keputusan penting:

- **Uang = integer rupiah**, tidak pernah float.
- **Item transaksi = snapshot** (nama & harga saat itu), jadi mengubah harga tidak merusak riwayat.
- **Struk di riwayat** disusun ulang dari snapshot transaksi + nama/alamat toko saat ini.
- **Varian di dalam dokumen barang**: satu baca dapat semuanya; stok + varian berubah atomik.
- **`users/{uid}`** membuat pencarian toko setelah login hanya 1 baca, sekaligus menegakkan 1 akun = 1 toko.
- **`dailyStats` per kasir per hari**: rekap pemilik = jumlahkan dokumen minggu itu (7 hari × jumlah
  kasir, kecil); rekap kasir = hanya dokumennya sendiri.
- Pencarian barang: filter di klien dari daftar barang yang sudah ter-cache.
- **Menonaktifkan** barang/kasir = `isActive: false`, bukan hapus, agar riwayat utuh.
- Nomor struk (`receiptNo`) = tanggal + kode pendek dari ID transaksi, mis. `261013-K7Q2`.

### Alur simpan transaksi (atomik, wajib online)

`runTransaction`:

1. Baca semua produk di keranjang.
2. Validasi stok cukup (untuk barang yang dilacak), hitung `stock - qty × baseQty`.
3. Tulis `sales/{id}`, update stok, `increment` ke `dailyStats/{tanggal}_{uid}`.
4. Gagal salah satu → semua batal. Tidak ada stok/penjualan setengah jalan.

## 8. Keamanan

- **Auth**: Google Sign-In (popup; fallback redirect bila popup diblokir).
- **Firestore Rules** (ringkas):
  - `stores/{id}/**` hanya bisa diakses anggota **aktif** toko tersebut (cek `members/{uid}`).
  - Tulis `products`, `barcodes`, info toko, `receipt`, `members` hanya **pemilik**.
  - `sales`: kasir boleh **membuat** dengan `cashierUid == auth.uid`; tidak boleh ubah/hapus. Kasir hanya
    boleh **membaca** transaksi miliknya; pemilik membaca semua.
  - `dailyStats`: kasir hanya boleh tulis/baca dokumen berakhiran uid-nya.
  - `users/{uid}`: hanya pemiliknya yang bisa membaca; dibuat sekali (tidak bisa pindah toko sendiri).
  - `invites/{email}`: dibuat pemilik toko terkait; penerima hanya bisa membaca undangan yang cocok dengan
    `request.auth.token.email` (terverifikasi), dan mengklaimnya menjadi keanggotaan.
  - Validasi: harga & qty integer ≥ 0; email undangan dinormalkan huruf kecil.
- Konfigurasi Firebase (`VITE_FIREBASE_*`) di `.env.local`, tidak masuk Git. Kunci web Firebase memang
  publik; keamanannya ada di Rules dan daftar domain terotorisasi.

## 9. Offline: Hanya Lihat

Aplikasi sengaja **tidak** mendukung transaksi tanpa sinyal, supaya stok dan riwayat selalu konsisten.

- Firestore memakai cache lokal (`persistentLocalCache`), jadi daftar barang & riwayat terakhir tetap
  bisa **dilihat** saat sinyal hilang.
- Hook `useOnlineStatus` (event `online`/`offline` + deteksi kegagalan Firestore) memberi status global.
- Saat offline:
  - `OfflineBanner` turun halus di atas: _"Tidak ada internet. Anda hanya bisa melihat data."_
  - Tombol **Bayar**, simpan barang, ubah stok, kelola kasir **dinonaktifkan** dengan penjelasan.
  - Keranjang tetap boleh diisi; saat sinyal kembali, banner hijau singkat lalu tombol aktif lagi.
- Penyimpanan transaksi dibungkus batas waktu (±10 detik) dan pesan galat jelas
  ("Transaksi gagal disimpan, coba lagi"). Keranjang **tidak dikosongkan** bila gagal.
- Target Lighthouse mobile: Performance ≥ 90; library scanner dimuat malas (hanya saat kamera dibuka).

## 10. Halaman Kasir, Riwayat, Stok

### Kasir (HP, dari atas ke bawah)

1. **Bar pencarian** + tombol kamera.
2. **Hasil pencarian / pilihan cepat**.
3. **Keranjang** (qty +/−, geser untuk hapus).
4. **Panel total** menempel tepat di atas navbar: total besar + tombol **Bayar**.

- **Scan kamera**: overlay layar penuh, kamera belakang; terbaca → getar + bip → sheet pilih jenis.
- **Scanner fisik (Bluetooth/OTG)**: input tersembunyi selalu fokus, menangkap ketikan cepat + Enter,
  tanpa memunculkan keyboard virtual.
- **Bayar tunai**: total, input uang diterima (tombol cepat: Uang pas, 10rb, 20rb, 50rb, 100rb), kembalian
  otomatis, tombol Simpan aktif jika uang ≥ total.
- Setelah berhasil: animasi centang → **sheet Struk** (§11) → "Selesai" mengosongkan keranjang.
- Kode yang sama terbaca ulang < ±1,5 detik diabaikan.
- Barcode tak dikenal → pemilik: _"Daftarkan barang baru dengan barcode ini"_; kasir: pesan untuk memberi
  tahu pemilik.

### Riwayat

- **Hari ini** dan **Minggu ini** (total omzet, jumlah transaksi, jumlah item) + mini grafik batang 7 hari
  (SVG sederhana, tanpa library grafik).
- Pemilik: filter per kasir ("Semua kasir" / nama kasir). Kasir: hanya miliknya.
- Daftar dikelompokkan per hari; ketuk → **struk** transaksi tersebut.
- Paginasi 20 per halaman. Minggu mulai **Senin**; zona waktu perangkat.

### Stok (pemilik edit, kasir hanya lihat)

- Daftar barang + pencarian + penanda stok menipis/habis.
- **Form barang**: nama, kategori, satuan dasar, stok awal, barcode, lacak stok.
- **Editor jenis**: baris `label · harga · isi (baseQty)`; minimal satu. Template cepat "Bungkus + eceran".
- **Registrasi barcode** memakai scanner yang sama; barcode ganda → peringatan menyebut barang pemiliknya.
- **Penyesuaian stok**: "Stok masuk" (bisa per bungkus, dikali isinya) atau "Koreksi" (hasil hitung rak),
  dihitung dari stok terbaru di server agar tidak menimpa penjualan.

## 11. Struk (tampil di layar)

Muncul sebagai sheet setelah transaksi berhasil, dan bisa dibuka lagi dari Riwayat. Tampilannya meniru
kertas struk thermal (putih, font rapi, tepi bergerigi halus) agar mudah ditunjukkan ke pembeli.

```
        TOKO NIA JAYA            ← nama toko (tebal, tengah)
   Jl. Raya Mawar No. 12         ← alamat
       Telp 0812-3456-7890       ← telepon
       Buka 07.00–22.00          ← catatan atas (opsional)
================================
No   : 261013-K7Q2
Waktu: 13/10/2026 14:32
Kasir: Sari                      ← bisa disembunyikan
--------------------------------
Rokok Merk A
 1 bungkus   2 x 30.000  60.000
Permen
 1 butir     3 x    500   1.500
--------------------------------
TOTAL                    61.500
TUNAI                   100.000
KEMBALI                  38.500
================================
   Terima kasih, datang lagi!    ← catatan penutup
```

- `domain/receipt.ts` (murni, teruji) menyusun model struk: kepala, daftar baris, total, penutup.
- Komponen `ReceiptSheet` hanya menampilkan model tersebut.
- Pengaturan struk ada di **Profil** (pemilik): nama toko, alamat, telepon, catatan atas, catatan penutup,
  tampilkan nama kasir, dengan **pratinjau langsung**.

### Rencana tahap lanjutan: printer Bluetooth

Disiapkan secara arsitektur, dikerjakan setelah v1 rilis:

- Web Bluetooth tersedia di **Chrome Android** (perangkat target), tapi hanya untuk printer **BLE**. Banyak
  printer thermal murah memakai Bluetooth Classic dan **tidak bisa** disambung dari web, jadi model
  printer harus dicek lebih dulu.
- Implementasi: modul `printing/` berisi `escpos.ts` (model struk → perintah ESC/POS, murni) dan
  `bluetoothPrinter.ts` (adapter), plus pengaturan "Sambungkan printer" & "Cetak otomatis" di Profil.
- Model struk dari `domain/receipt.ts` dipakai ulang tanpa perubahan.

## 12. Desain Visual: Navy & Bersih

### Navbar bawah (ala aplikasi)

- 4 tab: **Kasir · Riwayat · Stok · Profil**, ikon di atas label kecil.
- Latar putih, garis atas tipis, sudut atas membulat; menghormati area aman layar
  (`env(safe-area-inset-bottom)`).
- Tab aktif: ikon navy + label tebal + "pil" `navy-100` yang meluncur antar tab (shared layout).
- Ikon memantul kecil saat dipilih; badge jumlah item di tab Kasir bila keranjang berisi.
- Tinggi ±64 px, target sentuh penuh per tab.
- Disembunyikan saat keyboard terbuka atau scanner layar penuh aktif.
- Konten diberi `padding-bottom` setinggi navbar; panel total Kasir menempel tepat di atasnya.
- Layar ≥ 768 px: menjadi **sidebar kiri** dengan komponen yang sama. Layout memakai `100dvh`.

### Profil (isi tergantung peran)

1. **Kartu akun**: foto Google, nama, email, lencana peran ("Pemilik" / "Kasir").
2. **Info toko**: nama, alamat, telepon (pemilik bisa ubah lewat sheet).
3. **Ringkasan singkat**: jumlah barang, transaksi hari ini.
4. **Kelola Kasir** _(pemilik)_: daftar kasir dengan status, tambah lewat email, nonaktifkan/aktifkan.
5. **Pengaturan Struk** _(pemilik ubah, kasir lihat)_: lihat §11.
6. **Pengaturan**: bunyi bip scan, getar scan, batas stok menipis. Dibuat dari daftar `SettingRow`
   sehingga pengaturan baru ke depan cukup menambah satu baris.
7. **Tentang**: versi aplikasi, tombol "Pasang ke layar utama".
8. **Keluar**: tombol outline merah, dengan konfirmasi.

Pengaturan perangkat (bip, getar) di `localStorage`; pengaturan toko di Firestore.

### Palet (token didefinisikan sekali di `theme/palette.ts` dan `styles/index.css`)

| Token      | Nilai     | Pakai untuk                        |
| ---------- | --------- | ---------------------------------- |
| `navy-950` | `#0B1B3A` | Teks utama, tombol utama, header   |
| `navy-800` | `#14285A` | Hover/tekan tombol utama           |
| `navy-600` | `#2347A8` | Aksen, tautan, cincin fokus        |
| `navy-100` | `#E3EAFB` | Latar chip, item terpilih, pil tab |
| `navy-50`  | `#F1F5FE` | Latar lembut kartu sorotan         |
| `paper`    | `#F5F7FC` | Latar halaman                      |
| `card`     | `#FFFFFF` | Kartu, sheet, navbar               |
| `line`     | `#E2E8F3` | Garis tipis                        |
| `muted`    | `#64748B` | Teks sekunder                      |
| `success`  | `#16A37A` | Sukses, stok aman, online kembali  |
| `warning`  | `#E8A317` | Stok menipis, offline              |
| `danger`   | `#D64545` | Hapus, stok habis, keluar          |

Prinsip: banyak ruang kosong, kartu putih `rounded-2xl` dengan bayangan lembut, satu tombol utama per
layar, target sentuh ≥ 44 px, angka uang `tabular-nums`, kontras WCAG AA.

## 13. Animasi: Halus, Lucu, Ringan

Hanya animasikan `transform` dan `opacity`, durasi 150–300 ms, spring lembut. Hormati
`prefers-reduced-motion`. `motion` dimuat lewat `LazyMotion` (fitur `domAnimation`).

| Momen                       | Animasi                                                       |
| --------------------------- | ------------------------------------------------------------- |
| Pindah halaman              | Fade + geser 8 px                                             |
| Navbar bawah                | Pil aktif meluncur, ikon memantul                             |
| Barang masuk keranjang      | Item pop-spring; ikon keranjang bergoyang kecil               |
| Ubah qty / total            | Angka roll/count-up pendek                                    |
| Hapus item                  | Geser keluar, sisanya menutup celah halus                     |
| Bottom sheet (jenis, bayar) | Naik dengan spring, latar redup, bisa ditarik turun           |
| Scan berhasil               | Bingkai berkedip hijau + getar; kartu barang pop              |
| Bayar sukses                | Centang SVG tergambar + confetti kecil                        |
| Struk muncul                | Kertas struk "keluar" dari atas seperti dari mesin kasir      |
| Offline / kembali online    | Banner turun/naik halus; hijau singkat saat pulih             |
| Daftar kosong / loading     | Skeleton shimmer; maskot SVG kecil melayang                   |
| Tombol                      | Menekan `scale 0.97`, melepas kembali dengan pegas            |
| Profil                      | Kartu muncul bertahap (stagger); saklar bergeser dengan pegas |
| Toast                       | Masuk dari atas dengan pegas, hilang otomatis                 |

Sentuhan "lucu" murah: maskot/ikon SVG sederhana di status kosong & layar sukses, kalimat ramah
("Belum ada transaksi hari ini, semangat! ☕"). Tanpa video/Lottie berat.

## 14. Pengujian

- **Wajib (Vitest)**: `domain/*` (total, kembalian, konversi stok, model struk, rekap & batas minggu,
  permissions), `data/schemas`, aksi store (keranjang).
- **Komponen kunci**: sheet pilih jenis, editor jenis, alur bayar tunai, banner offline.
- **Firestore Rules** dengan Emulator: pemilik boleh; kasir hanya baca/tulis yang diizinkan; kasir
  nonaktif ditolak; orang luar ditolak; `sales` tidak bisa diubah/dihapus; undangan hanya bisa diklaim
  oleh email yang cocok; email yang sudah punya toko tidak bisa diundang.
- **Uji perangkat nyata**: scanner kamera & scanner fisik di HP Android.
- Gerbang: `npm run check` = typecheck + lint + format + test, bersih tanpa warning.

## 15. Tahapan Pengerjaan

| Tahap | Isi                                                                                                                                                                                                                             | Hasil yang bisa dicoba                               |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 0     | Setup: Vite+TS, Tailwind, ESLint/Prettier/Vitest, struktur folder, token navy, font, PWA dasar                                                                                                                                  | Halaman sambutan navy + `npm run check` lulus        |
| 1     | Firebase (Auth Google, Firestore, `.env`, `firestore.rules`), Vercel (`vercel.json`), `users`/`members`, onboarding buat toko, penjaga rute, `AppShell` + `BottomNav` 4 tab, Profil dasar (kartu akun, keluar), `OfflineBanner` | Login, buat toko, pindah 4 tab, keluar               |
| 2     | **Stok**: `domain` (money/types/permissions), skema Zod, `productRepo`, daftar & form barang, editor jenis, barcode unik (ketik/scanner fisik), atur stok                                                                       | Tambah barang + jenis tersimpan                      |
| 3     | **Scanner**: `BarcodeScanner` (kamera), hook scanner fisik, tombol scan di form stok                                                                                                                                            | Scan barcode ke form, deteksi duplikat               |
| 4     | **Kasir**: pencarian, sheet pilih jenis, keranjang, total, alur bayar tunai, blokir saat offline                                                                                                                                | Transaksi lengkap di layar                           |
| 5     | **Simpan transaksi**: `saleRepo` atomik, kurangi stok, `dailyStats`, animasi sukses, penanganan gagal                                                                                                                           | Transaksi tersimpan, stok berkurang                  |
| 6     | **Struk**: `domain/receipt`, `ReceiptSheet`, pengaturan struk + pratinjau di Profil                                                                                                                                             | Struk muncul setelah bayar                           |
| 7     | **Kelola Kasir**: `team` (tambah email, nonaktifkan), klaim undangan saat login, pembatasan UI per peran                                                                                                                        | Kasir login Google & hanya melihat menu sesuai peran |
| 8     | **Riwayat**: rekap hari ini/minggu ini, mini grafik, daftar, buka struk, filter per kasir, paginasi                                                                                                                             | Rekap akurat per peran                               |
| 9     | **Poles**: animasi lengkap (§13), skeleton, status kosong, toast, aksesibilitas, reduced-motion, Profil lengkap                                                                                                                 | Terasa halus dan ramah                               |
| 10    | **Keamanan & rilis**: Firestore Rules + tes emulator, Lighthouse, deploy produksi Vercel, uji HP Android asli                                                                                                                   | Aplikasi live dengan HTTPS, bisa di-install          |

Tiap tahap berakhir dengan `npm run check` lulus dan commit (Conventional Commits). Stok & scanner
didahulukan karena Kasir tidak bisa dites nyata tanpa data barang. Rules ditulis bertahap sejak
Tahap 1 dan dilengkapi di Tahap 10.

## 16. Di Luar Cakupan v1 (tahap lanjutan)

Cetak struk ke printer Bluetooth (§11), bagikan struk (WhatsApp), harga modal & laba, diskon, catatan
transaksi, QRIS/transfer, transaksi offline, satu akun di banyak toko, ekspor laporan, tema gelap.
Struktur data & arsitektur sudah disiapkan sehingga bisa ditambah tanpa migrasi besar.
