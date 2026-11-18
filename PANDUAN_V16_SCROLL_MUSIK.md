# VIZEX v16 — Scroll Animation + 7 Musik Pilihan

## Perubahan utama

- Undangan sekarang menjadi **satu halaman panjang yang dapat di-scroll**. Menu navigasi bawah melakukan smooth-scroll ke bagian tujuan, tidak mengganti tab/halaman.
- Semua section (Pembuka, Doa, Mempelai, Acara, Galeri, RSVP, Hadiah) menampilkan animasi reveal saat masuk layar. Animasi termasuk fade-up, slide dari kiri/kanan, dan zoom-in. Ornamen bergerak dan latar memiliki efek parallax halus.
- Musik diambil dari **7 MP3 yang diunggah pengguna**. Tersedia pilihan musik di Editor → Foto & Musik dan preview dengan audio player. Default `Otomatis sesuai tema`.
- Lagu mulai dimainkan setelah tamu menekan **Buka Undangan** (sesuai ketentuan autoplay browser). Tamu bisa jeda dan putar kembali menggunakan ikon musik. Volume awal 23%.
- File suara dioptimalkan menjadi MP3 stereo 128 kbps agar lebih ringan; durasi dan isi musik tidak dipotong.
- RSVP Supabase, SeaBank manual, kontrol terbit setelah pembayaran, admin, dan pelanggan tanpa akun **tetap mempertahankan alur yang sudah ada**.

## Langkah update dari VIZEX v15

1. **Backup** repository dan data Supabase yang sudah aktif. Jangan menghapus data atau mengganti .env saat upgrade.
2. Download `VIZEX_v16_Update_Saja.zip`, ekstrak, dan upload **isi ZIP** ke root repository GitHub VIZEX. Folder `public/music` wajib ikut diunggah dengan semua MP3 baru.
3. Commit perubahan. Tunggu Vercel Deployments → **Ready**.
4. Buka `/demo/vizex-25` (Biru Keraton), `/demo/vizex-26` (Cream Peony), dan `/demo/vizex-27` (Green Horizon).
5. Klik **Buka Undangan**, pastikan musik berjalan, scroll panjang menampilkan efek masuk, lalu coba ikon play/pause dan menu bawah.
6. Di editor pelanggan, pilih menu **Foto & Musik**, ganti musik, dengarkan, klik **Simpan Draft**, refresh, cek pilihannya tersimpan.
7. Uji RSVP undangan yang sudah aktif dan konfirmasi bahwa link pembayaran belum disetujui **tetap terkunci**.

**Tidak perlu migrasi SQL tambahan** untuk v16. Nilai musik disimpan pada kolom JSON `data.musicTrack` yang sudah ada.

## Daftar musik bawaan yang ditambahkan

| Nama pilihan | Berkas MP3 publik | Durasi |
|---|---|---:|
| Wedding Music — Andriig | `public/music/andriig-wedding.mp3` | 2:04 |
| Ceremony Wedding — Alex Morgan | `public/music/alex-morgan-ceremony.mp3` | 3:00 |
| Wedding Story — Vlad Annenkov | `public/music/vlad-annenkov-wedding-story.mp3` | 3:22 |
| Wedding Invitation — Sahil Madan | `public/music/sahilmadan-invitation.mp3` | 0:33 |
| Invitation Wedding — Leberch | `public/music/leberch-invitation.mp3` | 1:50 |
| Jingle of the Night — Strains of Poise | `public/music/strainsofpoise-jingle.mp3` | 1:36 |
| Wedding — Prettyjohn1 | `public/music/prettyjohn1-wedding.mp3` | 1:00 |

Lagu lama `piano`, `gamelan`, dan `cinematic` tetap dapat dimainkan bila tersimpan di draft yang sudah ada.

## Ketersediaan dan keamanan

- Halaman demo statis bisa dilihat di `/preview-scroll-v16.html` setelah deploy. Ini contoh animasi dan musik **bukan** checkout/RSVP sungguhan; demo Next.js menggunakan komponen aktual dan API yang ada.
- Pembayaran SeaBank tetap menggunakan verifikasi admin manual. Tidak ada pengaturan nomor rekening atau key API baru.
- Musik hanya dimuat saat dibutuhkan (`preload="none"`), sehingga tujuh lagu tidak otomatis diunduh sekaligus.
- Sebelum dipakai pada jasa berbayar, **pastikan setiap lagu memiliki lisensi yang memperbolehkan penggunaan komersial, pengunggahan ulang, dan distribusi kepada tamu**, serta ikuti persyaratan kredit yang relevan. File audio disediakan pengguna; VIZEX tidak menyediakan lisensi musik.
- Pengujian yang dilakukan: pemeriksaan sintaks JSX, keberadaan aset lagu, dan simulasi browser untuk halaman demo scroll + reveal + pilihan lagu. **Build Next.js penuh dan pembayaran produksi belum diuji ulang.**

## Daftar berkas yang berubah

- `components/Invitation.jsx` — layout scroll panjang + animasi observer + navigasi anchor + pemutar musik
- `components/Editor.jsx` — pemilihan tujuh lagu + dengar preview
- `lib/music.js` — katalog track dan pengaturan otomatis sesuai tema
- `app/globals.css` — efek scroll, reveal, parallax, responsive
- `public/music/*.mp3` — tujuh lagu
- `public/preview-scroll-v16.html` — demo mandiri
