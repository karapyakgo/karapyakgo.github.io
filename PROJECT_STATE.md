# PROJECT STATE: Web Karapyak (Karapyak Travel)

Dokumen ini merupakan catatan memori utama (_single source of truth_) untuk konteks, status arsitektur, dan riwayat perkembangan proyek `web-karapyak`. Wajib dibaca dan diperbarui secara otomatis setiap kali ada perubahan fitur, perbaikan bug, atau restrukturisasi kode.

---

## 1. Project Overview & Environment

- **Project Name:** Karapyak Travel (`karapyakgo.github.io`)
- **Location:** `C:\Users\Lenovo\Herd\web-karapyak` (Laravel Herd Workspace)
- **GitHub Organization:** `https://github.com/karapyakgo`
- **GitHub Repository:** `https://github.com/karapyakgo/karapyakgo.github.io`
- **Production Live URL:** `https://karapyakgo.github.io/`
- **Konsep:** Platform digital pemesanan tiket resmi, jasa pemandu wisata lokal, dan paket wisata Pantai Karapyak (Bagolo, Kalipucang, Kab. Pangandaran) secara terpadu.
- **Teknologi:** Pure HTML5, CSS3, & Vanilla JavaScript (sesuai instruksi ketat pengguna tanpa framework berat).
- **Environment & Runtimes:**
  - **Local Dev Server:** PHP 8.4.8 Built-in Server (`http://127.0.0.1:8000`)
  - **Git Remote:** `origin` -> `https://github.com/karapyakgo/karapyakgo.github.io.git` (branch `main`)
  - **Node.js:** v24.2.0 (`npm.cmd` v11.3.0)
  - **Composer:** 2.10.3
  - **OS:** Windows

---

## 2. Tech Stack & Key Libraries

- **Frontend Core:** Semantik HTML5, Modern CSS3 kustom dengan estetika senior product designer (Grounded Coastal Slate/Teal & Carbon, subtle borders, tanpa AI slop).
- **Responsive Architecture (Mobile First):**
  - **Mobile Navigation:** Hamburger menu & slide-out navigation drawer (`.mobile-drawer-overlay`).
  - **Mobile Sticky Bar:** Floating bottom action bar dengan harga live & tombol pesan instan (pengalaman e-commerce/travel native).
  - **Mobile Modals:** Transformasi menjadi _bottom sheet_ elegan pada layar `< 640px` dengan scroll lock.
  - **Touch Ergonomics:** Tombol stepper (`+` / `-`) dan kartu pilihan diperbesar hingga minimal 44px touch target, font input 16px untuk mencegah auto-zoom iOS Safari.
- **Interactive Engine:**
  - `scripts/data.js`: Dataset terverifikasi mencakup tiket masuk, 4 pemandu lokal, 4 paket wisata, pilihan transportasi, aktivitas tambahan, destinasi sekitar, dan mitra UMKM.
  - `scripts/calculator.js`: Kalkulator biaya dinamis real-time (mencakup breakdown transparan 100% dan simulasi standar Slide 6 seharga Rp 350.000).
  - `scripts/app.js`: Pengendali UI, event binding, sinkronisasi kalkulator reaktif, modal pemesanan, mobile drawer, dan generator E-Voucher tiket digital.
- **Assets:** Ilustrasi vektor SVG kustom untuk lanskap tebing karang Pantai Karapyak (`hero-karapyak.svg`), avatar pemandu lokal, dan spot destinasi sekitar.

---

## 3. Directory Structure Summary

