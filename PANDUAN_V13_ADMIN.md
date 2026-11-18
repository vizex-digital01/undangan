# VIZEX v13 — Panduan upgrade Admin Control Center

## Sebelum mulai

Cadangkan database Supabase dan commit GitHub saat ini. Jangan unggah `.env` atau key Supabase ke GitHub. Migrasi ini **tambahan** atas v12 (schema.sql + seabank_migration.sql + guest_checkout_migration.sql harus sudah terpasang).

## Instalasi

1. Ekstrak ZIP, upload **isi folder VIZEX_v13** ke root repository GitHub VIZEX (jangan menumpuk folder pembungkus).
2. Supabase → SQL Editor → New Query, salin dan jalankan `supabase/v13_admin_migration.sql` sekali.
3. Vercel → Environment Variables: pertahankan `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `VIZEX_ADMIN_USER_IDS`, `SEABANK_ACCOUNT_NUMBER`, `SEABANK_ACCOUNT_NAME`.
4. Pastikan Vercel build berstatus Ready, lalu buka `/login` → `/admin`.

## Menu

- Ringkasan: total pesanan, menunggu verifikasi, undangan terbit, pendapatan disetujui.
- Pesanan: tabel dengan pencarian dan ekspor CSV.
- Pembayaran: tetap di `/admin/payments` (bukti dan setuju/tolak). Selalu cocokkan mutasi SeaBank sebelum approve.
- Undangan: daftar dan menonaktifkan publikasi. Mengaktifkan ulang hanya jika ada pesanan berstatus `paid`.
- Template: aktif/nonaktif dan ubah nama/deskripsi dari 12 template dasar. **Harga tetap mengikuti paket 19/29/39/59 ribu yang terpasang di server**, bukan setting browser. Menambah template desain/animasi baru masih perlu kode baru.
- Pelanggan: nama/WhatsApp yang dimasukkan ke editor v13. Draft lama tanpa kontak tidak otomatis berisi data pelanggan.
- Analitik: data paling baru (dibatasi maksimal 1000 data); CSV tabel maksimal 100. Bukan laporan akuntansi final.
- Pengaturan: informasi dukungan/pengumuman disimpan di DB; belum semua digunakan di tampilan publik. Rekening SeaBank dan UID admin tetap hanya lewat environment variables Vercel.
- Notifikasi: catatan pembayaran baru, aksi admin, serta daftar bukti menunggu verifikasi. Bukan email/WA push.
- Audit: menyimpan tindakan admin seperti persetujuan pembayaran, perubahan template/pengaturan, dan status undangan.

## Pengujian penting sebelum digunakan publik

1. Login admin dengan UID di `VIZEX_ADMIN_USER_IDS`; akun selain admin harus menerima HTTP 403 dari `/api/admin/v13`.
2. Buka VIZEX dari Incognito, pilih template, custom tanpa login, isi kontak pemesan, simpan, checkout.
3. Upload bukti **uji**; pastikan pesanan tampak di `/admin/payments` dan menu notifikasi.
4. **Jangan approve kecuali dana sungguh masuk** di mutasi SeaBank. Uji akun/undangan yang belum lunas tidak bisa diakses lewat `/invite/[slug]`.
5. Coba Nonaktifkan pada undangan berbayar yang sudah terbit. Pastikan link tidak dapat dibuka; aktifkan ulang hanya saat status paid.
6. Nonaktifkan satu template lalu pastikan menghilang dari katalog dan endpoint POST draft menolak ID tersebut.
7. Jika muncul 500 di `/api/admin/v13`, periksa Vercel Functions Logs dan apakah migrasi v13 sudah dijalankan.

## Pembatasan dan keamanan

- Seluruh rute admin v13 memeriksa JWT Supabase dan UID admin di server sebelum memakai service-role.
- Tidak ada akses publik ke tabel admin. Bukti pembayaran tetap di private bucket; signed URL hanya diterbitkan oleh API admin lama.
- Sesi pelanggan berbasis cookie HttpOnly 30 hari, sehingga pindah perangkat/hapus cookie dapat menghilangkan akses draft.
- Pengujian build penuh dan transaksi nyata harus dilakukan pada deployment Vercel sebelum menerima uang pelanggan.
