# fxsociety Frontend

Dark-themed, card-based trading marketplace website for beginner-friendly trading products.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v6

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
```

Build output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── shared/              # Reusable UI components
│   │       ├── Accordion.tsx
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── ContactCard.tsx
│   │       ├── Footer.tsx
│   │       ├── Navbar.tsx
│   │       ├── OrderRequestForm.tsx
│   │       ├── OrderSuccessView.tsx
│   │       ├── ProductCard.tsx
│   │       └── index.ts
│   ├── data/
│   │   └── products.ts          # Placeholder product data
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── HowItWorksPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── OrdersPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── ShopPage.tsx
│   │   ├── SupportPage.tsx
│   │   └── index.ts
│   ├── types/
│   │   ├── order.ts             # Order interfaces
│   │   └── product.ts           # Product interfaces
│   ├── utils/
│   │   └── orders.ts            # Order management (localStorage)
│   ├── App.tsx                  # Main app with routing
│   ├── index.css                # Tailwind + design tokens
│   └── main.tsx                 # Entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Design System

### Colors

- **Background Layers:** `#0a0a0f` → `#14141a` → `#1e1e26` → `#28283a`
- **Primary Accent:** Orange (`#f97316`)
- **Text:** Primary `#f5f5f7`, Secondary `#a1a1aa`, Muted `#71717a`

### Components

| Component | Description |
|-----------|-------------|
| `Button` | Primary, secondary, ghost variants with loading state |
| `Badge` | Category and status badges |
| `ProductCard` | Generic product display card |
| `Accordion` | Expandable FAQ items |
| `ContactCard` | Contact channel display |
| `Navbar` | Fixed navigation with mobile menu |
| `Footer` | Site footer with disclaimer |
| `OrderRequestForm` | Order form with product info, customer details |
| `OrderSuccessView` | Order confirmation with payment instructions |

## Pages

| Route | Page | Status |
|-------|------|--------|
| `/` | Home | Complete |
| `/shop` | Shop | Complete |
| `/how-it-works` | How It Works | Complete |
| `/about` | About Us | Complete |
| `/support` | Support | Complete |
| `/login` | Login | Complete (UI only) |
| `/product/:id` | Product Detail | Complete |
| `/orders` | My Orders | Complete |

## Order Flow

The manual order flow allows users to place orders without a payment gateway:

### Testing the Order Flow

1. **Browse Products**
   - Go to `/shop` or click "Shop" in navigation
   - Click any product card to view details

2. **View Product Detail**
   - Navigate to `/product/1` (or any product ID 1-8)
   - Review product information and pricing
   - Click "Pesan Sekarang" to start order

3. **Fill Order Form**
   - Enter your name, email, and WhatsApp number
   - Add optional notes
   - Click "Buat Pesanan"

4. **Order Confirmation**
   - View order ID and status ("Menunggu Konfirmasi")
   - See payment instructions (bank transfer details)
   - Click "Hubungi WhatsApp untuk Konfirmasi" to open WhatsApp with pre-filled message

5. **View Orders**
   - Navigate to `/orders` to see all your orders
   - Expand any order to see details
   - Orders are stored in localStorage (persists across page refreshes)

### Order Persistence

Orders are stored in browser localStorage under the key `fxsociety_orders`. Data persists until:
- User clears browser data
- User clicks "Hapus Semua" on the Orders page

### Order Statuses

| Status | Label | Description |
|--------|-------|-------------|
| `pending` | Menunggu Konfirmasi | Order created, awaiting payment |
| `confirmed` | Dikonfirmasi | Payment verified by admin |
| `completed` | Selesai | Product delivered |
| `cancelled` | Dibatalkan | Order cancelled |

Note: Currently only `pending` status is used (admin approval not yet implemented).

## Notes

- All UI copy is in Indonesian (Bahasa Indonesia)
- No backend integration yet - uses localStorage for order persistence
- Login/Register functionality is UI-only (no auth implemented)
- Trading disclaimer is present in footer per AGENTS.md requirements
- WhatsApp links use placeholder number (+62 812-3456-7890)