```text
web-karapyak/
├── .agent/
│   └── skills/
│       └── anti-slop-ui/
│           └── SKILL.md       # Panduan Anti-Slop UI & Clean Architecture
├── assets/
│   └── images/
│       ├── hero-karapyak.svg  # Ilustrasi lanskap tebing putih Pantai Karapyak
│       ├── guide-asep.svg     # Avatar Kang Asep Hidayat
│       ├── guide-rina.svg     # Avatar Teh Rina Nurmalasari
│       ├── guide-dedi.svg     # Avatar Kang Dedi Rustandi
│       ├── guide-yana.svg     # Avatar Kang Yana Mulyana
│       ├── dest-tebing.svg    # Spot Tebing Karang Putih
│       ├── dest-sunset.svg    # Spot Sunset Deck Karapyak Glamping
│       ├── dest-mangrove.svg  # Spot Konservasi Mangrove Bagolo
│       └── dest-lembah.svg    # Spot Pasir Putih Pantai Lembah Putri
├── styles/
│   └── main.css               # Design system, layout responsif mobile 375px+, bottom sheet, & print style
├── scripts/
│   ├── data.js                # Data model resmi, tiket, pemandu, UMKM
│   ├── calculator.js          # Engine kalkulator biaya dinamis & transparan
│   └── app.js                 # Integrasi DOM, mobile drawer, floating bar, reactive receipt & WhatsApp bridge
├── index.html                 # Halaman utama implementasi 5 Alur Wisatawan (Desktop + Mobile)
├── GEMINI.md                  # Workspace OS & Zero-Reask Operating Rules
└── PROJECT_STATE.md           # Memori utama status proyek (file ini)
```

---

## 4. Completed Features & Recent Changes

Sesuai 5 Alur Wisatawan pada dokumen PDF (`karapyakgo.github.io`):

- [x] **Langkah 1: Eksplorasi Informasi Pantai Karapyak:**
  - Header navigasi desktop & hamburger menu drawer di HP.
  - Ribbon indikator 5 alur dengan touch-swipe horizontal mulus tanpa scrollbar kasar.
  - Informasi lokasi (Bagolo, Kalipucang, Pangandaran), jam operasional (06.00 - 18.00 WIB), aturan keselamatan karang, dan fasilitas lengkap.
- [x] **Langkah 2: Tarif Tiket Masuk & Tanggal Kunjungan:**
  - Tarif resmi terverifikasi (Dewasa Rp 15.000, Anak-anak Rp 10.000, Retribusi Parkir).
  - Stepper jumlah pengunjung yang nyaman ditekan ibu jari pada smartphone.
- [x] **Langkah 3: Direktori Tour Guide Lokal:**
  - 4 profil pemandu lokal terverifikasi (Kang Asep, Teh Rina, Kang Dedi, Kang Yana) dengan detail durasi 3 jam, keahlian bahasa (Sunda/Indo/Inggris), rating ulasan, dan spesialisasi.
- [x] **Langkah 4: Kalkulator Biaya Real-time (Sesuai Simulasi Slide 6):**
  - Estimasi otomatis: 4 Tiket Dewasa (Rp 60.000) + Tour Guide 3 Jam (Rp 150.000) + Transportasi Shuttle PP (Rp 100.000) + Aktivitas Snorkeling (Rp 40.000) = **Rp 350.000**.
  - **Fitur Khusus HP:** Floating Bottom Action Bar yang selalu menampilkan total estimasi harga secara real-time saat pengguna menggulir halaman di smartphone.
- [x] **Langkah 5: Pemesanan Online & Konfirmasi Instan:**
  - Modal formulir pemesanan dengan gaya _bottom sheet_ di layar smartphone agar tidak menutupi keyboard.
  - Generator **E-Voucher Digital** dengan kode booking unik (format `KRP-XXXXXX`).
  - Fitur cetak/simpan tiket digital dengan **Isolated Iframe Printer Engine** (mencetak tiket resmi secara mandiri tanpa elemen web luar sehingga 100% dijamin tepat 1 halaman A4 tanpa terpengaruh cache peramban).
  - Integrasi pesan WhatsApp otomatis terformat langsung ke mitra pengelola.
