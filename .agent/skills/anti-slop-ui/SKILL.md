---
name: anti-slop-ui-and-clean-architecture
description: Gunakan skill ini setiap kali membuat halaman UI baru, merombak tampilan komponen frontend, atau mengimplementasikan fitur end-to-end agar desain terlihat natural buatan desainer profesional dan bebas bug.
---

# Anti-Slop UI & End-to-End Feature Skill

## Checklist Sebelum Membuat UI:

1. **Tentukan Karakter Visual:** Pilih salah satu gaya yang cocok dengan project (Minimalist SaaS, Editorial Clean, Warm E-Commerce, atau High-Density Dashboard).
2. **Audit Komponen Eksisting:** Cek folder `components/` terlebih dahulu. Gunakan ulang (reuse) button, input, modal, dan warna tema yang sudah ada agar satu project tetap konsisten.
3. **Data Realistis:** Saat membuat _mock data_ atau _seed data_, gunakan nama produk, harga (contoh: format `Rp 145.000`), tanggal, dan status yang masuk akal sesuai konteks aplikasi.

## Checklist Setelah Menulis Kode:

1. Pastikan tidak ada _missing import_ atau _broken path_.
2. Pastikan semua tombol dan _form_ memiliki fungsi _handler_ yang jelas (tidak mati saat diklik).
3. Jalankan pengecekan _build/lint_ di terminal dan perbaiki jika ada _warning_ atau _error_.
4. Perbarui file `PROJECT_STATE.md` sebelum menutup tugas.
