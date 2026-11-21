# ManhwaVerse – PWA Direktori & Pelacak Bacaan Komik

> **"Temukan Ceritamu, Catat Perjalanan Bacamu."**

Aplikasi web berbasis **Progressive Web Apps (PWA)** untuk direktori komik manhwa & manhua sekaligus aplikasi pelacak progres bacaan (*reading tracker*) pribadi pengguna.

Proyek ini dibangun sebagai Tugas Akhir **Praktikum Pengembangan Perangkat Bergerak (PPB)** dengan mengintegrasikan:
- **Modul 1:** Pembuatan RESTful API menggunakan Node.js, Express.js, dan Supabase PostgreSQL.
- **Modul 5:** Pengembangan Progressive Web Apps (PWA) menggunakan ReactJS dan JavaScript.

---

## 1. Fitur Utama

- **Katalog & Direktori Komik (Beranda):** Menampilkan daftar komik lengkap dengan pencarian judul/penulis, filter genre, filter status (*Ongoing* / *Tamat*), dan rekomendasi pilihan redaksi.
- **Ensiklopedia Karakter:** Direktori tokoh utama dan antagonis dari setiap komik, dilengkapi filter peran (*Protagonis Utama*, *Tokoh Utama Pria*, *Antagonis*, *Karakter Pendukung*) serta pencarian.
- **Pelacak Bacaan Pribadi (*Reading Tracker*):**
  - Kategori *Sedang Dibaca* dan *Selesai Dibaca*.
  - Pembaruan chapter cepat (*+1 Ch*) dan modal penyesuaian progres.
  - Statistik bacaan (*Total Komik*, *Sedang Dibaca*, *Selesai Dibaca*).
- **Temukan Komik Berdasarkan Genre:** Eksplorasi 6 genre utama: *Historical*, *Thriller*, *Time Travel*, *Romance*, *Fantasy*, dan *Action*.
- **Profil & Identitas Pengguna:** Informasi akun, ringkasan aktivitas, ubah nama tampilan, dan informasi aplikasi.
- **Dua Halaman Detail Interaktif:**
  - *Comic Detail:* Menampilkan sinopsis lengkap, genre, author, status, total chapter, karakter terkait, dan tombol tambah ke daftar bacaan.
  - *Character Detail:* Menampilkan potret karakter, asal komik, peran, latar belakang, dan sifat tokoh.
- **Sistem Role & Autentikasi Pengguna:**
  - **Reader:** Membaca katalog, mengelola reading tracker pribadi.
  - **Admin:** Mengelola katalog (menambah, mengubah, dan menghapus komik, karakter, serta genre) melalui Panel Admin khusus.
- **Fitur Progressive Web Apps (PWA):**
  - Web App Manifest (`manifest.webmanifest`).
  - Service Worker (`sw.js`) dengan caching cerdas untuk kerangka antarmuka (*App Shell*).
  - Indikator deteksi status koneksi offline.
  - Tombol pasang/instal aplikasi ke perangkat (*Mobile & Desktop*).

---

## 2. Struktur Proyek

Aplikasi dikemas dalam **satu root project** dan **satu `package.json`**:

```text
ManhwaVerse/
├── public/
│   ├── icons/
│   │   ├── icon-192x192.png # Ikon PWA standar 192px
│   │   └── icon-512x512.png # Ikon PWA standar 512px
│   ├── favicon.svg          # Favicon browser format SVG
│   ├── manifest.webmanifest # Web App Manifest PWA
│   └── sw.js                # Service Worker PWA
├── src/
│   ├── assets/              # Aset gambar & ilustrasi
│   ├── components/          # Komponen UI (Navbar, Header, ComicCard, Modal, dll)
│   ├── context/             # AuthContext untuk manajemen sesi & role
│   ├── hooks/               # Custom hooks (useAuth, useOnlineStatus, usePWAInstall)
│   ├── layouts/             # MainLayout dengan persistent Bottom Nav
│   ├── pages/               # 5 Halaman Utama, 2 Halaman Detail, Auth, & Admin
│   ├── services/            # Axios API Services (auth, comic, character, tracker, genre)
│   ├── styles/              # index.css dengan styling tema editorial Tailwind
│   ├── App.jsx              # Routing aplikasi React Router
│   └── main.jsx             # Titik masuk React
├── server/
│   └── src/
│       ├── config/
│       │   └── supabase.js  # Konfigurasi Supabase Client & Service Role
│       ├── controllers/     # Controller penanganan request API
│       ├── middleware/      # Verifikasi token JWT & proteksi role Admin
│       ├── models/          # Model komunikasi database Supabase
│       ├── routes/          # RESTful routing Express
│       └── index.js         # Entry point server Express.js
├── .env.example             # Contoh konfigurasi environment
├── .env                     # File konfigurasi lokal
├── .gitignore
├── index.html               # Dokumen HTML utama
├── package.json             # Dependensi tunggal & script npm
├── postcss.config.js
├── tailwind.config.js       # Konfigurasi palet warna editorial
├── vite.config.js           # Konfigurasi Vite & proxy API lokal
└── README.md
```

---

