# VIZEX v9 — Pembayaran SeaBank Manual (GitHub → Vercel)

## Yang berubah
Pelanggan bisa pilih template → custom → simpan → **Bayar via SeaBank** → melihat nomor rekening dan nominal dari server → transfer → upload bukti pembayaran → **menunggu admin memeriksa mutasi SeaBank**. Setelah admin klik Setujui, undangan berubah `published` dan link `/invite/<slug>` dapat dibuka. Bukti transfer saja **tidak** mengaktifkan undangan.

Harga tetap mengikuti template di server: Rp19.000 / Rp29.000 / Rp39.000 / Rp59.000. Tidak ada nominal yang diterima dari input browser.

## 1. Update kode GitHub
Ekstrak ZIP, lalu upload **isi folder VIZEX** ke repository GitHub project yang saat ini terhubung ke Vercel. Pastikan struktur `app/`, `components/`, `lib/`, dan `supabase/` ada di root project. Commit agar Vercel melakukan deploy ulang.

## 2. Jalankan migrasi Supabase (penting)
Karena database VIZEX yang lama **sudah ada**, jangan jalankan ulang/menghapus database. Buka Supabase → SQL Editor → New query, lalu paste seluruh isi `supabase/seabank_migration.sql` dan klik Run. Migrasi menambahkan kolom `orders`, bucket privat `payment-proofs`, dan fungsi transaksi verifikasi admin. Jangan jalankan migrasi pada project yang salah.

## 3. Environment Variables Vercel
Vercel → Project → Settings → Environment Variables. Tambahkan variabel di bawah **pada Production** (dan Preview bila digunakan):

| Nama | Isi |
|---|---|
| `SEABANK_ACCOUNT_NUMBER` | Nomor rekening SeaBank penerima transfer (jangan tulis contoh secara permanen) |
| `SEABANK_ACCOUNT_NAME` | Nama pemilik rekening sesuai bank |
| `VIZEX_ADMIN_USER_IDS` | UUID akun ADMIN milik Anda di Supabase Authentication → Users, bukan email. Jika beberapa admin, pisahkan dengan koma. |

`SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` tetap diperlukan sesuai pengaturan v8. **Jangan** memakai awalan `NEXT_PUBLIC_` untuk variabel rekening, admin UID, atau service-role key. Jangan upload `.env.local` ke GitHub. Setelah mengubah environment variables, lakukan redeploy terbaru agar perubahan digunakan.

`ENABLE_CHECKOUT` dan `NEXT_PUBLIC_ENABLE_CHECKOUT` versi lama tetap `false`; tombol Midtrans lama tidak digunakan. Jalur pembayaran baru memakai `/api/manual/*`.

## 4. Cara pelanggan membayar
1. Login → pilih template → Custom → isi data/foto → **Bayar via SeaBank**.
2. Klik **Lihat rekening & nominal**; cek nama bank, penerima dan jumlah.
3. Pelanggan transfer di aplikasi banknya.
4. Pelanggan upload foto/PDF bukti transfer (maksimal 4 MB).
5. Status menjadi `submitted` / *Menunggu verifikasi admin*; link publik **tetap tidak aktif**.

## 5. Cara admin menyetujui
1. Login memakai akun Supabase dengan UUID yang tercantum pada `VIZEX_ADMIN_USER_IDS`.
2. Buka `https://DOMAIN-VIZEX.vercel.app/admin/payments` (ganti dengan URL Vercel Anda).
3. Klik **Muat / refresh pesanan**.
4. Buka bukti transfer jika ada, **lalu cek langsung transaksi masuk di aplikasi/mutasi SeaBank**, cocokkan jumlah dan identitas pembayaran.
5. Jika benar, klik **Setujui setelah cek mutasi** dan konfirmasi. Jika salah/tidak masuk, klik **Tolak bukti** disertai alasan. Sistem menolak persetujuan kedua pada pesanan yang sudah selesai.
6. Pelanggan dapat refresh status; ketika disetujui, link undangan aktif.

**Catatan:** Ini verifikasi MANUAL. Tidak ada akses otomatis ke mutasi SeaBank. Bukti transfer mudah dipalsukan, jadi jangan menyetujui hanya berdasarkan screenshot.

## 6. Uji sebelum menerima pembayaran sungguhan
- Login sebagai pelanggan uji → buat draft → masuk `/payment/<id>` → nominal sesuai template.
- Saat belum bayar, `/invite/<slug>` harus menampilkan “Undangan belum tersedia”.
- Upload bukti uji: status `submitted`; link tetap nonaktif.
- Login admin: cek admin lain yang **tidak** ada dalam allowlist mendapat HTTP 403 di `/api/manual/admin` dan `/api/manual/review`.
- Pastikan admin mengecek mutasi bank sebelum klik approve. Untuk tes alur, gunakan transaksi uji yang terkendali atau sandbox internal—jangan menyatakan dana masuk kalau tidak ada.
- Setelah persetujuan, link undangan aktif dan klik approve dua kali tidak boleh mengubah status lagi.
- Cek di HP dan desktop, termasuk upload PDF/JPG dan penolakan file >4 MB.

## Catatan operasional dan keamanan
- Belum ada QRIS otomatis / SeaBank VA / settlement gateway; ini hanya transfer ke rekening + konfirmasi admin.
- Admin bertanggung jawab atas validasi uang masuk, refund, dan layanan pelanggan. Siapkan kebijakan refund serta masa aktif undangan.
- Jangan bagikan kredensial Supabase service-role, token admin, atau password.
- Nomor rekening harus valid milik penerima, dan sebaiknya rekening khusus bisnis.
- Link undangan setelah publish memang bisa dibagikan. Data RSVP tetap menggunakan mekanisme VIZEX yang lama.
- Kode baru lolos pemeriksaan sintaks JavaScript API lokal, tetapi **belum diuji build Next.js dan integrasi end-to-end Supabase/Vercel** dalam sesi ini. Uji di deployment sebelum transaksi produksi.
