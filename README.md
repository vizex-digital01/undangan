# VIZEX — Digital Invitation Studio

Aplikasi Next.js App Router untuk website jasa undangan digital: katalog, editor, upload foto privat, draft, checkout Midtrans Snap, dan publikasi undangan **hanya setelah pembayaran terverifikasi**.

## Yang tersedia
- 12 tema premium sebagai basis template (bukan 39 seperti file HTML v6).
- Harga tetap dari server: Basic Rp19.000, Premium Rp29.000, Luxury Rp39.000, Exclusive Rp59.000.
- Login/daftar email+password menggunakan Supabase Auth.
- Draft hanya terlihat oleh pemilik; 12 foto privat per undangan, maks 4MB/foto.
- Sampul animatif, tombol Buka Undangan, reveal scroll, jadwal, galeri, RSVP WhatsApp, peta, rekening.
- Midtrans Snap sandbox/production; webhook dengan SHA-512 + cek nominal + transaksi SQL atomik dan idempoten.
- Link `/invite/slug` hanya menampilkan undangan jika `status=published`.

## Instal di komputer
1. Install Node.js 20 atau lebih baru.
2. Jalankan `npm install`.
3. Salin `.env.example` menjadi `.env.local` dan isi kredensial.
4. Di Supabase SQL Editor, jalankan **`supabase/schema.sql`** satu kali.
5. Di Supabase Authentication > Providers, aktifkan Email. Untuk mendaftar langsung, konfigurasikan verifikasi email sesuai kebutuhan.
6. Jalankan `npm run dev`, buka http://localhost:3000.

## Midtrans (pengujian)
1. Buat akun merchant Midtrans dan ambil Server Key serta Client Key **sandbox**.
2. Masukkan ke `.env.local`, set `MIDTRANS_IS_PRODUCTION=false`, `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false`.
3. Pada dashboard Midtrans, set Payment Notification URL menjadi `https://DOMAIN-VERCEL/api/midtrans/webhook`.
4. Untuk uji webhook dari localhost gunakan tunnel HTTPS tepercaya atau deploy terlebih dahulu ke Vercel. Checkout sukses tanpa webhook **tidak** mengaktifkan undangan.
5. Pastikan pembayaran settlement/capture verified dan undangan muncul sebagai Published.

## Deploy GitHub → Vercel
1. Buat repository GitHub baru (misalnya `vizex-invitation`). Upload **isi folder project ini**, tidak termasuk `.env.local`, `node_modules`, `.next`.
2. Vercel > Add New Project > Import repository GitHub.
3. Framework Next.js; set semua key `.env.example` di Project Settings > Environment Variables. Set `NEXT_PUBLIC_SITE_URL=https://domain-kamu.vercel.app` (tanpa garis miring terakhir).
4. Deploy; buka URL untuk memastikan berfungsi.
5. Set Midtrans notification URL menggunakan domain final di Vercel, lalu lakukan tes end-to-end sandbox.
6. Untuk production, ganti ke key Midtrans production dan kedua flag production `true`, baru setelah semua alur diuji dan akun merchant disetujui.

## Catatan keamanan dan operasional
- **Service role Supabase & Server Key Midtrans rahasia.** Jangan memakai prefix `NEXT_PUBLIC_` untuk kedua rahasia tersebut atau menaruhnya di GitHub.
- Jangan memakai `next export` / static GitHub Pages: ini aplikasi dengan server routes.
- Foto disimpan dalam bucket private. Tautan foto bertanda tangan berlaku 1 jam; pengguna dengan undangan lama terbuka mungkin perlu refresh untuk menampilkan foto lagi.
- Link preview hanya untuk pelanggan yang login; bukti pembayaran dari frontend tidak pernah langsung menerbitkan undangan.
- Belum ada panel admin, pembayaran refund/reversal, surat invoice, custom domain per undangan, dashboard RSVP tersimpan, sistem email, watermark anti-screenshot, atau penghapusan foto secara mandiri. RSVP hanya redirect WhatsApp.
- Sistem belum diuji dengan key Supabase/Midtrans sungguhan; lakukan tes sandbox, tes mobile, dan audit keamanan sebelum menerima pembayaran riil.

## Update v7 — fokus website dan katalog (18 November 2026)
- Identitas brand tetap **VIZEX**; nama pasangan dalam demo hanya **Raka & Naira**.
- Landing page diperbarui dengan komposisi editorial luxury, hero undangan lanskap biru, empat langkah proses, dan 12 kartu template triptych (tiga panel).
- Setiap template sekarang mempunyai **tombol Preview** yang langsung membuka `/demo/vizex-1` dan seterusnya **tanpa login**. Data yang muncul hanya data contoh, bukan data pelanggan.
- Tombol **Custom** mengarah ke alur login Supabase lalu editor pelanggan. Penyimpanan draft dan upload foto memerlukan koneksi Supabase sesuai konfigurasi di atas.
- Animasi pembuka memakai efek zoom-blur dari sampul ke isi, dan setiap section muncul saat discroll; gaya bingkai sampul bervariasi antar tema.
- **Checkout dinonaktifkan secara default**. `.env.example` memakai `NEXT_PUBLIC_ENABLE_CHECKOUT=false` dan `ENABLE_CHECKOUT=false`; tombol publikasi tidak aktif dan server checkout menolak permintaan. Jangan aktifkan kedua flag sampai gateway, server webhook, dan transaksi sandbox terbukti aman.
- Status **belum diuji melalui `npm run build`** karena instalasi paket tidak berhasil dijalankan di lingkungan pembuatan. Setelah `npm install`, jalankan `npm run build` dan uji browser sebelum deploy production.

## Pengujian cepat yang harus dilakukan
1. `npm install` dan `npm run dev`.
2. Buka `/`, cek filter harga dan layout desktop/HP.
3. Klik Preview untuk tema biru dan dark. Klik **Buka Undangan** lalu scroll ke bawah, cek tombol **Ulangi opening**.
4. Hubungkan Supabase sesuai instruksi di atas, buat akun dan draft, lalu uji upload foto.
5. Pastikan tombol publikasi terkunci; endpoint `POST /api/checkout` harus menolak permintaan dalam mode pengembangan.
