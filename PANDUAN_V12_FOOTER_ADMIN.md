# VIZEX v12 — Login Admin di Footer Hijau

1. Upload isi folder VIZEX_v12 ke root repository GitHub yang terhubung ke Vercel (bukan folder pembungkus).
2. File yang berubah: `components/Studio.jsx` dan `app/globals.css`.
3. Commit perubahan; tunggu deployment Vercel berstatus Ready.
4. Refresh `https://vizex-moment.vercel.app` (Ctrl+Shift+R) dan scroll ke footer hijau.
5. Klik tombol `🔐 Login Admin →`, yang menuju `/login`.
6. Login dengan akun Supabase admin yang UID-nya sudah terdaftar di `VIZEX_ADMIN_USER_IDS`.
7. Buka `/admin` untuk dashboard, atau `/admin/payments` untuk verifikasi pembayaran.

Tombol publik tidak memberikan akses admin; proteksi dilakukan di sisi server. Tidak perlu menjalankan SQL ulang atau mengganti Environment Variables.