## 3. Prasyarat Sistem

- **Node.js**: Versi 18 ke atas (Direkomendasikan v20 atau v24).
- **NPM**: Versi 9 ke atas.
- Akun gratis di [Supabase](https://supabase.com/).

---

## 4. Langkah Instalasi & Konfigurasi

### Langkah 1: Kloning & Masuk ke Folder Proyek
Buka terminal dan arahkan ke direktori proyek:
```bash
cd ManhwaVerse
```

### Langkah 2: Pasang Seluruh Dependensi
Jalankan perintah berikut pada root folder:
```bash
npm install
```

### Langkah 3: Konfigurasi Supabase Database
1. Buka [Supabase Dashboard](https://supabase.com/dashboard) dan buat proyek baru (misalnya bernama `ManhwaVerse`).
2. Masuk ke menu **SQL Editor** di sidebar Supabase.
3. Salin seluruh skrip SQL skema database (termasuk 6 tabel, RLS, trigger profil, dan seed data) lalu tempel ke dalam **SQL Editor** Supabase dan tekan tombol **RUN**.
4. Script tersebut akan otomatis membuat:
   - 6 Tabel utama (`profiles`, `comics`, `genres`, `comic_genres`, `characters`, `reading_tracker`).
   - Trigger pembuatan profil otomatis saat pengguna baru mendaftar di Supabase Auth.
   - Aturan keamanan **Row Level Security (RLS)**.
   - Data awal (*Seed Data*) berisi 6 genre populer, 6 komik terfavorit, serta 8 karakter utama.

### Langkah 4: Konfigurasi File `.env`
Buka file `.env` di root proyek dan isi dengan kredensial proyek Supabase Anda:
- Kredensial dapat dilihat di Supabase Dashboard -> **Project Settings** -> **API**.

```env
# Port Server Backend Lokal
PORT=3000

# Supabase Credentials
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Frontend API URL
VITE_API_BASE_URL=http://localhost:3000/api
```

> **Catatan:** Backend ManhwaVerse telah dilengkapi dengan *graceful local development fallback*. Jika Anda belum menghubungkan kunci Supabase, backend dan antarmuka tetap dapat diuji secara instan dengan data bawaan.

### Langkah 5: Menjadikan Akun sebagai Administrator (Role Admin)
Secara bawaan (*default*), seluruh pengguna yang mendaftar akan mendapatkan peran `reader`.
Untuk memberikan hak akses `admin`:
1. Daftarkan akun melalui halaman registrasi aplikasi (`/register`), misalnya: `admin@manhwaverse.com`.
2. Buka **SQL Editor** di Supabase Dashboard dan jalankan:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'admin@manhwaverse.com';
   ```
3. Akun tersebut kini memiliki hak akses penuh ke panel pengelolaan katalog komik, karakter, dan genre.

---

## 5. Cara Menjalankan Aplikasi

Cukup jalankan satu perintah berikut di root folder `ManhwaVerse`:

```bash
npm run dev
```

Perintah di atas menggunakan `concurrently` untuk menyalakan:
1. **Backend Server Express.js** pada `http://localhost:3000`
2. **Frontend Vite React** pada `http://localhost:5173`

Buka browser Anda dan akses:
👉 **`http://localhost:5173`**

### Perintah Lain yang Tersedia:
- `npm run dev:server`: Hanya menjalankan server backend (dengan nodemon).
- `npm run dev:client`: Hanya menjalankan frontend Vite.
- `npm run build`: Melakukan build produksi frontend ke folder `dist`.

---

## 6. Akun Cepat untuk Evaluasi & Pengujian

Tersedia tombol pintas pada halaman **Masuk (Login)** untuk penguji/dosen:
- **Reader Demo:** `reader@manhwaverse.com` (Kata Sandi: `password123`)
- **Admin Demo:** `admin@manhwaverse.com` (Kata Sandi: `password123`)

---

## 7. Desain UI/UX & Palet Warna Editorial

Aplikasi dirancang dengan estetika *modern editorial* bernuansa perpustakaan klasik:
- **Background Utama:** `#F5F2EB` (Warm Ivory)
- **Background Kartu:** `#FFFEFA` (Krem Bersih)
- **Teks Utama:** `#292820` (Deep Espresso)
- **Teks Sekunder:** `#77746B` (Muted Warm Grey)
- **Aksen Utama:** `#795044` (Terracotta / Cokelat Kemerahan)
- **Aksen Sekunder:** `#8B896E` (Muted Olive)
- **Border:** `#E5E0D6` (Halus & Elegan)
- **Tipografi:** *Literata* (Serif Editorial) untuk judul dan *Source Sans 3* (Sans-serif) untuk teks bacaan.

---

## 8. Deployment ke Vercel

Proyek ini telah dilengkapi dengan `vercel.json` dan `api/index.js` sehingga siap di-deploy ke Vercel:
1. Hubungkan repositori Git ke Vercel.
2. Tambahkan Environment Variables di Vercel Dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `VITE_API_BASE_URL=/api`
3. Tekan **Deploy**. Vercel akan otomatis membangun frontend dan menjalankan Express API sebagai serverless function.
