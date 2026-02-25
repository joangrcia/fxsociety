# fxsociety Backend2 (Django + DRF)

Backend2 adalah backend Django + DRF untuk menggantikan `backend/` (FastAPI). FastAPI tetap tersedia sebagai fallback.

## Jalankan lokal

```bash
cd backend2 && uv sync
uv run python manage.py runserver 0.0.0.0:8000
```

Setelah server aktif, cek health endpoint:

- `/`
- `/api/health`

## Environment variables

| Variable | Keterangan singkat | Default dev |
|---|---|---|
| `ENVIRONMENT` | Mode runtime (`development`/`dev` dianggap mode dev). | `development` |
| `SECRET_KEY` | Kunci aplikasi dan JWT. Wajib di production. | `insecure-dev-key-DO-NOT-USE-IN-PRODUCTION` |
| `ADMIN_USERNAME` | Username admin awal. Wajib di production. | `dev_admin` |
| `ADMIN_PASSWORD` | Password admin awal. Wajib di production. | `dev_password_123` |
| `CORS_ORIGINS` | Origin yang diizinkan (JSON list atau comma-separated). | daftar localhost dev |
| `DATABASE_URL` | URL database (`sqlite:///...` atau `postgresql://...`). | auto-select (lihat catatan DB) |
| `VERCEL` | Jika ada, pakai SQLite ephemeral Vercel. | tidak aktif |
| `ALGORITHM` | Algoritma JWT. | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Masa berlaku access token (menit). | `1440` |
| `JWT_ISSUER` | Nilai issuer JWT. | `fxsociety` |
| `JWT_AUDIENCE` | Nilai audience JWT. | `fxsociety-client` |

## Catatan pemilihan database

- Default lokal: memakai DB bersama di `backend/fxsociety.db`.
- Saat `VERCEL` ter-set: memakai `sqlite:////tmp/fxsociety.db`.
- Jika `DATABASE_URL` di-set: nilai ini selalu override default lain.

## Pindah frontend ke backend2

Atur `VITE_API_URL` di kedua frontend berikut agar menunjuk base URL backend2:

- `frontend/`
- `admin-frontend/`

Gunakan base URL tanpa trailing slash. Contoh: `http://localhost:8000`
