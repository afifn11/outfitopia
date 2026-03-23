# Outfitopia

Platform e-commerce fashion — React + Vite frontend, Node.js + Express backend, MySQL database, dengan integrasi pembayaran Midtrans.

![Outfitopia](client/public/Outfitopia.png)

---

## Tech Stack

| Layer    | Teknologi |
|----------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion, React Router DOM v7 |
| Backend  | Node.js, Express 5, nodemon |
| Database | MySQL 8.0+ |
| Auth     | JWT (jsonwebtoken), bcryptjs |
| Payment  | Midtrans |
| Email    | Nodemailer (Mailtrap untuk development) |
| Deploy   | Vercel |

---

## Fitur

**Pengguna (User)**
- Register & login dengan JWT
- Browse produk berdasarkan kategori
- Pencarian & filter produk
- Carousel produk unggulan & terlaris
- Detail produk dengan pilihan ukuran
- Keranjang belanja
- Checkout & pembayaran via Midtrans
- Riwayat pesanan
- Beri ulasan & rating produk
- Profil akun

**Admin**
- Dashboard statistik
- Kelola produk (tambah, edit, hapus)
- Kelola pesanan & ubah status
- Moderasi ulasan

---

## Struktur Proyek

```
outfitopia/
├── .github/
│   └── workflows/
│       └── ci.yml          ← GitHub Actions (lint, test, build)
├── database/
│   ├── schema.sql          ← Struktur tabel
│   ├── seed.sql            ← Data awal
│   ├── reset.sql           ← Reset database
│   └── add_payment_method.sql
├── server/                 ← Express API
│   ├── config/db.js
│   ├── controllers/        ← auth, product, order, review, admin, category
│   ├── middleware/         ← authMiddleware, adminMiddleware
│   ├── routes/             ← authRoutes, productRoutes, orderRoutes, adminRoutes, ...
│   ├── utils/emailService.js
│   ├── index.js
│   └── .env.example
├── client/                 ← React + Vite
│   ├── src/
│   │   ├── components/     ← Navbar, Footer, ProductCarousel, ReviewModal, ...
│   │   ├── context/        ← AuthContext, CartContext
│   │   ├── pages/          ← HomePage, ProductDetailPage, CheckoutPage, admin/...
│   │   ├── services/api.js
│   │   └── utils/format.js
│   └── .env.local
├── vercel.json
└── README.md
```

---

## Setup Lokal

### Prasyarat

- Node.js 20+
- MySQL 8.0+ (via XAMPP atau instalasi langsung)

### 1. Clone & Install

```bash
git clone https://github.com/username/outfitopia.git
cd outfitopia
```

### 2. Database

Buka MySQL via XAMPP atau terminal, lalu jalankan:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE outfitopia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE outfitopia;
SOURCE /path/ke/outfitopia/database/schema.sql;
SOURCE /path/ke/outfitopia/database/seed.sql;
```

### 3. Server

```bash
cd server
npm install
cp .env.example .env
```

Edit file `.env` dan sesuaikan nilainya:

```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=        # isi password MySQL kamu
DB_NAME=outfitopia

# JWT — ganti dengan random string minimal 32 karakter
JWT_SECRET=ganti_dengan_string_random_yang_panjang

# CORS
FRONTEND_URL=http://localhost:5173

# Email — gunakan Mailtrap untuk development
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
```

Jalankan server:

```bash
npm start
```

Server berjalan di: `http://localhost:5000`

### 4. Client

```bash
cd client
npm install
```

Buat file `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_MIDTRANS_CLIENT_KEY=Mid-client-xxxxxxxxxxxxxx   # dari dashboard Midtrans
```

Jalankan client:

```bash
npm run dev
```

Client berjalan di: `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/api/auth/register` | — | Daftar akun baru |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/products` | — | Semua produk |
| GET | `/api/products/featured` | — | Produk unggulan |
| GET | `/api/products/bestsellers` | — | Produk terlaris |
| GET | `/api/products/:id` | — | Detail produk |
| GET | `/api/categories` | — | Semua kategori |
| POST | `/api/orders` | User | Buat pesanan |
| GET | `/api/orders/my-orders` | User | Riwayat pesanan |
| GET | `/api/orders/:id` | User | Detail pesanan |
| POST | `/api/orders/notification` | — | Webhook Midtrans |
| POST | `/api/reviews` | User | Beri ulasan |
| GET | `/api/admin/orders` | Admin | Semua pesanan |
| PUT | `/api/admin/orders/:id/status` | Admin | Update status pesanan |
| POST | `/api/admin/products` | Admin | Tambah produk |
| PUT | `/api/admin/products/:id` | Admin | Edit produk |
| DELETE | `/api/admin/products/:id` | Admin | Hapus produk |
| GET | `/api/admin/reviews` | Admin | Semua ulasan |
| DELETE | `/api/admin/reviews/:id` | Admin | Hapus ulasan |

---

## Akun Demo

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@outfitopia.com | password123 |
| User  | afif@outfitopia.com | password123 |

---

## Deployment (Vercel)

Proyek sudah dikonfigurasi untuk deploy ke Vercel via `vercel.json`. Backend (Express) dan frontend (Vite build) di-serve dari satu project Vercel.

Set environment variable berikut di dashboard Vercel:

```
DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
JWT_SECRET
FRONTEND_URL
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
```

---

## CI/CD

GitHub Actions berjalan otomatis setiap push ke branch `main` atau `develop`:

- **Server**: type check → test → build
- **Client**: lint → build

Konfigurasi: `.github/workflows/ci.yml`