- [x] **Sticky Tourist Flow Ribbon & Dynamic Scroll Spy:**
  - Ribbon 5 alur dibuat sticky tepat di bawah header dengan glassmorphism (`backdrop-filter: blur(12px)`), bayangan lembut, dan status langkah aktif yang menyala (glowing aura).
  - Dilengkapi engine **Scroll Spy (`requestAnimationFrame` & `IntersectionObserver`)** di [scripts/app.js](file:///c:/Users/Lenovo/Herd/web-karapyak/scripts/app.js) yang otomatis mendeteksi posisi baca pengunjung dan memindahkan nomor aktif secara real-time.
  - **Mobile Auto-Centering:** Pada layar ponsel, langkah yang aktif otomatis digeser ke tengah layar (_smooth scrollIntoView inline_) agar tidak keluar pandangan pengguna.
  - Klik pada langkah 5 ("Pemesanan & Konfirmasi") otomatis menggulir ke struk dan memunculkan modal formulir pemesanan.
- [x] **Fluid Scroll Reveal Animations & Micro-Interactions (Anti-Slop):**
  - Animasi kemunculan konten halus saat halaman digulir (`.reveal` dan `.reveal-scale`) dengan akselerasi GPU (`cubic-bezier(0.16, 1, 0.3, 1)`).
  - Staggered timing delay (`.reveal-delay-1` s/d `4`) untuk kartu info, paket wisata, pemandu lokal, destinasi, dan mitra UMKM.
  - Efek hover interaktif yang elegan: kartu sedikit terangkat (_lift_) dan foto pemandangan membesar secara halus (_subtle zoom_).
  - Dukungan aksesibilitas penuh untuk pengguna dengan preferensi `prefers-reduced-motion`.
- [x] **Foto Lanskap Realistis:**
  - `assets/images/hero-karapyak.jpg` untuk tebing karang putih dan biota laut saat surut.
  - `assets/images/dest-tebing.jpg` dan `assets/images/dest-sunset.jpg` terpasang rapi dengan `object-fit: cover`.
- [x] **Mobile Responsiveness & Ergonomics:**
  - Layout diuji bebas overflow horizontal pada lebar layar 375px hingga 1200px.
  - Ukuran font input 16px untuk mencegah masalah auto-zoom pada peramban iOS Safari.
  - Hamburger menu drawer lengkap dengan animasi transisi halus.
- [x] **Dokumentasi & Anotasi Kode Berbahasa Indonesia (Detail, Singkat & Mudah Dimengerti):**
  - [scripts/data.js](file:///c:/Users/Lenovo/Herd/web-karapyak/scripts/data.js): Komentar lengkap pada dataset statis (info objek wisata, tarif tiket resmi, direktori 4 guide lokal, opsi transportasi lokal, katalog add-on aktivitas/kuliner, paket wisata siap pakai dengan simulasi Slide 6 Rp 350.000, destinasi sekitar, dan kemitraan UMKM).
  - [scripts/calculator.js](file:///c:/Users/Lenovo/Herd/web-karapyak/scripts/calculator.js): Penjelasan rinci arsitektur reactive state (Observer Pattern), metode `subscribe`, `notify`, `applyPackage`, `toggleActivity`, serta rincian kalkulasi 6 komponen biaya transparan dan helper `formatRupiah`.
  - [scripts/app.js](file:///c:/Users/Lenovo/Herd/web-karapyak/scripts/app.js): Komentar pada alur integrasi DOM, sinkronisasi dua arah antarmuka, mobile drawer navigation, modal booking Langkah 5, kode booking resmi acak `KRP-XXXXXX`, printer tiket 1 halaman A4 via isolated iframe, integrasi WhatsApp otomatis terformat, IntersectionObserver scroll reveal, dan dynamic scroll spy 5 alur.
  - [index.html](file:///c:/Users/Lenovo/Herd/web-karapyak/index.html): Penjelasan struktur markup semantik HTML5 yang memetakan Alur Wisatawan Langkah 1 s/d 5, formulir input, panel struk rincian, dialog modal pemesanan, kartu voucher, footer identitas tim mahasiswa, dan sticky bottom bar mobile.
  - [styles/main.css](file:///c:/Users/Lenovo/Herd/web-karapyak/styles/main.css): Penjelasan sistem token desain CSS variables, reset dasar, layout desktop & tablet, transformasi modal menjadi native-feeling bottom sheet di layar ponsel (< 640px), isolated print style untuk pencetakan dokumen A4, serta animasi scroll reveal berbasis akselerasi GPU.

- [x] **Pembaruan Avatar Pemandu & Foto Destinasi Riil:**
  - Avatar ke-4 pemandu lokal (Kang Asep, Teh Rina, Kang Dedi, Kang Yana) telah diperbarui menggunakan ikon siluet user minimalis (`assets/images/user-icon.svg` / `user-icon.png`) sesuai referensi pengguna.
  - Foto destinasi spot Mangrove (`dest-mangrove.jpg`) dan Lembah Putri (`dest-lembah.jpg`) telah aktif digunakan menggantikan placeholder SVG.
- [x] **Pembaruan Kontak Resmi WhatsApp:**
  - Nomor WhatsApp resmi mitra pengelola untuk konfirmasi booking otomatis dan kontak pemandu telah diperbarui menjadi **08158899181** (`628158899181`) di [scripts/data.js](file:///c:/Users/Lenovo/Herd/web-karapyak/scripts/data.js) dan [scripts/app.js](file:///c:/Users/Lenovo/Herd/web-karapyak/scripts/app.js).
- [x] **Ikon Tab Website (Favicon & Touch Icons):**
  - Implementasi ikon tab browser modern: format vektor tajam `favicon.svg`, binary ICO standar multi-resolusi 32x32 & 48x48 `favicon.ico`, serta raster beresolusi tinggi `favicon-32x32.png`, `favicon.png`, dan `apple-touch-icon.png` (180x180) dengan desain matahari emas pantai, tebing karang putih, dan deburan ombak berlatar Aegean Teal khas Karapyak Travel.
- [x] **Penyelarasan Logo Identitas Brand (Navbar, Mobile Drawer & Footer):**
  - Menggantikan ikon kemudi kapal/garis umum pada navbar atas, drawer mobile, dan footer dengan ikon resmi terpadu (`favicon.svg`) yang selaras 100% dengan ikon tab website.
  - Menambahkan mikro-interaksi hover yang halus (`translateY(-1px)` dan shadow glow) serta penautan kembali ke halaman beranda (`#`).
- [x] **Optimasi Workflow GitHub Actions Pages:**
  - Menetapkan `concurrency.cancel-in-progress: false` pada [.github/workflows/deploy.yml](file:///c:/Users/Lenovo/Herd/web-karapyak/.github/workflows/deploy.yml) agar deployment diantrekan dan tidak gagal karena lock *in progress deployment* saat ada push berturut-turut.

---

## 5. Pending Tasks, Known Issues & Next Steps

### Pending Tasks:

- [ ] Opsi integrasi payment gateway otomatis (Midtrans/Xendit) jika model bisnis tahap 4 (Slide 9) ingin dikembangkan lebih lanjut.
- [ ] Opsi penambahan fitur _Dark Mode_ jika dibutuhkan.

### Environment Notes:

- **Catatan Favicon Browser:** Peramban berbasis Chromium (Chrome, Edge, Brave) memiliki kebijakan keamanan sandbox bawaan yang secara sengaja tidak menampilkan custom favicon pada protokol file lokal (`file:///...`) dan menampilkan ikon globe abu-abu default. Favicon tab akan langsung tampil optimal saat dibuka via Web Server lokal (Laravel Herd `http://web-karapyak.test` / `http://localhost:8000`) atau via link live GitHub Pages (`https://karapyakgo.github.io/`) setelah refresh / clear cache.
- Web berjalan aktif pada local dev server di port 8000 (`http://127.0.0.1:8000`), Herd, atau dapat langsung diakses dengan membuka [index.html](file:///c:/Users/Lenovo/Herd/web-karapyak/index.html).
