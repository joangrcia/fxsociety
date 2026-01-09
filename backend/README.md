# fxsociety Backend

FastAPI backend for the fxsociety trading marketplace.

## Architecture

The project consists of three parts:
1. **Backend (`backend/`)**: FastAPI server handling API requests, database, and auth.
2. **Public Frontend (`frontend/`)**: Customer-facing React SPA (Shop, Dashboard, etc.).
3. **Admin CRM (`admin-frontend/`)**: Internal React SPA for management (Customers, Orders, Tickets).

## Tech Stack

- **Framework:** FastAPI
- **Database:** SQLite + SQLAlchemy
- **Validation:** Pydantic v2
- **Server:** Uvicorn
- **Auth:** OAuth2 + JWT (Argon2 Hashing)
- **Security:** Rate limiting, CORS hardening, Secure headers

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- uv (recommended) or pip

### Environment Variables (Required for Production)

Create a `.env` file in the `backend/` directory (or set system env vars).

| Variable | Description | Default (Dev Only) |
|----------|-------------|-------------------|
| `SECRET_KEY` | **CRITICAL**: Used for JWT signing. Must be a long random string. | `insecure-dev-key...` (Warns loudly) |
| `ADMIN_USERNAME` | Admin login username. | `None` (Must be set) |
| `ADMIN_PASSWORD` | Admin login password. | `None` (Must be set) |
| `CORS_ORIGINS` | JSON list of allowed origins. | `["http://localhost:5173", "http://localhost:5174", ...]` |

**Example `.env`:**
```ini
SECRET_KEY=change_this_to_a_very_long_random_string_in_production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_password_123
CORS_ORIGINS=["http://localhost:5173", "http://localhost:5174"]
```

### Installation

1. **Backend:**
   ```bash
   cd backend
   uv sync
   # Or pip install -e .
   ```

2. **Frontend (Public):**
   ```bash
   cd frontend
   npm install
   ```

3. **Frontend (Admin):**
   ```bash
   cd admin-frontend
   npm install
   ```

### Initialize Database

```bash
cd backend
uv run python -m app.seed
```

### Run Development Servers

You need to run 3 terminals:

1. **Backend:**
   ```bash
   cd backend
   uv run uvicorn app.main:app --reload --port 8000
   ```

2. **Public Frontend:**
   ```bash
   cd frontend
   npm run dev
   # Access at http://localhost:5173
   ```

3. **Admin CRM:**
   ```bash
   cd admin-frontend
   npm run dev
   # Access at http://localhost:5174/admin
   ```

## API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

(See Swagger UI for full list)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login` (Admin & User)

### Products
- `GET /api/products` (Public)
- `POST /api/products/admin` (Admin)

### Orders
- `POST /api/orders` (Public)
- `GET /api/orders/me` (User)

### CRM Module (Admin)
Requires Admin Token.

- **Stats**: `GET /api/admin/stats`
- **Customers**: `GET /api/admin/customers`
- **Customer Detail**: `GET /api/admin/customers/{id}` (includes tags, notes, activity)

## Database Schema

- `users`: Accounts (User & Admin via env fallback)
- `products`: Items for sale
- `orders`: Purchase records (linked to user)
- `tickets`: Support tickets
- `customer_tags`: CRM tags
- `customer_notes`: CRM internal notes
- `activity_logs`: CRM event timeline

## Security Checklist (Production)

- [ ] Set a strong `SECRET_KEY` in env.
- [ ] Set strong `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
- [ ] Set strict `CORS_ORIGINS` (no wildcards).
- [ ] Use HTTPS (via reverse proxy like Nginx/Caddy).
- [ ] Disable `uvicorn --reload`.
