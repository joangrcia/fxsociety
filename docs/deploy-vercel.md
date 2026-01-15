# Panduan Deploy fxsociety ke Vercel (Monorepo)

Tutorial ini akan membimbing Anda untuk melakukan deploy proyek fxsociety (Frontend Vite + Backend FastAPI) ke Vercel. Karena ini adalah monorepo, kita akan membuat **dua proyek terpisah** di Vercel yang terhubung ke satu repository Git yang sama.

## Daftar Isi
1. [Persiapan Repository](#1-persiapan-repository)
2. [Langkah 1: Deploy Backend (FastAPI)](#2-langkah-1-deploy-backend-fastapi)
3. [Langkah 2: Deploy Frontend (Vite/React)](#3-langkah-2-deploy-frontend-vitereact)
4. [Konfigurasi CORS (Penting)](#4-konfigurasi-cors-penting)
5. [Batasan SQLite di Vercel](#5-batasan-sqlite-di-vercel)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Persiapan Repository

Karena ini monorepo (frontend + backend), Vercel perlu tahu **file mana yang dijalankan** dan **dependency apa yang harus diinstal**.

### A. File yang Sudah Disiapkan (Tidak Perlu Buat Ulang)
Di repo ini, file-file berikut **sudah ditambahkan** dan siap dipakai untuk deploy di Vercel:

- `backend/api/index.py` (entrypoint backend untuk Vercel)
- `backend/vercel.json` (konfigurasi Vercel untuk backend FastAPI)
- `backend/requirements.txt` (dependency Python untuk build di Vercel)
- `frontend/vercel.json` (rewrite untuk React Router agar tidak 404 saat refresh)

Jadi, Anda **tidak perlu** menjalankan `uv pip compile`.

### B. Isi `backend/vercel.json` yang Benar
Pastikan isi `backend/vercel.json` seperti ini (sesuai setup repo sekarang):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.py"
    }
  ]
}
```

### C. `frontend/vercel.json` (Agar Refresh Tidak 404)
Pastikan file `frontend/vercel.json` ada dan isinya seperti ini:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### D. Catatan Penting untuk `backend/requirements.txt`
Vercel akan menginstal dependency dari `backend/requirements.txt`.

Kalau Anda menambah library Python baru di backend, jangan lupa update `backend/requirements.txt` dan push ke Git (cukup edit list dependency-nya—tidak perlu pakai `uv pip compile`).

---

## 2. Langkah 1: Deploy Backend (FastAPI)

1. Buka [Dashboard Vercel](https://vercel.com/dashboard) dan klik **"Add New"** > **"Project"**.
2. Pilih repository Git Anda.
3. Pada **Project Settings**:
   - **Project Name**: `fxsociety-backend`
   - **Framework Preset**: Pilih `Other`
   - **Root Directory**: Klik `Edit` dan pilih folder `backend`.
4. Buka bagian **Environment Variables** dan tambahkan:
   - `SECRET_KEY`: Masukkan string acak panjang (misal: `h3ll0-w0rld-v3ry-s3cur3`).
   - `ADMIN_USERNAME`: Username untuk panel admin (misal: `admin`).
   - `ADMIN_PASSWORD`: Password untuk panel admin (misal: `rahasia123`).
   - `CORS_ORIGINS`: Masukkan `["*"]` untuk sementara (akan diubah nanti).
5. Klik **Deploy**.
6. Setelah selesai, **simpan URL backend** Anda (contoh: `https://fxsociety-backend.vercel.app`).

---

## 3. Langkah 2: Deploy Frontend (Vite/React)

1. Kembali ke Dashboard Vercel, klik **"Add New"** > **"Project"** lagi menggunakan repo yang sama.
2. Pada **Project Settings**:
   - **Project Name**: `fxsociety-frontend`
   - **Framework Preset**: Pilih `Vite`
   - **Root Directory**: Klik `Edit` dan pilih folder `frontend`.
3. Buka bagian **Environment Variables** dan tambahkan:
   - `VITE_API_URL`: Masukkan URL Backend yang Anda simpan tadi (contoh: `https://fxsociety-backend.vercel.app`).
4. Klik **Deploy**.
5. Setelah selesai, **simpan URL frontend** Anda (contoh: `https://fxsociety-frontend.vercel.app`).

---

## 4. Konfigurasi CORS (Penting)

CORS (Cross-Origin Resource Sharing) adalah sistem keamanan yang membatasi siapa yang boleh mengakses API. 

1. Buka Dashboard Vercel untuk proyek **backend** (`fxsociety-backend`).
2. Pergi ke **Settings** > **Environment Variables**.
3. Edit variabel `CORS_ORIGINS`. Ganti `["*"]` menjadi URL frontend Anda dalam format list JSON:
   ```json
   ["https://fxsociety-frontend.vercel.app"]
   ```
4. **Penting**: Lakukan redeploy backend atau buat "Deployment" baru agar perubahan environment variable ini aktif.

---

## 5. Batasan SQLite di Vercel

Vercel menggunakan sistem file yang bersifat **Read-Only**. Artinya, file database SQLite tidak bisa disimpan permanen di dalam folder aplikasi.

Kabar baiknya: repo ini **sudah otomatis** menangani hal ini.

### Cara Kerja Database di Repo Ini (Otomatis)
Backend akan memilih database dengan urutan prioritas berikut:

1. Kalau ada environment variable `DATABASE_URL` → akan dipakai (ini cara override yang paling fleksibel).
2. Kalau berjalan di Vercel (env `VERCEL` terdeteksi) → otomatis pakai SQLite di `/tmp`:
   - `sqlite:////tmp/fxsociety.db`
3. Kalau jalan di lokal/dev → pakai file SQLite di repo backend:
   - `backend/fxsociety.db`

Jadi, Anda **tidak perlu** mengubah `backend/app/database.py` hanya untuk deploy ke Vercel.

### Override Manual (Opsional) dengan `DATABASE_URL`
Kalau Anda ingin menentukan lokasi/jenis database sendiri, set `DATABASE_URL` di Vercel (Project backend → Settings → Environment Variables).

Contoh (tetap pakai SQLite `/tmp`):
- `DATABASE_URL=sqlite:////tmp/fxsociety.db`

> **Catatan penting:** Data di folder `/tmp` akan **terhapus otomatis** saat cold start / instance diganti. Untuk penggunaan serius, disarankan pakai database cloud (misal PostgreSQL seperti Neon, atau SQLite managed seperti Turso).

---

## 6. Troubleshooting

### 1. Error: "CORS policy: No 'Access-Control-Allow-Origin' header..."
*   **Penyebab**: URL frontend belum terdaftar di `CORS_ORIGINS` backend.
*   **Solusi**: Pastikan `CORS_ORIGINS` di backend berisi URL frontend yang benar (tanpa garis miring `/` di akhir). Contoh: `["https://nama-web.vercel.app"]`.

### 2. Error 404 saat Refresh Halaman di Frontend
*   **Penyebab**: Vercel mencoba mencari file fisik untuk rute React (misal `/shop`), padahal itu hanya rute virtual.
*   **Solusi**: Pastikan Anda sudah membuat file `frontend/vercel.json` dengan konfigurasi `rewrites` ke `index.html`.

### 3. API Tidak Terkoneksi (API Not Reachable)
*   **Penyebab**: Nilai `VITE_API_URL` salah atau lupa menggunakan `https://`.
*   **Solusi**: Cek kembali Environment Variables di proyek frontend dan pastikan URL backend sudah benar.

### 4. Database Error: "attempt to write a readonly database"
*   **Penyebab**: Database diarahkan ke lokasi yang tidak bisa ditulis di Vercel.
*   **Solusi**: Pastikan Anda memakai versi repo terbaru (karena setup saat ini otomatis pakai `/tmp` di Vercel), atau override dengan `DATABASE_URL=sqlite:////tmp/fxsociety.db` seperti dijelaskan pada bagian [Batasan SQLite](#5-batasan-sqlite-di-vercel).
