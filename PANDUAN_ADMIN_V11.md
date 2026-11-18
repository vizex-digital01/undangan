# VIZEX v11 — Login Admin & Kelola Pembayaran

## Yang ditambahkan
- Tombol **Login Admin** di header website dan **Area Admin** di footer, tanpa mengharuskan pelanggan membuat akun.
- `/login`: login admin via akun Supabase yang sudah ada.
- `/admin`: ringkasan transaksi, jumlah menunggu verifikasi, jumlah disetujui, dan total nominal yang disetujui.
- `/admin/payments`: filter status, cari ID pesanan, lihat bukti transfer melalui tautan sementara, setujui/tolak dengan catatan.
- API pembayaran tetap memverifikasi UID admin dari `VIZEX_ADMIN_USER_IDS` di server.

## Deploy
1. Backup repository GitHub VIZEX saat ini.
2. Upload **isi folder VIZEX** dari ZIP ini ke root repository, timpa file versi lama, lalu commit.
3. Tunggu deployment baru Vercel hingga Ready. Jika environment variable ditambahkan setelah deploy, redeploy.
4. Pastikan variabel `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SEABANK_ACCOUNT_NUMBER`, `SEABANK_ACCOUNT_NAME`, dan `VIZEX_ADMIN_USER_IDS` tersedia di Production.
5. Tidak perlu jalankan ulang migrasi SQL jika migrasi v10 dan v9 sudah berhasil.
6. Buka website utama, klik **Login Admin**, login, lalu pilih **Verifikasi Pembayaran**.

## Keamanan & pengujian
- Hanya akun yang UID Supabase-nya masuk `VIZEX_ADMIN_USER_IDS` boleh membaca daftar pesanan dan memproses persetujuan melalui API.
- Link login admin boleh terlihat publik; ini **bukan** pemberian hak admin.
- Jangan pernah membagikan password, kunci service role, PIN/OTP SeaBank.
- Cocokkan dana masuk di SeaBank, **bukan screenshot bukti saja**, sebelum menyetujui.
- Uji akun biasa tidak bisa mengakses data pembayaran admin; pastikan API mengembalikan 403.
- Belum ada integrasi mutasi SeaBank otomatis; verifikasi tetap manual.
