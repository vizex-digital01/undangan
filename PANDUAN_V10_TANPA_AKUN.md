# VIZEX v10 — Tanpa akun pelanggan, admin khusus pemilik

## Apa yang berubah
- Pelanggan **tidak perlu mendaftar atau login**. Pilih template → Custom → Simpan Draft → Transfer SeaBank → Upload bukti → Tunggu admin menyetujui → Link publik aktif.
- Draft dan foto disimpan melalui token sesi tamu yang hanya berada di **cookie HttpOnly** pada browser yang sama.
- Hanya admin yang login menggunakan akun Supabase di `/login` dan membuka menu `/admin/payments`.
- Nominal pesanan dihitung di server menurut template yang dipilih. Bukti pembayaran ada di bucket privat.
- Undangan yang belum disetujui tidak tersedia di `/invite/[slug]`.

## Update project
1. Sebelum upload, simpan cadangan repository VIZEX v9.
2. Ekstrak ZIP v10, upload **isi folder `VIZEX`** ke root GitHub repo lama, menimpa file versi sebelumnya. Jangan upload folder pembungkus sebagai folder tambahan.
3. Di Supabase → SQL Editor jalankan **`supabase/guest_checkout_migration.sql`** satu kali. Migrasi v9 yang sudah berhasil tetap dipertahankan, **jangan mengulang schema.sql**.
4. Pastikan environment variables berikut masih ada di Vercel Production: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SEABANK_ACCOUNT_NUMBER`, `SEABANK_ACCOUNT_NAME`, `VIZEX_ADMIN_USER_IDS`.
5. Commit & tunggu deployment Vercel status **Ready**. Kalau migrasi SQL belum dijalankan, pembuatan draft akan gagal.
6. Buka website di mode incognito tanpa login. Pilih template, Custom, edit nama/foto, Simpan Draft, dan lihat status pembayaran.
7. Admin login lewat `https://domain-lo/login` (pakai akun Supabase admin yang UID-nya tercantum di `VIZEX_ADMIN_USER_IDS`). Buka `https://domain-lo/admin` untuk menu admin, lalu pilih **Verifikasi Pembayaran** (atau langsung `/admin/payments`).

## Tes wajib sebelum digunakan pelanggan sungguhan
- Incognito baru, tanpa login, dapat membuat draft dan upload foto.
- Tab di **browser lain** tidak dapat mengedit draft dari browser pertama (akses ditolak).
- URL `/invite/slug` belum tampil sebelum admin menyetujui.
- Pelanggan tidak bisa mengakses API admin atau tombol approve tanpa akun admin yang terverifikasi.
- Admin melihat bukti transfer yang diunggah tetapi **baru menyetujui setelah mutasi SeaBank benar-benar ada**.
- Setelah admin menyetujui, pelanggan klik “Perbarui status pembayaran”, undangan aktif dan bisa dibagikan.
- Tes di Vercel harus dilakukan sebelum transaksi uang asli.

## Batasan penting
- Token sesi tamu berlaku selama 30 hari. Jika pengguna membersihkan cookie, memakai mode incognito lain atau berpindah perangkat, draft **tidak dapat dipulihkan** lewat fitur saat ini. Link undangan yang sudah aktif tetap publik.
- Belum ada pemulihan draft melalui email/WhatsApp, pengingat otomatis admin, dan pembayaran otomatis SeaBank.
- Untuk bisnis produksi, sebaiknya ditambah **kode pesanan + tautan pemulihan sekali pakai** atau verifikasi nomor WA supaya pembeli tidak kehilangan akses saat mengganti perangkat.
- Jangan memasukkan PIN/OTP/password SeaBank ke kode ataupun environment Vercel.
- Kode sudah diperiksa sintaks untuk server route JS; build Next.js lengkap dan pengujian end-to-end Vercel belum dilakukan di lingkungan ini.
